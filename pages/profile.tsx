import { GetServerSideProps } from "next";
import Link from "next/link";
import { Card, Nav, Button } from "react-bootstrap";
import { Layout } from "../components/layout"
import { getDatabase } from "../src/database";
import styles from "../styles/Home.module.css";
import jwt_decode from "jwt-decode";
import { useUser } from "@auth0/nextjs-auth0";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.appSession;
  console.log("test accesstoken", accessTokken);

  // const parseAccessToken = JSON.parse(accessTokken)
  const decoded: any = jwt_decode(accessTokken);
  console.log("decoded:", decoded)
    const mongodb = await getDatabase();
    const userInfo = await mongodb
      .db()
      .collection("users")
      .findOne({ email: decoded.email })
      .then((result) => result);

  const users = await JSON.parse(JSON.stringify(userInfo));
  console.log("test users", users);

  return {
    props: {
      users: users,
    },
  };
};


const Profile: React.FC = () => {
  return(
    <>
    <Layout>
      <h2>Bonjour Yohan</h2>
      <ul>
        <h4>13 parties</h4>
        <h4>6 victoires</h4>
        <h4>Classement général : 3e</h4>
      </ul><br></br>

    <h3 className={styles.title}>Choisis ton mode de jeu</h3><br></br>

    <Card className="cardProfile">
  <Card.Header>
    <Nav variant="tabs" defaultActiveKey="#first">
      <Nav.Item>
        <Nav.Link href="#first">Général</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#link">Règles</Nav.Link>
      </Nav.Item>

    </Nav>
  </Card.Header>
  <Card.Body>
    <Card.Title>Jeu complet</Card.Title>
    <Card.Text>
      Défis tes amis ou l&apos;IA dans une partie en 3 manches et devient le champion <br></br>
      9 points gagnants &rarr; 4 à la suite &rarr; Face à face
    </Card.Text>
    <Link href="#" passHref={true}>
    <Button variant="primary">Commencez à jouer &rarr;</Button>
    </Link>
  </Card.Body>
</Card><br></br>

<h3 className={styles.title}>Entrainement</h3><br></br>

<div className="column" >
<div className="row" style={{textAlign : "center", marginLeft: "100px", marginRight: "100px"}} >
<Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="/images/neuf-points-gagnants.jpeg" />
  <Card.Body>
    <Card.Title>9 Points gagnants</Card.Title>
    <Card.Text>
      Rapidité ! Les 3 premiers joueurs à obtenir 9 points se qualifient
    </Card.Text>
    <Link href="#" passHref={true}>
    <Button variant="primary">Commencez à jouer &rarr;</Button>
    </Link>
  </Card.Body>
</Card>

<Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="/images/quatreàlasuite.jpg" />
  <Card.Body>
    <Card.Title>4 à la suite </Card.Title>
    <Card.Text>
      Celui qui répond aux plus de questions successivement se qualifie
    </Card.Text>
    <Link href="#" passHref={true}>
    <Button variant="primary">Commencez à jouer &rarr;</Button>
    </Link>
  </Card.Body>
</Card>

<Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="/images/faceàface.jpg" />
  <Card.Body>
    <Card.Title>Face à face</Card.Title>
    <Card.Text>
      Le premier à 12 points remporte la partie
    </Card.Text>
    <Link href="#" passHref={true}>
    <Button variant="primary">Commencez à jouer &rarr;</Button>
    </Link>
  </Card.Body>
</Card>
</div>
</div>

    </Layout>
    </>
  )
}

export default Profile
