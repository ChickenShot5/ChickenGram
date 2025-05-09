import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch contacts on page load
  useEffect(() => {
    if (!token) {
      alert("You must be logged in");
      navigate("/login");
    } else {
      fetch("http://localhost:3001/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setContacts)
        .catch((err) => console.error("Failed to fetch contacts", err));
    }
  }, [navigate, token]);

  // Delete a contact by ID
  const deleteContact = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete contact");
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  return (
    <div>
      <h2>Contact List</h2>
      {contacts.length === 0 ? (
        <p>No contacts found. Add some!</p>
      ) : (
        contacts.map((contact) => (
          <div key={contact.id} style={{ marginBottom: "10px" }}>
            <span>{contact.username}</span>
            <button
              onClick={() => deleteContact(contact.id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
      <button onClick={() => navigate("/add-contact")}>Add Contact</button>
    </div>
  );
}
