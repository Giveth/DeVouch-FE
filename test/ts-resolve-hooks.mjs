// Lets `node --test` load the app's TypeScript sources directly. Node strips
// the types itself; this hook only fills in the `.ts` extension that
// extensionless relative imports (the form Next's bundler resolution uses)
// leave out.
export async function resolve(specifier, context, nextResolve) {
	try {
		return await nextResolve(specifier, context);
	} catch (error) {
		if (specifier.startsWith('.') && !/\.[cm]?[jt]sx?$/.test(specifier)) {
			return nextResolve(`${specifier}.ts`, context);
		}
		throw error;
	}
}
