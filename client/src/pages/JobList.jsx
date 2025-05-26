import React, { useEffect, useState } from "react";
import API from "../services/api";
import JobCard from "../components/JobCard";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

const [totalPages, setTotalPages] = useState(1);


  // Fetch jobs on page load
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await API.get("/job", {
        params: {
          search,
          status,
          sort,
          page,
        },
      });
      console.log(response.data.jobs);
      setJobs(response.data.jobs);
      setTotalPages(response.data.numsOfPages);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    } finally {
      setLoading(false);
    } 
  };

  // Delete job by ID
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/job/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    } catch (error) {
      console.error("Error deleting job:", error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
    window.scrollTo(0, 0); // Scroll to top on page change
  }, [search, status, sort, page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Jobs</h1>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search company or position"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>

        <button
          onClick={() => {
            setPage(1);
            fetchJobs();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      {loading ? (
        <p>Loading jobs...</p>
      ): jobs.length === 0 ? (
        <p className="text-gray-500">No jobs added yet.</p>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}

{/* {totalPages > 1 && (
  <div className="flex gap-4 mt-6 justify-center">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        onClick={() => setPage(p)}
        className={`px-4 py-2 rounded border ${
          page === p ? "bg-blue-600 text-white" : "bg-white"
        }`}
      >
        {p}
      </button>
    ))}
  </div>
)} */}

{totalPages > 1 && (
  <div className="flex justify-center items-center gap-6 mt-6">
    <button
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      disabled={page === 1}
      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
      Previous
    </button>

    <span className="font-medium text-gray-700">
      Page {page} of {totalPages}
    </span>

    <button
      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={page === totalPages}
      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}


    </div>
  );
};

export default JobList;