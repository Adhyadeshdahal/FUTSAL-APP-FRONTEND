import React, { useState } from "react";

function SignUpForm({ setIsLoggedIn }) {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null
  });

  const handleChange = (evt) => {
    const { name, value, files } = evt.target;

    setState({
      ...state,
      [name]: name === 'avatar' ? files[0] : value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { name, email, password, avatar } = state;

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('avatar', avatar);

      const response = await fetch("http://127.0.0.1:1000/api/register", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }
      
      const authToken = response.headers.get("x-auth-token");
      console.log("authToken", authToken);
      if (authToken) {
        localStorage.setItem("authToken", authToken);
      }

      alert("Registration successful");
      
      // Clear the form fields
      setState({
        name: "",
        email: "",
        password: "",
        avatar: null
      });
      
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="file"
          name="avatar"
          onChange={handleChange}
          accept="image/*"
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
