import katex from "katex";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>WebTeX</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.css" integrity="sha384-knaESGLxlQRSHWSJ+ZbTX6/L1bJZWBsBYGb2O+g64XHFuO7CbIj9Pkf1aaVXzIZJ" crossOrigin="anonymous"></link>
      </Head>

      <main className={styles.main}>
        <span>Hi there</span>
        <span dangerouslySetInnerHTML={{ __html: katex.renderToString("x^{32}") }} />
      </main>
    </div>
  );
}
