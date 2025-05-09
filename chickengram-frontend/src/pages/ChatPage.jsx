import { useEffect, useState } from "react";

export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:3001/api/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setContacts);
  }, [token]);

  useEffect(() => {
    if (!selectedContact) return;
    fetch(`http://localhost:3001/api/messages/${selectedContact.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMessages);
  }, [selectedContact, token]);

  function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    fetch("http://localhost:3001/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipientId: selectedContact.id,
        content: newMessage,
      }),
    }).then(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender_id: "me",
          recipient_id: selectedContact.id,
          content: newMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    });
  }

  return (
    <div className="chat-container" style={{ display: "flex", height: "90vh" }}>
      {/* Contact List */}
      <div
        className="contact-list"
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h3>Contacts</h3>
        {contacts.map((contact) => (
          <div
            className="chat-window"
            key={contact.id}
            style={{
              cursor: "pointer",
              padding: "5px",
              backgroundColor:
                selectedContact?.id === contact.id ? "#eee" : "transparent",
            }}
            onClick={() => setSelectedContact(contact)}
          >
            {contact.username}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window"
        style={{
          flex: 1,
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedContact ? (
          <>
            <h3>Chat with {selectedContact.username}</h3>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "10px",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: msg.sender_id === "me" ? "right" : "left",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      backgroundColor: msg.sender_id === "me" ? "#cef" : "#eee",
                      borderRadius: "10px",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={sendMessage}
              style={{ marginTop: "10px", display: "flex" }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1 }}
                placeholder="Type a message"
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <p>Select a contact to start chatting</p>
        )}
      </div>
    </div>
  );
}
