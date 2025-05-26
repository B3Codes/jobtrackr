import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import JobList from "./pages/JobList";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";

function App() {
  return (
    // <div className="text-2xl text-center text-blue-600 mt-10">
    //   🚀 JobTrackr Frontend Started!
    // </div>
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/jobs" element = {<ProtectedRoute><JobList /></ProtectedRoute>} />
      <Route path="/addJob" element = {<ProtectedRoute><AddJob /></ProtectedRoute>} />
      <Route path="/editJob/:id" element = {<ProtectedRoute><EditJob /></ProtectedRoute>} />


      {/* Catch All */}
      <Route path="*" element={<h1 className="text-2xl text-center text-red-600 mt-10">404 Not Found</h1>} />
    </Routes>
    </>
  );
}


export default App
