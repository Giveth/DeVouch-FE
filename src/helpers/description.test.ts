import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getDescriptionHtml, sanitizeDescriptionHtml } from './description';

const clean = sanitizeDescriptionHtml;

describe('sanitizeDescriptionHtml: formatting that is kept', () => {
	it('keeps headings, paragraphs and inline formatting', () => {
		const html =
			'<h1>Title</h1><h2>Sub</h2><h6>Small</h6>' +
			'<p>Some <strong>bold</strong>, <em>italic</em>, <u>underlined</u> and <code>code</code>.</p>' +
			'<blockquote>Quote</blockquote><pre>pre</pre><hr />line<br />break';
		assert.equal(clean(html), html);
	});

	it('keeps ordered and unordered lists', () => {
		const html =
			'<ul><li>One</li><li>Two<ul><li>Nested</li></ul></li></ul>' +
			'<ol start="3"><li>Three</li></ol>';
		assert.equal(clean(html), html);
	});

	it('keeps tables', () => {
		const html =
			'<table><caption>Budget</caption><thead><tr><th colspan="2">Item</th></tr></thead>' +
			'<tbody><tr><td>Dev</td><td rowspan="2">10</td></tr></tbody></table>';
		assert.equal(clean(html), html);
	});

	it('keeps http, https and mailto links and opens them safely', () => {
		assert.equal(
			clean('<a href="https://giveth.io/project">site</a>'),
			'<a href="https://giveth.io/project" target="_blank" rel="noopener noreferrer nofollow">site</a>',
		);
		assert.match(
			clean('<a href="http://example.org">x</a>'),
			/href="http:/,
		);
		assert.match(
			clean('<a href="mailto:team@example.org">x</a>'),
			/href="mailto:team@example.org"/,
		);
	});

	it('overrides a link target and rel supplied by the source', () => {
		const out = clean(
			'<a href="https://example.org" target="_top" rel="opener">x</a>',
		);
		assert.match(out, /target="_blank"/);
		assert.match(out, /rel="noopener noreferrer nofollow"/);
		assert.doesNotMatch(out, /_top|rel="opener"/);
	});

	it('keeps images with their alt text and size', () => {
		const html =
			'<img src="https://ipfs.io/ipfs/abc.png" alt="Logo" width="200" height="100" />';
		assert.equal(clean(html), html);
	});

	it('keeps text alignment and text colours', () => {
		const html =
			'<p style="text-align:center">Centered</p>' +
			'<span style="color:rgb(230, 0, 0);background-color:#ffff00">Marked</span>';
		assert.equal(clean(html), html);
	});

	it('leaves plain text untouched and handles empty input', () => {
		assert.equal(
			clean('Just a plain description.'),
			'Just a plain description.',
		);
		assert.equal(clean(''), '');
		assert.equal(clean(undefined), '');
		assert.equal(clean(null), '');
	});
});

