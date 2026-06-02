import React from "react";

function SignInForm() {
  const [state, setState] = React.useState({
    email: "",
    password: ""
  });

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();
    const { email, password } = state;

    // Check if email and password are not empty
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:1000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Failed to sign in');
      }

      // Assuming the server responds with a JSON object containing a token
      const authToken = response.headers.get("x-auth-token");
      console.log("authToken", authToken);
      if (authToken) {
        localStorage.setItem("authToken", authToken);
      }

      alert(`You are logged in with email: ${email}`);

      setState({
        email: "",
        password: ""
      });

      // Redirect to homepage
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1 style={{ marginBottom: "1rem" }}>Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        />
        <a href="#" style={{ marginBottom: "1rem" }}>
          Forgot your password?
        </a>
        <button style={{ padding: "0.5rem 1rem" }}>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
