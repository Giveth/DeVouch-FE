// Loaded with `node --import` before the tests: installs ./ts-resolve-hooks.mjs.
import { register } from 'node:module';

register('./ts-resolve-hooks.mjs', import.meta.url);
