const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const tailwindcsPlugin = require('eslint-plugin-tailwindcss');
module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  ...tailwindcsPlugin.configs['flat/recommended'],
  {
    ignores: ['dist/*', 'src/components/ui/*'],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    settings: {
      tailwindcss: {
        config: './tailwind.config.js',
      },
    },
    rules: {
      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: ['pt-safe', 'p-safe', 'elevation-sm', 'elevation-md', 'dark:elevation-md'],
        },
      ],
    },
  },
]);
