import "normalize.css";
import "../styles/globals.css";
import { AppProps } from "next/app";
// NOTE: Do not move the styles dir to the src.
// They are used by the Netlify CMS preview feature.
import "../../public/styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100">
      <Component {...pageProps} />
    </div>
  );
}
