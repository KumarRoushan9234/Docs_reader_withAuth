import ChatBox from "./ChatBox";

const messages = [
  { user: "Alice", text: "Best resources for Computer Networks?", time: "10 mins ago" },
  { user: "Bob", text: "How do you debug network issues?", time: "20 mins ago" },
];

export default function CNForum() {
  return <ChatBox forumName="CN" messages={messages} />;
}
