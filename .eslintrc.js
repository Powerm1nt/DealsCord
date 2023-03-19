module.exports = {
   env: {
      commonjs: true,
      browser: true,
      es2021: false
   },
   extends: [
      'standard'
   ],
   parserOptions: {
      ecmaFeatures: {
         jsx: true
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
   },
   rules: {
      camelcase: 'off',
      'no-unused-vars': 'off'
   }
}
