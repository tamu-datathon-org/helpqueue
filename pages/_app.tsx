import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider session={pageProps.session} basePath='https://tamudatathon.com/help/api/auth'>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
}
