import Head from 'next/head'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import theme from 'theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Head>
        <title>Compute Hub</title>
        <link rel="shortcut icon" href="/img/computer_hub_icon.png" />
        <link rel="apple-touch-icon" href="/img/computer_hub_icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="description"
          content="Compute Hub - Volunteer Computing Central"
        />
      </Head>

      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
