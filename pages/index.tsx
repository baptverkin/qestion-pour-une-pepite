import { useUser } from "@auth0/nextjs-auth0";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { Layout } from "../components/layout";
import styles from "../styles/Home.module.css";
import { getDatabase } from "../src/database";
import { getSession } from "@auth0/nextjs-auth0";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);
  const email = session?.user.email;

  const mongodb = await getDatabase();
  const response = await mongodb
    .db()
    .collection("users")
    .findOne({ email: email });
  const userDB = JSON.parse(JSON.stringify(response));

  return {
    props: {
      userDB: userDB,
      session: JSON.parse(JSON.stringify(session)),
    },
  };
};

const Home: React.FC<{ userDB: any; session: any }> = ({ userDB, session }) => {
  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <h3 className={styles.title}>
            Bienvenue sur la plateforme officielle de <br />
            Question pour une Pépite
          </h3>
          <p>
            {userDB ? `Joueur actuellement connecté : ${userDB.pseudo}` : ""}
          </p>
          <br />
          <br />
          {session === null ? (
            <Link href="/api/auth/login" passHref>
              <button type="button" className="btn btn-primary">
                Commencer une partie &rarr;
              </button>
            </Link>
          ) : userDB === null || userDB === undefined ? (
            <Link href="/form" passHref>
              <button type="button" className="btn btn-primary">
                Commencer une partie &rarr;
              </button>
            </Link>
          ) : (
            <Link href="/profile" passHref>
              <button type="button" className="btn btn-primary">
                Commencer une partie &rarr;
              </button>
            </Link>
          )}

          <br />
          <br />

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
