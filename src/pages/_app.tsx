import { type AppProps, type AppType } from "next/app";
import "../styles/globals.css";
import { PT_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { api } from "../utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import LoggedUserProvider from "../components/LoggedUserProvider";
import { Suspense } from "react";
import AppSkeleton from "../components/AppSkeleton";

const font = PT_Serif({
  weight: "400",
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps, router }: AppProps) => {
  return (
    <ClerkProvider>
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
