import { type AppProps, type AppType } from "next/app";
import "../styles/globals.css";
import { PT_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { api } from "../utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import LoggedUserProvider from "../components/LoggedUserProvider";
import { Suspense } from "react";
import AppSkeleton from "../components/AppSkeleton";
import Head from "next/head";

const font = PT_Serif({
  weight: "400",
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps, router }: AppProps) => {
  return (
    <ClerkProvider>
      <Head>
        <title>TailoredCV</title>
        <meta
          name="description"
          content="The ultimate app designed to elevate your job application game. Empowers you to create personalized résumés and cover letters for each specific position you apply to."
        />
        <meta property="og:image" content="/tailoredBite.png" />
        <meta
          property="og:description"
          content="The ultimate app designed to elevate your job application game. Empowers you to create personalized résumés and cover letters for each specific position you apply to."
        />
        <meta property="og:title" content="TailoredCV" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <LoggedUserProvider>
        <Suspense fallback={<AppSkeleton />}>
          <main className={font.className}>
            <Component {...pageProps} />
            <Analytics />
          </main>
        </Suspense>
      </LoggedUserProvider>
    </ClerkProvider>
  );
};
export default api.withTRPC(MyApp);
