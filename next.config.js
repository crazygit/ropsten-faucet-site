const { withSentryConfig } = require("@sentry/nextjs")

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    infuraProjectSecret: process.env.INFURA_PROJECT_SECRET,
    contractOwnerPrivateKey: process.env.CONTRACT_OWNER_PRIVATE_KEY,
    withdrawETHAmountEveryTime:
      process.env.WITHDRAW_ETH_AMOUNT_EVERY_TIME || "0.1",
    hcaptchaSecretKey: process.env.HCAPTCHA_SECRET_KEY,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    infuraProjectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    contactAddress: process.env.NEXT_PUBLIC_CONTACT_ADDRESS,
    hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY
  }
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
