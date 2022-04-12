import { useUser } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Layout } from "../components/layout";
import { getDatabase } from "../src/database";

export const getServerSideProps: GetServerSideProps = async () => {
  const mongodb = await getDatabase();

  const response = await mongodb.db().collection("users").find().toArray();
  const users = await JSON.parse(JSON.stringify(response));
  // console.log(users);

  return {
    props: {
      email: users[0].email,
    },
  };
};

const Form: React.FC<{ email: string }> = ({ email }) => {
  const { user } = useUser();
  return (
    <Layout>
      {user ? (
        <div className="container">
          Email: {email}
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Choisissez un pseudo :
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="pseudo"
            />
            <button>
              <Link href={""}></Link>
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );

  // if (user) {
  //   return <div className="container">test {email}</div>;
  // } else {
  //   return <div className="container">TEST 2</div>;
  // }
};

export default Form;