describe('sanitizeDescriptionHtml: content that is removed', () => {
	it('removes script elements together with their content', () => {
		const out = clean(
			'<p>Hi</p><script>alert(1)</script><SCRIPT SRC=//x.io/a.js></SCRIPT>',
		);
		assert.equal(out, '<p>Hi</p>');
	});

	it('removes event handler attributes', () => {
		const out = clean(
			'<img src=x onerror=alert(1)>' +
				'<img src="https://example.org/a.png" onerror="alert(1)" onload="alert(2)">' +
				'<p onclick="alert(3)" onmouseover=alert(4)>text</p>' +
				'<a href="https://example.org" OnClick="alert(5)">link</a>',
		);
		assert.doesNotMatch(out, /\son[a-z]+\s*=/i);
		assert.doesNotMatch(out, /alert/);
		assert.match(out, /<p>text<\/p>/);
	});

	it('removes dangerous URL schemes from links and images', () => {
		const out = clean(
			'<a href="javascript:alert(1)">a</a>' +
				'<a href="JaVaScRiPt:alert(1)">b</a>' +
				'<a href="java&#x09;script:alert(1)">c</a>' +
				'<a href=" &#14; javascript:alert(1)">d</a>' +
				'<a href="vbscript:msgbox(1)">e</a>' +
				'<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">f</a>' +
				'<img src="javascript:alert(1)">' +
				'<img src="data:image/svg+xml,<svg onload=alert(1)>">',
		);
		assert.doesNotMatch(out, /script:|data:|alert|msgbox/i);
		assert.doesNotMatch(out, /href=|src=/);
	});

	it('removes forms and form controls', () => {
		const out = clean(
			'<form action="https://evil.example/collect" method="post">' +
				'<input type="password" name="seed" />' +
				'<textarea>secret</textarea>' +
				'<select><option>1</option></select>' +
				'<button formaction="https://evil.example">Connect wallet</button>' +
				'</form>',
		);
		assert.doesNotMatch(
			out,
			/<(form|input|textarea|select|option|button)\b/i,
		);
		assert.doesNotMatch(out, /evil\.example/);
	});

	it('removes embedding and document-level elements', () => {
		const out = clean(
			'<iframe src="https://evil.example"></iframe>' +
				'<iframe srcdoc="<script>alert(1)</script>"></iframe>' +
				'<object data="https://evil.example/x.swf"></object>' +
				'<embed src="https://evil.example/x.swf">' +
				'<svg onload="alert(1)"><script>alert(1)</script><a xlink:href="javascript:alert(1)">x</a></svg>' +
				'<math><mtext><script>alert(1)</script></mtext></math>' +
				'<style>body{display:none}</style>' +
				'<link rel="stylesheet" href="https://evil.example/x.css">' +
				'<meta http-equiv="refresh" content="0;url=https://evil.example">' +
				'<base href="https://evil.example/">' +
				'<video src="https://evil.example/v.mp4" onerror="alert(1)"></video>',
		);
		assert.doesNotMatch(
			out,
			/<(iframe|object|embed|svg|math|script|style|link|meta|base|video)\b/i,
		);
		assert.doesNotMatch(out, /evil\.example|alert|display:none/);
	});

	it('removes style declarations that could reposition or restyle the page', () => {
		const out = clean(
			'<div style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background-color:#fff">overlay</div>' +
				'<p style="background-image:url(https://evil.example/t.gif);color:red">x</p>' +
				'<p style="background-color:url(https://evil.example/t.gif)">y</p>' +
				'<span style="display:none;opacity:0;font-size:999px;margin:-999px">z</span>' +
				'<p style="color:expression(alert(1))">w</p>' +
				'<p style="text-align:center;float:right">v</p>',
		);
		assert.doesNotMatch(
			out,
			/position|z-index|width|height|top|left|url\(|display|opacity|font-size|margin|float|expression/i,
		);
		assert.match(out, /<div style="background-color:#fff">overlay<\/div>/);
		assert.match(out, /<p style="color:red">x<\/p>/);
		assert.match(out, /<p style="text-align:center">v<\/p>/);
	});

	it('removes class and id so source markup cannot use app styles', () => {
		const out = clean(
			'<div class="fixed inset-0 z-50 bg-white" id="wallet-modal">x</div>' +
				'<a href="https://example.org" class="absolute inset-0" name="location">y</a>',
		);
		assert.doesNotMatch(out, /class=|id=|name=/);
	});

	it('removes srcset, data-* and other unlisted attributes', () => {
		const out = clean(
			'<img src="https://example.org/a.png" srcset="https://evil.example/b.png 2x" data-x="1" loading="lazy" style="position:fixed">' +
				'<p contenteditable="true" tabindex="0" data-name="x">t</p>',
		);
		assert.equal(out, '<img src="https://example.org/a.png" /><p>t</p>');
	});

	it('does not let malformed or nested markup smuggle a tag through', () => {
		const out = clean(
			'<scr<script>ipt>alert(1)</scr</script>ipt>' +
				'<img src="https://example.org/a.png" alt="\'><script>alert(1)</script>">' +
				'<p title="--><img src=x onerror=alert(1)>">a</p>' +
				'<!-- <img src=x onerror=alert(1)> -->' +
				'<<img src=x onerror=alert(1)>',
		);
		assert.doesNotMatch(out, /<script/i);
		assert.doesNotMatch(out, /<[^>]*\son[a-z]+\s*=/i);
		assert.doesNotMatch(out, /<!--/);
	});

	it('is stable when applied twice', () => {
		const once = clean(
			'<h2>About</h2><p style="text-align:center;position:fixed">Hi <a href="https://example.org">there</a></p><img src=x onerror=alert(1)>',
		);
		assert.equal(clean(once), once);
	});
});

const PLAYER =
	'<iframe class="ql-video" src="https://www.youtube.com/embed/s0kqmjopiRs" title="YouTube video player" allowfullscreen="true" loading="lazy" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"></iframe>';

describe('sanitizeDescriptionHtml: video embeds', () => {
	it('keeps a YouTube embed as written by the Giveth editor', () => {
		assert.equal(
			clean(
				'<div class="ql-video-wrapper"><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/s0kqmjopiRs?showinfo=0"></iframe></div>',
			),
			`<div class="ql-video-wrapper">${PLAYER}</div>`,
		);
	});

	it('keeps the privacy-enhanced YouTube host', () => {
		assert.match(
			clean(
				'<iframe src="https://www.youtube-nocookie.com/embed/s0kqmjopiRs"></iframe>',
			),
			/src="https:\/\/www\.youtube-nocookie\.com\/embed\/s0kqmjopiRs"/,
		);
	});

	it('rebuilds the iframe, dropping every attribute and query parameter from the source', () => {
		const out = clean(
			'<iframe src="https://www.youtube.com/embed/s0kqmjopiRs?autoplay=1&amp;playlist=x#frag"' +
				' srcdoc="<script>alert(1)</script>" onload="alert(1)" sandbox="allow-top-navigation allow-forms"' +
				' allow="camera; microphone" name="top" id="x" width="9999" height="9999"' +
				' style="position:fixed;inset:0" class="fixed inset-0 z-50 ql-video"><script>alert(1)</script></iframe>',
		);
		assert.ok(out.startsWith(PLAYER.replace('</iframe>', '')));
		assert.doesNotMatch(
			out,
			/autoplay|playlist|srcdoc|onload|allow-top-navigation|allow-forms|camera|name=|id=|width|height|style=|fixed|inset/,
		);
		assert.doesNotMatch(out, /<script/i);
	});

	const rejected: Record<string, string> = {
		'another site': 'https://evil.example/embed/s0kqmjopiRs',
		'a lookalike host':
			'https://www.youtube.com.evil.example/embed/s0kqmjopiRs',
		'a host suffix match': 'https://evilwww.youtube.com/embed/s0kqmjopiRs',
		'an unlisted YouTube subdomain':
			'https://m.youtube.com/embed/s0kqmjopiRs',
		'the bare domain': 'https://youtube.com/embed/s0kqmjopiRs',
		'credentials before the host':
			'https://www.youtube.com@evil.example/embed/s0kqmjopiRs',
		'a userinfo prefix':
			'https://user:pass@www.youtube.com/embed/s0kqmjopiRs',
		'a custom port': 'https://www.youtube.com:8443/embed/s0kqmjopiRs',
		'plain http': 'http://www.youtube.com/embed/s0kqmjopiRs',
		'a protocol-relative URL': '//www.youtube.com/embed/s0kqmjopiRs',
		'a relative URL': '/embed/s0kqmjopiRs',
		'a backslash host trick':
			'https://evil.example\\@www.youtube.com/embed/s0kqmjopiRs',
		'a non-embed YouTube page':
			'https://www.youtube.com/watch?v=s0kqmjopiRs',
		'a YouTube redirect':
			'https://www.youtube.com/redirect?q=https://evil.example',
		'path traversal out of /embed':
			'https://www.youtube.com/embed/../redirect?q=https://evil.example',
		'an extra path segment':
			'https://www.youtube.com/embed/s0kqmjopiRs/extra',
		'a malformed video id': 'https://www.youtube.com/embed/short',
		'an embed without an id': 'https://www.youtube.com/embed/',
		'a javascript: URL': 'javascript:alert(1)',
		'a data: URL': 'data:text/html,<script>alert(1)</script>',
		'another video host': 'https://www.dailymotion.com/embed/video/x8abcde',
		'an empty src': '',
	};

	for (const [name, src] of Object.entries(rejected)) {
		it(`removes an iframe pointing at ${name}`, () => {
			assert.equal(
				clean(`<p>a</p><iframe src="${src}">inner</iframe><p>b</p>`),
				'<p>a</p><p>b</p>',
			);
		});
	}

	it('removes YouTube player modes that are not a single video', () => {
		for (const src of [
			'https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG',
			'https://www.youtube.com/embed/videoseries',
			'https://www.youtube.com/embed/live_stream?channel=UCx0sYbCqOb8TBPRdmBHs5If',
		]) {
			assert.equal(
				clean(`<p>a</p><iframe src="${src}"></iframe><p>b</p>`),
				'<p>a</p><p>b</p>',
			);
		}
	});

	it('lets a page opened from the player leave the sandbox, and grants nothing else', () => {
		const sandbox = /sandbox="([^"]*)"/.exec(
			clean(
				'<iframe src="https://player.vimeo.com/video/978266359"></iframe>',
			),
		)?.[1];
		assert.deepEqual(sandbox?.split(' ').sort(), [
			'allow-popups',
			'allow-popups-to-escape-sandbox',
			'allow-presentation',
			'allow-same-origin',
			'allow-scripts',
		]);
	});

	const vimeo = (src: string) =>
		`<iframe class="ql-video" src="${src}" title="Vimeo video player" allowfullscreen="true" loading="lazy" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"></iframe>`;

	it('keeps a Vimeo embed as written by the Giveth editor', () => {
		assert.equal(
			clean(
				'<div class="ql-video-wrapper"><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://player.vimeo.com/video/978266359/"></iframe></div>',
			),
			`<div class="ql-video-wrapper">${vimeo('https://player.vimeo.com/video/978266359')}</div>`,
		);
		assert.equal(
			clean(
				'<iframe src="https://player.vimeo.com/video/112955569"></iframe>',
			),
			vimeo('https://player.vimeo.com/video/112955569'),
		);
	});

	it('keeps the access hash of an unlisted Vimeo video and nothing else from the query', () => {
		assert.equal(
			clean(
				'<iframe src="https://player.vimeo.com/video/789151068?h=525341b301&amp;amp;badge=0&amp;amp;autopause=0&amp;amp;player_id=0&amp;amp;app_id=58479"></iframe>',
			),
			vimeo('https://player.vimeo.com/video/789151068?h=525341b301'),
		);
		assert.equal(
			clean(
				'<iframe src="https://player.vimeo.com/video/789151068?autoplay=1&amp;h=525341b301&amp;muted=1#t=10"></iframe>',
			),
			vimeo('https://player.vimeo.com/video/789151068?h=525341b301'),
		);
	});

	it('drops a malformed Vimeo access hash but keeps the video', () => {
		for (const h of [
			'"onload="alert(1)',
			'525341b301&autoplay=1',
			'525341b301%26autoplay%3D1',
			'ZZZZZZZZ',
			'abc',
			'a'.repeat(64),
			'javascript:alert(1)',
		]) {
			assert.equal(
				clean(
					`<iframe src="https://player.vimeo.com/video/789151068?h=${encodeURIComponent(h)}"></iframe>`,
				),
				vimeo('https://player.vimeo.com/video/789151068'),
			);
		}
	});

	it('rebuilds a Vimeo iframe, dropping every attribute from the source', () => {
		const out = clean(
			'<iframe src="https://player.vimeo.com/video/978266359"' +
				' srcdoc="<script>alert(1)</script>" onload="alert(1)" sandbox="allow-top-navigation allow-forms"' +
				' allow="camera; microphone" name="top" id="x" width="9999" height="9999"' +
				' style="position:fixed;inset:0" class="fixed inset-0 z-50"><script>alert(1)</script></iframe>',
		);
		assert.ok(
			out.startsWith(
				vimeo('https://player.vimeo.com/video/978266359').replace(
					'</iframe>',
					'',
				),
			),
		);
		assert.doesNotMatch(
			out,
			/srcdoc|onload|allow-top-navigation|allow-forms|camera|name=|id=|width|height|style=|fixed|inset/,
		);
		assert.doesNotMatch(out, /<script/i);
	});

	const rejectedVimeo: Record<string, string> = {
		'the main Vimeo site': 'https://vimeo.com/978266359',
		'the www Vimeo host': 'https://www.vimeo.com/video/978266359',
		'a Vimeo lookalike host':
			'https://player.vimeo.com.evil.example/video/978266359',
		'a Vimeo host suffix match':
			'https://evilplayer.vimeo.com/video/978266359',
		'credentials before a Vimeo host':
			'https://player.vimeo.com@evil.example/video/978266359',
		'a Vimeo userinfo prefix':
			'https://user:pass@player.vimeo.com/video/978266359',
		'a Vimeo custom port': 'https://player.vimeo.com:8443/video/978266359',
		'Vimeo over plain http': 'http://player.vimeo.com/video/978266359',
		'a protocol-relative Vimeo URL': '//player.vimeo.com/video/978266359',
		'a Vimeo backslash host trick':
			'https://evil.example\\@player.vimeo.com/video/978266359',
		'a non-numeric Vimeo id': 'https://player.vimeo.com/video/abc123',
		'an over-long Vimeo id': 'https://player.vimeo.com/video/1234567890123',
		'a Vimeo path without an id': 'https://player.vimeo.com/video/',
		'a Vimeo path with an extra segment':
			'https://player.vimeo.com/video/978266359/config',
		'Vimeo path traversal':
			'https://player.vimeo.com/video/../api/978266359',
		'an encoded slash in a Vimeo path':
			'https://player.vimeo.com/video/978266359%2F..%2Fx',
		'another Vimeo player path':
			'https://player.vimeo.com/external/978266359',
		'a YouTube path on the Vimeo host':
			'https://player.vimeo.com/embed/s0kqmjopiRs',
		'a Vimeo path on the YouTube host':
			'https://www.youtube.com/video/978266359',
	};

	for (const [name, src] of Object.entries(rejectedVimeo)) {
		it(`removes an iframe pointing at ${name}`, () => {
			assert.equal(
				clean(`<p>a</p><iframe src="${src}">inner</iframe><p>b</p>`),
				'<p>a</p><p>b</p>',
			);
		});
	}

	it('removes an iframe with no src or only a srcdoc', () => {
		assert.equal(
			clean(
				'<iframe></iframe><iframe srcdoc="<p>hi</p>"></iframe><iframe class="ql-video" allowfullscreen="true"></iframe>',
			),
			'',
		);
	});
});

