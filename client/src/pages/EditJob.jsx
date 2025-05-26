import React, {useState, useEffect} from "react";
import { useParams, useNavigate, useFetcher } from "react-router-dom";

import API from "../services/api";

const EditJob = () => {
  const {id} = useParams(); // get job id from url
  console.log(id);
  const navigate = useNavigate();

  // sate to hold job data
  const [formData, setForm] = useState({
    company:"",
    position:"",
    jobLocation:"",
    status:"applied",
    salary:"",
    notes:""

  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // fetch job details on mount
  useEffect(() => {
    const fetchJob = async () => {
      try{

        const res = await API.get(`/job/${id}`);
        // console.log(res.data.job); 
        setForm(res.data.job); // set form state with job data
         
      } catch (error) {
        setError(error.message);
        console.error("Error fetching job:", error.message);
      } finally  {
        setLoading(false);
      }
    };

    fetchJob(); // call fetchJob function

  }, [id]); // run effect only when id changes

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission

  }

  const handleChange = (e) => {
    setForm({...formData, [e.target.name]: e.target.value}); // update form state with input values
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <input
          type='text'
          name='position'
          placeholder='Job Position'
          value={formData.position}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <div className='flex flex-row'>
        <input
          type='text'
          name='jobLocation'
          placeholder='Location'
          value={formData.jobLocation}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-1"
         />
         <select
          name='status'
          value={formData.status}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-1"
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
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <textarea
          name='notes'
          placeholder='Notes'
          value={formData.notes}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button type='submit' className='bg-blue-600 text-white px-6 py-2 rounded w-full'>Update Job</button>
      </form>
    </div>
    </div>
    </div>
    </section>
  );

}

export default EditJob;