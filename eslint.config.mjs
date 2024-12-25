import pluginJs from '@eslint/js'
import jest from 'eslint-plugin-jest'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*ts'] },
  { ignores: ['**/*.{js,mjs}'] },
  {
    languageOptions: {
      globals: globals['shared-node-browser'],
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  pluginJs.configs.recommended,
  jest.configs['flat/recommended'],
  ...tseslint.configs.strictTypeChecked,
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
]
