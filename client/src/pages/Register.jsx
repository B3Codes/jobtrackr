import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

// Register Component
const Register = () => {
  const [form, setForm] = useState({name: "", email: "", password: ""});
  const navigate = useNavigate();
  const { login } = useAuth();  // use login method from context

  // update form state on input change
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
       const response = await API.post("/auth/register", form); // API call backend
       login(response.data.user, response.data.token) // store user + token
       navigate("/dashboard"); // redirect to dashboard
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Failed to register. Please try again.");
    }
  };



  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mt-20">
      <h2 className='text-2xl font-bold text-center'>Register</h2>
      <input name='name' type="text" placeholder='Name' onChange={handleChange} className='input' />
      <input name='email' type='email' placeholder='Email' onChange={handleChange} className='input'/>
      <input name='password' type='password' placeholder='Password' onChange={handleChange} className='input'/>
      <button type='submit' className='bg-blue-600 text-white py-2 px-4 rounded w-full'>Register</button>
    </form>
  );
}

export default Register;