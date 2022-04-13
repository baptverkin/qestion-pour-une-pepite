import { getDatabase } from "../../src/database";

export default async function handler(
  req: { body: { email: any; pseudo: any } },
  res: { redirect: (arg0: string, arg1: number) => void }
) {
  const email = req.body.email;
  const pseudo = req.body.pseudo;
  const mongodb = await getDatabase();
  const isUser = await mongodb
    .db()
    .collection("users")
    .findOne({ email: email });
  if (isUser) {
    const user = await mongodb
      .db()
      .collection("users")
      .updateOne({ email: email }, { $set: { pseudo: pseudo } });
    console.log("l'user existe");
  } else {
    const user = await mongodb.db().collection("users").insertOne({
      pseudo: pseudo,
      victories: 0,
      playedGames: 0,
      email: email,
    });
    console.log("l'user n'existe pas");
  }
}