describe('sanitizeDescriptionHtml: editor classes', () => {
	it('keeps the Quill size, font and indent classes', () => {
		const html =
			'<p><span class="ql-size-small">s</span><strong class="ql-size-large">l</strong><em class="ql-size-huge">h</em></p>' +
			'<p><span class="ql-font-monospace">mono</span></p>' +
			'<ul><li class="ql-indent-1">one</li><li class="ql-indent-2">two</li></ul>' +
			'<p class="ql-indent-8">deep</p><blockquote class="ql-indent-3">q</blockquote>';
		assert.equal(clean(html), html);
	});

	it('keeps an allowed class while dropping the others on the same element', () => {
		assert.equal(
			clean(
				'<p class="fixed ql-indent-1 inset-0 z-50 bg-white">x</p>' +
					'<span class="ql-size-large absolute top-0 left-0 w-screen h-screen">y</span>',
			),
			'<p class="ql-indent-1">x</p><span class="ql-size-large">y</span>',
		);
	});

	it('removes app utility and positioning classes', () => {
		const out = clean(
			'<div class="fixed inset-0 z-50 bg-white">overlay</div>' +
				'<a href="https://example.org" class="absolute inset-0 opacity-0">cover</a>' +
				'<p class="hidden sr-only pointer-events-none">p</p>' +
				'<span class="container hover-gradient-text project-description">s</span>' +
				'<img src="https://example.org/a.png" class="fixed w-screen h-screen" />',
		);
		assert.doesNotMatch(out, /class=/);
	});

	it('removes Quill classes that are not on the list', () => {
		const out = clean(
			'<div class="ql-editor ql-container ql-snow ql-toolbar ql-tooltip ql-hidden ql-clipboard">a</div>' +
				'<span class="ql-cursor ql-emojiblot ql-indent-9 ql-indent-10 ql-size-enormous ql-font-serif ql-align-center">b</span>',
		);
		assert.doesNotMatch(out, /class=/);
	});

	it('does not match classes by prefix, case or surrounding characters', () => {
		const out = clean(
			'<p class="ql-indent-1x xql-indent-1 QL-INDENT-1 ql-indent-1\\"onclick ql-size-large;fixed">a</p>' +
				'<p class="ql-indent-1&#9;fixed&#10;inset-0">b</p>',
		);
		assert.equal(out, '<p>a</p><p class="ql-indent-1">b</p>');
	});

	it('keeps the video classes only on the elements they belong to', () => {
		assert.equal(
			clean(
				'<span class="ql-video ql-video-wrapper">a</span><p class="ql-video-wrapper">b</p><div class="ql-video ql-video-wrapper">c</div>',
			),
			'<span>a</span><p>b</p><div class="ql-video-wrapper">c</div>',
		);
	});
});

