import { useState } from "react";

export default function AuthForm({ onSubmit, buttonText }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ username, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 300, margin: "20px auto" }}
    >
      <h2>{buttonText}</h2>
      <div>
        <label>Username:</label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">{buttonText}</button>
    </form>
  );
}
