import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AddJob = () => {
  const navigate = useNavigate();

  // Form state to hold job details
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    jobLocation: "Remote",
    status: 'applied',
    salary: "",
    notes: "",
  });

  const [error,setError] = useState("");

  // handle filed changes
  const handleChange = (e) => {
    setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.company || !formData.position){
      return setError("Company and Position are required."); 
    }

    try {
      await API.post("/job", formData); // Send POST request to add job
      navigate("/jobs"); // Redirect to job list after successful submission
    } catch (error) {
      console.error("Error adding job:", error.message);
      setError("Failed to add job. Please try again.");
    }
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
  <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Add New Job
      </h2>
      {error && <p className='text-red-500 mb-4'>{error}</p>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          name='company'
          placeholder='Company Name'
          value={formData.company}
          onChange={handleChange}
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <input
          type='text'
          name='position'
          placeholder='Job Position'
          value={formData.position}
          onChange={handleChange}
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className='flex flex-row'>
        <input
          type='text'
          name='jobLocation'
          placeholder='Location'
          value={formData.jobLocation}
          onChange={handleChange}
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-1"
         />
         <select
          name='status'
          value={formData.status}
          onChange={handleChange}
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-1"
         >
          <option value='applied'>Applied</option>
          <option value='interview'>Interview</option>
          <option value='offer'>Offer</option>
          <option value='rejected'>Rejected</option>
        </select>
        </div>
        <input
          type='text'
          name='salary'
          placeholder='Salary'
          value={formData.salary}
          onChange={handleChange}
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <textarea
          name='notes'
          placeholder='Notes'
          value={formData.notes}
          onchange={handleChange}
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button type='submit' className='bg-blue-600 text-white px-6 py-2 rounded w-full'>Add Job</button>
      </form>
    </div>
    </div>
    </div>
    </section>
  );
}

export default AddJob;