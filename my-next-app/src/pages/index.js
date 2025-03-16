import Lexi from "./lexi/lexi";

function Home() {
  return <Lexi />;
}

Home.auth = true; // ✅ Requires authentication

export default Home;
