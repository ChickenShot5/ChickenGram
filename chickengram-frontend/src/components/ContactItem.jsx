export default function ContactItem({ contact }) {
    return (
      <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
        <p>{contact.username}</p>
      </div>
    );
  }
  