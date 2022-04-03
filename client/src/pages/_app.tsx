import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { AppProps } from "next/app";
import { getCookie, setCookies } from "cookies-next";
import Head from "next/head";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ApolloProvider } from "@apollo/client";

// Layout
import AppLayout from "../components/layouts/AppLayout";

// Override theme
import theme from "../theme";

// Apollo client
import { client } from "../graphql/client";
import { AppContextProvider } from "../context/AppContext";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookies("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>Lil Reddit </title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <AppContextProvider>
        <ApolloProvider client={client}>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              theme={{ ...theme, colorScheme }}
              withGlobalStyles
              withNormalizeCSS
            >
              <NotificationsProvider>
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              </NotificationsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </ApolloProvider>
      </AppContextProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
