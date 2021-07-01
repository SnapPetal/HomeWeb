import Head from 'next/head'
import Link from "next/link"


const Pokemons = ({ data }) => {

  return (
    <section>
      <Head>
        <title>PokéServerless</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h2>Pokémons</h2>
      <ul style={{ listStyle: "none" }}>
        {data.results.map((pokemon, _index) => (
          <li key={pokemon.name} style={{ textTransform: "capitalize" }}>{_index + 1} <Link href={pokemon.name}><a style={{ fontWeight: "bold", fontFamily: '"Comic Sans MS", cursive, sans-serif', color: "tomato", textDecoration: "none" }}>{pokemon.name}</a></Link></li>
        ))}
      </ul>
      <h3>Total of {data.count} Pokémons...</h3>
    </section>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118')
  const data = await res.json()

  return {
    props: {
      data,
    }
  }
}

export default Pokemons
