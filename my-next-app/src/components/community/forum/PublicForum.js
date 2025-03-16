import ChatBox from "./ChatBox";

const messages = [
  { user: "John", text: "Welcome to the Public Forum!", time: "2 mins ago" },
  { user: "Alice", text: "Anyone here learning React?", time: "5 mins ago" },
];

export default function PublicForum() {
  return <ChatBox forumName="Public" messages={messages} />;
}
