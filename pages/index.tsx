import type { GetServerSideProps } from "next";
import Link from "next/link";
import { Layout } from "../components/layout";
import styles from "../styles/Home.module.css";
import { getDatabase } from "../src/database";
import { getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";

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
<Image src={"/images/logo_qpup_transparent.png"} alt= "logo" width="600px" height="350px" ></Image>
          </h3>
          <p >
            {userDB ? `Joueur actuellement connecté : ${userDB.pseudo}` : ""}
          </p>
          <br />
          <br />
          {session === null ? (
            <Link href="/api/auth/login" passHref>
              <button type="button" className="btn btn-warning" style={{ color: "white", fontSize:20}}>
                Commencer une partie &rarr;
              </button>
            </Link>
          ) : userDB === null || userDB === undefined ? (
            <Link href="/form" passHref>
              <button type="button" className="btn btn-warning" style={{ color: "white", fontSize:20}}>
                Commencer une partie &rarr;
              </button>
            </Link>
          ) : (
            <Link href="/profile" passHref>
              <button type="button" className="btn btn-warning" style={{ color: "white", fontSize:20}}>
                Commencer une partie &rarr;
              </button>
            </Link>
          )}

          <br />
          <br />

        </main>
      </div>
    </Layout>
  );
};

export default Home;
