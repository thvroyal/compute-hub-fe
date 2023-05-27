import Head from 'next/head'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import theme from 'theme'
import Header from 'components/Header'
import Footer from 'components/Footer'

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
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  )
}

export default MyApp
