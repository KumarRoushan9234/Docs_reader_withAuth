import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Signup() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      router.push("/login");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input type="text" placeholder="Name" onChange={(e) => setUser({ ...user, name: e.target.value })} />
      <input type="email" placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setUser({ ...user, password: e.target.value })} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}
