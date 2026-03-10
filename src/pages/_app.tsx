import "normalize.css";
import { AppProps } from "next/app";

// Pages Router _app — only used for legacy /pages routes (API routes have no UI layer).
// All UI pages are now served by the App Router (src/app).
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
