import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { wrapper } from 'store/store'
import Script from 'next/script'

import Footer from 'components/Footer'
import Header from 'components/Header'
import theme from 'theme'
import { Router } from 'next/router'
import { useEffect } from 'react'
import nProgress from 'nprogress'

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props

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
      <Script
        src="/static/simplewebsocket.min.js"
        strategy="beforeInteractive"
      />
      <Script src="/static/volunteer.js" strategy="beforeInteractive" />
      <Script src="/static/config.js" strategy="beforeInteractive" />
      <Script src="/static/connect.js" strategy="beforeInteractive" />
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
      <Provider store={store}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Provider>
    </ChakraProvider>
  )
}

export default MyApp
