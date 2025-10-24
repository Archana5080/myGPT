import { useState, useContext } from "react";
import { MyContext } from "../MyContext.jsx";
import "./AuthModel.css"; // we'll create this file next

export default function AuthModal() {
  const { setUser } = useContext(MyContext);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup
  ? "https://mygpt-v0dp.onrender.com/auth/signup"
  : "https://mygpt-v0dp.onrender.com/auth/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user || { email }); // save user globally
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="authOverlay">
      <div className="authModal">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        <p>
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
