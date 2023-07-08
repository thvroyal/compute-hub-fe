import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'

import Footer from 'components/Footer'
import Header from 'components/Header'
import { Router } from 'next/router'
import nProgress from 'nprogress'
import { useEffect } from 'react'
import theme from 'theme'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      nProgress.start()
    })

    Router.events.on('routeChangeComplete', () => {
      nProgress.done()
    })

    Router.events.on('routeChangeError', () => {
      nProgress.done()
    })
  }, [])

  return (
    <ChakraProvider
      resetCSS
      theme={theme}
      toastOptions={{
        defaultOptions: {
          position: 'top',
          duration: 5000,
          isClosable: true
        }
      }}
    >
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
      <SessionProvider session={session}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