describe('sanitizeDescriptionHtml: protocol-relative URLs', () => {
	it('removes a protocol-relative link target but keeps the link text', () => {
		assert.equal(
			clean('<a href="//evil.example/path">site</a>'),
			'<a>site</a>',
		);
	});

	it('removes a protocol-relative image source', () => {
		assert.equal(
			clean('<img src="//evil.example/pixel.gif" alt="x" />'),
			'',
		);
	});

	it('removes protocol-relative URLs written with backslashes or whitespace', () => {
		const out = clean(
			'<a href="\\\\evil.example">a</a><a href="/\\evil.example">b</a>' +
				'<a href=" //evil.example">c</a><a href="/&#9;/evil.example">d</a>' +
				'<img src="\\/\\/evil.example/p.gif">',
		);
		assert.doesNotMatch(out, /evil\.example|href=|src=/);
	});

	it('still keeps absolute https links and images', () => {
		const html =
			'<a href="https://example.org//double" target="_blank" rel="noopener noreferrer nofollow">x</a>' +
			'<img src="https://example.org/a.png" />';
		assert.equal(clean(html), html);
	});
});

describe('sanitizeDescriptionHtml: relative URLs', () => {
	const LINK = ' target="_blank" rel="noopener noreferrer nofollow"';

	it('removes a relative link target but keeps the link text', () => {
		for (const href of [
			'/MastrXYZ/status/2063663546508919079',
			'www.patreon.com/bibleblack',
			'argotorg/solidity#16124',
			'../admin',
			'?tab=donations',
			'#',
			'#top',
			'',
		]) {
			assert.equal(clean(`<a href="${href}">text</a>`), '<a>text</a>');
		}
	});

	it('removes a relative image source', () => {
		for (const src of ['/images/a.png', 'a.png', '../a.png', '//:0']) {
			assert.equal(clean(`<img src="${src}" alt="x" />`), '');
		}
	});

	it('removes a scheme that is not followed by a host', () => {
		const out = clean(
			'<a href="https:evil.example">a</a><a href="http:/evil.example">b</a>' +
				'<img src="https:evil.example/p.gif">',
		);
		assert.doesNotMatch(out, /evil\.example|href=|src=/);
	});

	it('keeps absolute links, mail links and images', () => {
		const html =
			`<a href="https://giveth.io/project/x?tab=donations#top"${LINK}>a</a>` +
			`<a href="HTTP://example.org"${LINK}>b</a>` +
			`<a href="mailto:team@example.org"${LINK}>c</a>` +
			'<img src="https://example.org/a.png" alt="x" />';
		assert.equal(clean(html), html);
	});

	it('does not accept a mail link as an image source', () => {
		assert.equal(clean('<img src="mailto:team@example.org" />'), '');
	});
});

