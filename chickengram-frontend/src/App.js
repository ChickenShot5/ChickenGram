import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ContactList from "./pages/ContactList";
import AddContact from "./pages/AddContact";
import ChatPage from "./pages/ChatPage";
import "./styles.css";

function App() {
  return (
    <Router>
      <header>
        <h1>🐔 ChickenGram</h1>
        <nav>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/chat">Chat</Link>
        </nav>
      </header>
  
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contacts" element={<ContactList />} />
          <Route path="/add-contact" element={<AddContact />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>
    </Router>
  );
  
}

export default App;
