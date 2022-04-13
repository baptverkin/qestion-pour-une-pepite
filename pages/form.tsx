import { useUser } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import router from "next/router";
import React from "react";
import { Layout } from "../components/layout";
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

  const users = await JSON.parse(JSON.stringify(response));

  return {
    props: {
      email: email,
    },
  };
};

const Form: React.FC<{ email: string }> = ({ email }) => {
  const { user } = useUser();
  const [input, setInput] = React.useState();
  const handleChange = (e: { preventDefault: () => void; target: any }) => {
    e.preventDefault();
    const target = e.target;
    setInput(target.value);
  };
  const handleSubmit = (e: { preventDefault: () => void; target: any }) => {
    e.preventDefault();
    const temp = {
      pseudo: input,
      email: email,
    };
    fetch("/api/update_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(temp),
    }).then(() => router.push("/profile"));
  };
  return (
    <Layout>
      {user ? (
        <div className="container">
          <form>
            Email: {email}
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Choisissez un pseudo :
              </label>
              <input type="text" placeholder="pseudo" onChange={handleChange} />
              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default Form;
