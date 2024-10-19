import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import jest from 'eslint-plugin-jest'

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals['shared-node-browser'] } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  jest.configs['flat/recommended'],
]
