import AuthForm from "../components/AuthForm";

export default function Login() {
  async function handleLogin(credentials) {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
    } else {
      alert(data.error || "Login failed.");
    }
  }

  return <AuthForm onSubmit={handleLogin} buttonText="Login" />;
}
