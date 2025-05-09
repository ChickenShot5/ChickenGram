import AuthForm from "../components/AuthForm";

export default function Register() {
  async function handleRegister(credentials) {
    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registration successful! Please login.");
    } else {
      alert(data.error || "Something went wrong.");
    }
  }

  return <AuthForm onSubmit={handleRegister} buttonText="Register" />;
}
