const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:
    process.env.NODE_ENV === 'production'
      ? '/just-work-timer/' // Измените на имя вашего репозитория
      : '/',
});
