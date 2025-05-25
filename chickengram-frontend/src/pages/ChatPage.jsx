import { useEffect, useState } from "react";
import "./ChatPage.css";

export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setContacts);
  }, [token]);

  useEffect(() => {
    if (!selectedContact) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/messages/${selectedContact.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMessages);
  }, [selectedContact, token]);

  function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    fetch(`${process.env.REACT_APP_API_URL}/api/messages`, {
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
    <div className="chat-container">
      {/* Contact List */}
      <div className="contact-list">
        <h3>Contacts</h3>
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-item ${selectedContact?.id === contact.id ? "selected" : ""}`}
            onClick={() => setSelectedContact(contact)}
          >
            {contact.username}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        {selectedContact ? (
          <>
            <h3>Chat with {selectedContact.username}</h3>
            <div className="chat-messages">
              {messages.map((msg, i) => {
                const isMe = msg.sender_id === "me";
                return (
                  <div key={i} className={`chat-message ${isMe ? "me" : "them"}`}>
                    <div className="bubble">{msg.content}</div>
                  </div>
                );
              })}
            </div>

            <form className="message-form" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
