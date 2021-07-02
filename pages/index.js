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
        <p>{data.verse.details.text}</p>
        <p>{data.verse.details.reference} {data.verse.details.version}</p>
      </body>
    </section>
  )
}

export async function getServerSideProps() {
  const res = await fetch('https://www.ourmanna.com/verses/api/get?format=json&order=random');
  const data = await res.json()

  return {
    props: {
      data,
    }
  }
}

export default BibleVerse
