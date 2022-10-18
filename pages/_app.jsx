import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import '@styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as ga from '@/lib/ga'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <>
      <Head>
          <title>Embed DeSo Posts On Your Website - With DeSo</title>
      </Head>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}

export default MyApp
