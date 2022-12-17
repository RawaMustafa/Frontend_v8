/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: false,
  skipWaiting: false
})

module.exports = withPWA()


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


  // pwa: {
  //   dest: 'public',
  //   disable: process.env.NODE_ENV === 'development',
  //   register: true,
  //   skipWaiting: true,
  // }


}

