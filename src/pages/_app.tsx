import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { PT_Serif } from 'next/font/google';
const font = PT_Serif({
  weight: '400',
  subsets: ['latin'],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
      <main className={font.className}>
        <Component {...pageProps} />
      </main>
  )
};

export default api.withTRPC(MyApp);
