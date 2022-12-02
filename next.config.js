/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

}

module.exports = nextConfig;


module.exports = {
  reactStrictMode: true,
  i18n: {

    locales: ['en', 'ku'],

    defaultLocale: 'en',

  },
  images: {

    // domains: ['84.46.255.116'],
    domains: ['localhost'],

  },

}

