import { useUser } from "@auth0/nextjs-auth0";
import { Layout } from "../../components/layout";

const Cart: React.FC = () => {
  const { user } = useUser();
  if (user) {
    return (
      <Layout>
        <div className="container">{user.name}</div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div className="container">TEST</div>
      </Layout>
    );
  }
};

export default Cart;
