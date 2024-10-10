import { useState, type FC } from 'react';
import Image from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, ButtonType } from '@/components/Button/Button';
import Modal, { IModal } from './Modal';

interface ShareModalProps extends IModal {
	shareLink: string;
}

export const ShareModal: FC<ShareModalProps> = ({ shareLink, ...props }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 4000);
	};

	// Social share messages
	const twitterShareMessage = `I just vouched for this project on DeVouch!                                Use @devouchxyz to vouch for projects that you believe are legitimate and build networks of trust. ${shareLink}`;
	const farcasterShareMessage = `I just vouched for this project on DeVouch! Use DeVouch by @giveth to vouch for projects that you believe are legitimate and build networks of trust. ${shareLink}`;
	const facebookAndLinkedInShareMessage = `I just vouched for this project on DeVouch! Use DeVouch by @giveth to vouch for projects that you believe are legitimate and build networks of trust.`;

	return (
		<Modal
			{...props}
			title='Share your Attestation'
			className='w-full md:w-[400px] p-6'
		>
			<div className='flex flex-col items-center gap-4'>
				<div className='text-sm text-center text-gray-500'>
					Share your attestation with your friends on Socials.
				</div>
				<div className='flex gap-6 justify-center my-2'>
					{/* Twitter */}
					<a
						href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterShareMessage)}`}
						target='_blank'
						rel='noopener noreferrer'
					>
						<Image
							src='/images/icons/twitter.svg'
							alt='Twitter'
							width={30}
							height={30}
						/>
					</a>
					{/* LinkedIn */}
					<a
						href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}&description=${encodeURIComponent(facebookAndLinkedInShareMessage)}`}
						target='_blank'
						rel='noopener noreferrer'
					>
						<Image
							src='/images/icons/linkedin.svg'
							alt='LinkedIn'
							width={30}
							height={30}
						/>
					</a>
					{/* Facebook */}
					<a
						href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&description=${encodeURIComponent(facebookAndLinkedInShareMessage)}&caption=DeVouch}`}
						target='_blank'
						rel='noopener noreferrer'
					>
						<Image
							src='/images/icons/facebook.svg'
							alt='Facebook'
							width={16}
							height={16}
						/>
					</a>
					{/* Farcaster */}
					<a
						href={`https://warpcast.com/~/compose?text=${encodeURIComponent(farcasterShareMessage)}`}
						target='_blank'
						rel='noopener noreferrer'
					>
						<Image
							src='/images/icons/farcaster.svg'
							alt='Farcaster'
							width={30}
							height={30}
						/>
					</a>
				</div>
				<div className='text-sm text-center text-gray-500'>
					Or copy the link
				</div>
				<div className='w-full relative'>
					<input
						type='text'
						value={shareLink}
						readOnly
						className='w-full border p-4 pr-20 rounded'
					/>
					<CopyToClipboard text={shareLink} onCopy={handleCopy}>
						<button className='absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-600'>
							{copied ? 'Copied!' : 'Copy'}
						</button>
					</CopyToClipboard>
				</div>
				<Button
					buttonType={ButtonType.BLUE}
					className='w-full mt-4'
					onClick={() => props.setShowModal(false)}
				>
					Close Modal
				</Button>
			</div>
		</Modal>
	);
};
