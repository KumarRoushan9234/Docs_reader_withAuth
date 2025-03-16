import ChatBox from "./ChatBox";

const messages = [
  { user: "Admin", text: "Welcome to the Official Community!", time: "10 mins ago" },
  { user: "User123", text: "Any upcoming events?", time: "15 mins ago" },
];

export default function OfficialForum() {
  return <ChatBox forumName="Official" messages={messages} />;
}
