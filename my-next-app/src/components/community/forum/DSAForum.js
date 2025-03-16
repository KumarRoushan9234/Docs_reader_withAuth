import ChatBox from "./ChatBox";

const messages = [
  { user: "CoderX", text: "Best way to optimize Dijkstra’s algorithm?", time: "3 mins ago" },
  { user: "Dev101", text: "Any good DP practice platforms?", time: "8 mins ago" },
];

export default function DSAForum() {
  return <ChatBox forumName="DSA" messages={messages} />;
}
