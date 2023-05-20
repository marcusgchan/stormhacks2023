import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider, createTheme } from '@nextui-org/react';


import { api } from "~/utils/api";

import "~/styles/globals.css";

const theme = createTheme({
  type: "dark",
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
  <NextUIProvider theme={theme}>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </NextUIProvider>
  );
};

export default api.withTRPC(MyApp);
