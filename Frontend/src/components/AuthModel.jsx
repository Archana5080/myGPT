import { useState, useContext } from "react";
import { MyContext } from "../MyContext.jsx";
import "./AuthModel.css";

export default function AuthModal() {
  const { setUser } = useContext(MyContext);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        // Save user globally
        setUser(data.user || { email });
        setEmail("");
        setPassword("");
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
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
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p>
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
