import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddContact() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleAddContact(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_URL}/api/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          alert("Contact added!");
          navigate("/contacts");
        }
      })
      .catch((err) => {
        setError("Something went wrong.");
        console.error("Error:", err);
      });
  }

  return (
    <div>
      <h2>Add Contact</h2>
      <form onSubmit={handleAddContact}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
}