describe('sanitizeDescriptionHtml: links and images left without a URL', () => {
	it('removes an image that has no usable source', () => {
		// The shapes found in imported Giveth descriptions.
		for (const img of [
			'<img>',
			'<img src>',
			'<img src="">',
			'<img src="//:0">',
			'<img src="/uploads/logo.png" alt="Our logo" width="600" height="400">',
			'<img src="data:image/png;base64,iVBORw0KGgo=" alt="x">',
			'<img src="javascript:alert(1)" alt="x">',
			'<img alt="x" title="y" onerror="alert(1)">',
		]) {
			assert.equal(clean(`<p>a${img}b</p>`), '<p>ab</p>');
		}
	});

	it('keeps an image with an absolute source next to a removed one', () => {
		assert.equal(
			clean(
				'<img src="//:0"><img src="https://example.org/a.png" alt="x"><img src>',
			),
			'<img src="https://example.org/a.png" alt="x" />',
		);
	});

	it('adds target and rel only to a link that keeps its href', () => {
		assert.equal(
			clean(
				'<a>plain</a><a href="#team" title="Team">anchor</a>' +
					'<a href="https://example.org" title="Site">link</a>',
			),
			'<a>plain</a><a title="Team">anchor</a>' +
				'<a title="Site" href="https://example.org" target="_blank" rel="noopener noreferrer nofollow">link</a>',
		);
	});

	it('drops a source target and rel from a link whose href is removed', () => {
		for (const href of [
			'javascript:alert(1)',
			'/admin',
			'//evil.example',
		]) {
			assert.equal(
				clean(
					`<a href="${href}" target="_top" rel="opener" onclick="alert(1)">x</a>`,
				),
				'<a>x</a>',
			);
		}
	});
});

