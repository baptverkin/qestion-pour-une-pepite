import { getDatabase } from "../../src/database";

export default async function handler(
  req: { body: { email: any; pseudo: any } },
  res: { redirect: (arg0: string, arg1: number) => void }
) {
  const email = req.body.email;
  const pseudo = req.body.pseudo;
  const mongodb = await getDatabase();
  const user = await mongodb
    .db()
    .collection("users")
    .updateOne({ email: email }, { $set: { pseudo: pseudo } });
  if (user.acknowledged) {
    console.log("=========================  OK");
  }
  res.redirect("/", 302);
}
