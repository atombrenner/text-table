import pluginJs from '@eslint/js'
import jest from 'eslint-plugin-jest'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals['shared-node-browser'] } },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  jest.configs['flat/recommended'],
]
