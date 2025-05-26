// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';


// Login component
const Login = () => {

const [form, setForm] = useState({ email: "", password: "" });

// useNavigate hook to programmatically navigate to different routes
const navigate = useNavigate();

// Destructure the login function from AuthContext
const { login } = useAuth();

// handleChange function to update form state when user types in the input fields
const handleChange = (e) => {
    const {name, value} = e.target;
    // spread the existing form state and update the specific field with the new value
    setForm({...form, [name]:value});
}

// handleSubmit function to handle form submission
const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the default form submission behavior
    try {
        // Making a POST request to the backend API with the form data for user login
        const res = await API.post("/auth/login", form);
        console.log("Login response:", res.data); // log the response data for debugging
        // on successful login, store the userData and token using the login function from AuthContext
        login(res.data.user, res.data.token);
        console.log("User logged in token:", res.data.token); // log the user data for debugging
        // navigate to the dashboard page after successful login
        navigate("/dashboard");
    } catch(error) {
        console.error("Login error:", error); // log any errors that occur during login
    }

}

// JSX for rendering the login form
return (
  // <section class="bg-gray-50 dark:bg-gray-900">
  <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Sign in to your account
      </h1>
  <form onSubmit={handleSubmit} className='max-w-md mx-auto space-y-4 flex flex-col'>
    <input 
      name="email" 
      type="email" 
      placeholder='Email' 
      onChange={handleChange} 
      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
    
    <input 
      name="password"
      type="password"
      placeholder='Password'
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

    />
    <button
      type='submit'
      className='bg-green-600 text-white py-2 px-4 rounded w-full mt-2'
    >Login</button>
  </form>
  </div>
  </div>
  </div>
</section>
);

};

// Export the login component so it can be used in other parts of the application
export default Login;