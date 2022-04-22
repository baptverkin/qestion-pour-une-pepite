import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, Nav, Button } from "react-bootstrap";
import { Layout } from "../components/layout";
import { getDatabase } from "../src/database";
import styles from "../styles/Home.module.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { v4 as uuidv4 } from "uuid";
import router from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);
  const email = session?.user.email;
  const mongodb = await getDatabase();

  const response = await mongodb
    .db()
    .collection("users")
    .findOne({ email: email });
  const userDb = JSON.parse(JSON.stringify(response));

  const responses = await mongodb.db().collection("users").find().toArray();
  const usersSorted = responses.sort(
    (a: any, b: any) => b.victories - a.victories
  );
  const usersDb = JSON.parse(JSON.stringify(usersSorted));
  console.log(responses.indexOf(userDb))
  return {
    props: {
      _id: userDb._id,
      pseudo: userDb.pseudo,
      victories: userDb.victories,
      playedGames: userDb.playedGames,
      email: userDb.email,
      leaderBoard: usersDb,
    },
  };
};

const Profile: React.FC<{
  _id: ObjectId;
  pseudo: string;
  victories: number;
  playedGames: number;
  email: string;
  leaderBoard: any;
}> = ({ _id, pseudo, victories, playedGames, email, leaderBoard }) => {
  const handleSubmit = async (e: {
    preventDefault: () => void;
    target: any;
  }) => {
    e.preventDefault();
    const temp = {
      _id: _id,
      pseudo: pseudo,
      email: email,
    };

    await fetch("/api/games/generateGameMulti", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(temp),
    }).then((result) => router.push(result.url));
  };
  const index = leaderBoard.map((element: any) => element._id).indexOf(_id);
  return (
    <>
      <Layout>
        <div className="container" style={{marginTop:"2em"}}>
          <h2 >
            Bonjour {pseudo}&nbsp;&nbsp;&nbsp;
            <Link href="/form" passHref>
              <Image
                className="edit-pseudo"
                src="/images/pencil-icon.png"
                alt="changer pseudo"
                width="20"
                height="20"
              />
            </Link>
          </h2>
          <ul>
            <h4>{playedGames} parties</h4>
            <h4>{victories} victoires</h4>
            <h4>Classement général : {index + 1} </h4>
          </ul>
        </div>
        <br />

        <h3 className={styles.title}>Choisis ton mode de jeu</h3>
        <br></br>
        <br></br>
        <br></br>
        <Card
          className="cardProfile"
          style={{
            // textAlign: "center",
            marginLeft: "100px",
            marginRight: "100px",
            backgroundColor: "brown"
          }}
        >
          <Tabs defaultActiveKey="first">
            <Tab eventKey="first" title="Multi-joueur" className="container">
              <p style={{ marginBottom: "1em", marginTop: "1em" }}>
                <strong>Multi-joueur : </strong>
                Défie tes amis dans une partie multijoueur et devient le
                champion du 9 points gagnants
              </p>
            </Tab>
            <Tab eventKey="second" title="Entrainement" className="container">
              <p style={{ marginBottom: "1em", marginTop: "1em" }}>
                <strong>Entrainement : </strong>
                Défie des IAs et devient le champion du 9 points gagnants
              </p>
            </Tab>
            <Tab eventKey="third" title="Règles" className="container" >
              <p style={{ marginBottom: "1em", marginTop: "1em" }}>
                <strong>Règles du jeu : </strong>
                Quatre candidats sont en lice et doivent répondre à des
                questions de culture générale. Le gagnant est le premier
                candidat qui arrive à 9 points
              </p>
            </Tab>
          </Tabs>
          <Link href="/games/config" passHref={true}>
            <Button
            variant = "warning"
              style={{
                textAlign: "center",
                marginLeft: "40%",
                marginRight: "40%",
                marginBottom: "1em",
                color:"white"
              }}
            >
              Jouer contre des IA &rarr;
            </Button>
          </Link>
            <Button
              onClick={handleSubmit}
              variant = "warning"
              style={{
                textAlign: "center",
                marginLeft: "40%",
                marginRight: "40%",
                marginBottom: "1em",
                color:"white"
              }}
            >
              Jouer en multijoueur &rarr;
            </Button>
        </Card>
        <br></br>
        <br></br>
        <br></br>
        <br></br>



        <div>
          <table className="table" style={{color:"white"}}>
            <thead>
              <tr>
                <th scope="col" style={{fontSize:"25px"}}>#</th>
                <th scope="col" style={{fontSize:"25px"}}>Pseudo</th>
                <th scope="col" style={{fontSize:"25px"}}>Parties jouées</th>
                <th scope="col" style={{fontSize:"25px"}}>Victoires</th>
              </tr>
            </thead>
            <tbody>
            <tr key={uuidv4()}>
                    <th scope="row">#1</th>
                    <td>{leaderBoard[0].pseudo}</td>
                    <td>{leaderBoard[0].playedGames}</td>
                    <td>{leaderBoard[0].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#2</th>
                    <td>{leaderBoard[1].pseudo}</td>
                    <td>{leaderBoard[1].playedGames}</td>
                    <td>{leaderBoard[1].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#3</th>
                    <td>{leaderBoard[2].pseudo}</td>
                    <td>{leaderBoard[2].playedGames}</td>
                    <td>{leaderBoard[2].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#4</th>
                    <td>{leaderBoard[3].pseudo}</td>
                    <td>{leaderBoard[3].playedGames}</td>
                    <td>{leaderBoard[3].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#5</th>
                    <td>{leaderBoard[4].pseudo}</td>
                    <td>{leaderBoard[4].playedGames}</td>
                    <td>{leaderBoard[4].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#6</th>
                    <td>{leaderBoard[5].pseudo}</td>
                    <td>{leaderBoard[5].playedGames}</td>
                    <td>{leaderBoard[5].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#7</th>
                    <td>{leaderBoard[6].pseudo}</td>
                    <td>{leaderBoard[6].playedGames}</td>
                    <td>{leaderBoard[6].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#8</th>
                    <td>{leaderBoard[7].pseudo}</td>
                    <td>{leaderBoard[7].playedGames}</td>
                    <td>{leaderBoard[7].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#9</th>
                    <td>{leaderBoard[8].pseudo}</td>
                    <td>{leaderBoard[8].playedGames}</td>
                    <td>{leaderBoard[8].victories}</td>
                  </tr>
                  <tr key={uuidv4()}>
                    <th scope="row">#10</th>
                    <td>{leaderBoard[9].pseudo}</td>
                    <td>{leaderBoard[9].playedGames}</td>
                    <td>{leaderBoard[9].victories}</td>
                  </tr>

            </tbody>
          </table>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
