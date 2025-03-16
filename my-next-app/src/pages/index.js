import TalkPage from "./talk";

function Home() {
  return <TalkPage />;
}

Home.auth = true; // ✅ Requires authentication

export default Home;
