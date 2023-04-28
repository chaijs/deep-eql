import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';

const commonjs = fromRollup(rollupCommonjs);

export default {
  mimeTypes: {
    '**/*.cjs': '*.js',
  },
  nodeResolve: true,
  files: [ 'test/*.{js,mjs}' ],
  plugins: [
    commonjs({
      include: [ './index.js', './test/*.js', './node_modules/simple-assert/**/*', './node_modules/assertion-error/**/*', './node_modules/type-detect/**/*' ],
    }),
  ],
};
