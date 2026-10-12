import {defineConfig, includeIgnoreFile} from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  {
    files: [
      'bench/**/*.js',
      'test/**/*.js',
      './*.js'
    ],
    languageOptions: {
      globals: {
        ...globals['shared-node-browser'],
      }
    }
  },
	includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': ['error', {
        caughtErrorsIgnorePattern: '^_'
      }]
    }
  },
  {
    files: ['bench/**/*.js', 'test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  }
]);
