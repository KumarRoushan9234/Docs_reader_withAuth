import ChatBox from "./ChatBox";

const messages = [
  { user: "TechGeek", text: "Best OS for penetration testing?", time: "12 mins ago" },
  { user: "LinuxFan", text: "Which Linux distro is best for beginners?", time: "25 mins ago" },
];

export default function OSForum() {
  return <ChatBox forumName="OS" messages={messages} />;
}
