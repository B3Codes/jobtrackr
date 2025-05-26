import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({job, onDelete}) => {
  const navigate = useNavigate();
  const {
    _id,
    company,
    position,
    jobLocation,
    status,
    createdAt
} = job;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-GB");

  return (
  //   <section class="bg-gray-50 dark:bg-gray-900">
  // <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
  <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-6 sm:max-w-md">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{position}</h2>
  <p className="text-gray-700 dark:text-gray-300">Company: {company}</p>
  <p className="text-gray-500 text-sm dark:text-gray-400">Location: {jobLocation}</p>
  <p className="text-sm text-gray-400 dark:text-gray-500">Applied: {formattedDate}</p>
  <p
    className={`text-sm font-medium ${
      status === "rejected" ? "text-red-500" : "text-green-500"
    }`}
  >
    Status: {status}
  </p>

  {/* Action buttons */}
  <div className="flex justify-between items-center mt-4">
    <button
      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
      onClick={() => navigate(`/EditJob/${_id}`)}
    >
      Edit
    </button>
    <button
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
      onClick={() => onDelete(_id)}
    >
      Delete
    </button>
  </div>
</div>

    
    // </section
  );
}

export default JobCard;