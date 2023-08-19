import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { getSeoDetails } from "@/utils/getSEO";
import { DefaultSeo } from "next-seo";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function App({ Component, pageProps }) {
  return (
    <Layout {...pageProps}>
      <DefaultSeo {...getSeoDetails()} />
      <Component {...pageProps} />
    </Layout>
  );
}
