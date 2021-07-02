import Head from 'next/head'
import Link from "next/link"

const BibleVerse = ({ data }) => {
  return (
    <section>
      <Head>
        <title>Thon Becker</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <body>
        <h2>Verse of the Day</h2>
        <p>{data.results}</p>
      </body>
    </section>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://www.ourmanna.com/verses/api/get?format=json&order=random');
  const data = await res.json()

  return {
    props: {
      data,
    }
  }
}

export default BibleVerse
