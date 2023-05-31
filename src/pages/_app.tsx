import Head from 'next/head'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { wrapper } from 'store/store'

import theme from 'theme'
import Header from 'components/Header'
import Footer from 'components/Footer'

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props
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
      <Provider store={store}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Provider>
    </ChakraProvider>
  )
}

export default MyApp