describe('sanitizeDescriptionHtml: non-breaking spaces', () => {
	it('replaces them in text, in every element', () => {
		assert.equal(
			clean(
				'<p>a&nbsp;b\u00a0c</p><code>d&nbsp;e</code><pre>f&nbsp;&nbsp;g</pre><li>h&#160;i</li>',
			),
			'<p>a b c</p><code>d e</code><pre>f  g</pre><li>h i</li>',
		);
	});

	it('leaves them in attribute values', () => {
		assert.equal(
			clean(
				'<a href="https://example.org/a\u00a0b" title="t&nbsp;u">x&nbsp;y</a>' +
					'<img src="https://example.org/i\u00a0j.png" alt="k&nbsp;l" />',
			),
			'<a title="t\u00a0u" href="https://example.org/a\u00a0b" target="_blank" rel="noopener noreferrer nofollow">x y</a>' +
				'<img src="https://example.org/i\u00a0j.png" alt="k\u00a0l" />',
		);
	});
});

describe('sanitizeDescriptionHtml: inline colours', () => {
	it('keeps hex, rgb, rgba and named colours for text and background', () => {
		const html =
			'<span style="color:#e60000">a</span>' +
			'<span style="color:rgba(0, 0, 0, 0.96)">b</span>' +
			'<span style="color:rgb(255, 255, 255);background-color:rgb(0, 0, 0)">c</span>' +
			'<span style="background-color:transparent">d</span>' +
			'<span style="color:orange;background-color:rgba(0, 0, 0, 0.03)">e</span>';
		assert.equal(clean(html), html);
	});

	it('removes colour values that are not a plain colour', () => {
		for (const value of [
			'url(https://evil.example/t.gif)',
			'expression(alert(1))',
			'var(--background)',
			'color-mix(in srgb, red, blue)',
			'rgb(0,0,0) url(https://evil.example/t.gif)',
			'red;position:fixed',
			'#12345',
		]) {
			const out = clean(
				`<span style="color:${value};background-color:${value}">x</span>`,
			);
			assert.doesNotMatch(out, /url|expression|var|mix|position|#12345/);
		}
	});

	it('keeps text alignment when the colour beside it is removed', () => {
		assert.equal(
			clean('<p style="color:var(--x);text-align:center">x</p>'),
			'<p style="text-align:center">x</p>',
		);
	});
});

describe('getDescriptionHtml', () => {
	const html = getDescriptionHtml;

	it('returns an empty string when there is no description', () => {
		assert.equal(html(undefined), '');
		assert.equal(html(null), '');
		assert.equal(html({}), '');
		assert.equal(html({ description: '', descriptionHtml: null }), '');
		assert.equal(html({ source: 'giveth', description: '' }), '');
	});

	it('prefers descriptionHtml over description', () => {
		assert.equal(
			html({
				source: 'gardens',
				description: '# Title',
				descriptionHtml: '<h1>Title</h1>',
			}),
			'<h1>Title</h1>',
		);
	});

	it('reads a Giveth description as HTML', () => {
		assert.equal(
			html({
				source: 'giveth',
				description: '<p>Hello <strong>world</strong></p>',
			}),
			'<p>Hello <strong>world</strong></p>',
		);
		assert.equal(
			html({ source: 'giveth', description: 'no markup at all' }),
			'no markup at all',
		);
	});

	it('reads a Giveth description as HTML whatever the case of the source', () => {
		for (const source of ['Giveth', 'GIVETH', ' giveth ']) {
			assert.equal(
				html({ source, description: '<p>Hello <em>world</em></p>' }),
				'<p>Hello <em>world</em></p>',
			);
			// Still sanitized.
			assert.equal(
				html({
					source,
					description:
						'<p onclick="alert(1)">Hi</p><script>alert(1)</script>',
				}),
				'<p>Hi</p>',
			);
		}
	});

	it('does not read a source that only resembles Giveth as HTML', () => {
		for (const source of [
			'giveth2',
			'not-giveth',
			'https://giveth.io/project/memory',
			'https://devouch.xyz/project/giveth/17695',
		]) {
			assert.equal(
				html({ source, description: '<b>x</b>' }),
				'&lt;b&gt;x&lt;/b&gt;',
			);
		}
	});

	it('reads the description of every other source as text, keeping angle brackets', () => {
		for (const source of [
			'rf',
			'gardens',
			'gitcoin',
			'unknown',
			undefined,
		]) {
			assert.equal(
				html({
					source,
					description:
						'Contact <team@example.org> or <https://example.org>.\n\nSaved >355k USD, a < b & c, is_issuer(address) -> bool',
				}),
				'Contact &lt;team@example.org&gt; or &lt;https://example.org&gt;.\n\nSaved &gt;355k USD, a &lt; b &amp; c, is_issuer(address) -&gt; bool',
			);
		}
	});

	it('never renders markup from a text description', () => {
		const out = html({
			source: 'rf',
			description:
				'<script>alert(1)</script><img src=x onerror=alert(1)><b>bold</b> &lt;i&gt;',
		});
		assert.equal(
			out,
			'&lt;script&gt;alert(1)&lt;/script&gt;&lt;img src=x onerror=alert(1)&gt;&lt;b&gt;bold&lt;/b&gt; &amp;lt;i&amp;gt;',
		);
	});

	it('sanitizes both fields', () => {
		const payload =
			'<p onclick="alert(1)">Hi</p><script>alert(1)</script><img src=x onerror=alert(1)>' +
			'<a href="javascript:alert(1)">x</a><iframe src="//evil.example"></iframe>';
		for (const out of [
			html({ source: 'giveth', description: payload }),
			html({ source: 'rf', descriptionHtml: payload }),
		]) {
			assert.doesNotMatch(
				out,
				/script|onerror|onclick|alert|iframe|evil/i,
			);
			assert.match(out, /<p>Hi<\/p>/);
		}
	});

	it('replaces non-breaking spaces so long lines can wrap', () => {
		assert.equal(
			html({ source: 'giveth', description: '<p>a&nbsp;b\u00a0c</p>' }),
			'<p>a b c</p>',
		);
		assert.equal(html({ descriptionHtml: 'a&nbsp;b\u00a0c' }), 'a b c');
		assert.equal(html({ source: 'rf', description: 'a\u00a0b' }), 'a b');
	});

	it('replaces every spelling of the non-breaking space entity', () => {
		assert.equal(
			html({
				descriptionHtml:
					'<p>a&#160;b&#xA0;c&#xa0;d&NonBreakingSpace;e&nbspf&#0160;g</p>',
			}),
			'<p>a b c d e f g</p>',
		);
	});

	it('leaves an escaped entity as the text it stands for', () => {
		assert.equal(
			html({ descriptionHtml: '<code>&amp;nbsp;</code>' }),
			'<code>&amp;nbsp;</code>',
		);
	});
});
