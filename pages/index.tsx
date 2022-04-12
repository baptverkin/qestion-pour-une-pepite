import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Layout } from "../components/layout";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <h3 className={styles.title}>
            Bienvenue sur la plateforme officielle de <br></br>Question pour une
            Pépite
          </h3>
          <br></br>
          <br></br>
          <Link href="/profile" passHref>
            <button type="button" className="btn btn-primary">
              Commencer une partie &rarr;
            </button>
          </Link>
          <br></br>
          <br></br>

          <div className={styles.grid}>
            <a className={styles.card}>
              <h2>9 points gagnants</h2>
              <p>Le dernier à 9 points perd la manche</p>
            </a>

            <a className={styles.card}>
              <h2>4 à la suite</h2>
              <p>Répondez correctement à 4 question successives </p>
            </a>

            <a className={styles.card}>
              <h2>Face à Face</h2>
              <p>
                Duel au sommet entre les finalistes, le premier à 12 points
                gagne la partie
              </p>
            </a>

            <a href="/regles" className={styles.card}>
              <h2>Règles &rarr;</h2>
              <p>Faire un point sur les règles du jeu</p>
            </a>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Home;
