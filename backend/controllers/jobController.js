const mongoose = require("mongoose");

// Import the Job model (which interacts with the MongoDB "jobs" collection)
const Job = require("../models/Job");

// ----------------------------------------
// CREATE a new Job
// ----------------------------------------
exports.createJob = async (req, res) => {
  try {
    const { company, position } = req.body;

    // Basic validation to ensure required fields are provided
    if (!company || !position) {
      return res.status(400).json({ message: "Company & Position are required" });
    }

    // Create a new job entry using request data and associating it with the logged-in user
    const newJob = new Job({
      ...req.body,      // Spread the rest of the request body (e.g., status, salary, notes, etc.)
      user: req.user   // Assign the job to the authenticated user
    });

    // Save job to database
    await newJob.save();

    // Respond with success message and the new job object
    res.status(201).json({ message: "Job added successfully", job: newJob });

  } catch (error) {
    console.error("Create Job Error:", error.message);
    res.status(500).json({ message: "Server Error!" });
  }
};

// Controller to get job application statistics: status-wise count and monthly trends
exports.getStats = async (req, res) => {
  console.log("Get Stats called");
  console.log("User ID in stats:", req.user);

  try {
    /** ----------------------------------------------------------
     * STEP 1: Job Status Count
     * Purpose: To get the count of jobs grouped by their `status` (e.g., pending, interview, declined)
     * Why? Allows us to show how many jobs are in each status category.
     * -----------------------------------------------------------
     * How?
     * - Use MongoDB Aggregation Pipeline
     * - First, filter jobs that belong only to the currently logged-in user
     * - Then group them by `status` field and count
     * 
     * Why Aggregation?
     * - It’s the most efficient way to group and count large sets of documents.
     * - Alternatives like `.find().reduce()` would be much slower and memory-intensive.
     */
    console.log("user", req.user );
    const statsAggreagtion = await Job.aggregate([
      
      {
        $match: { user: new mongoose.Types.ObjectId(req.user) } // Filter jobs created by the current user only
      },
      {
        $group: {
          _id: "$status", // Group by the 'status' field (e.g., "interview", "pending")
          count: { $sum: 1 } // Count the number of jobs in each status
        }
      }
    ]);

    /**
     * STEP 1.1: Convert Aggregation Result to Object Format
     * From: [ { _id: "pending", count: 2 }, { _id: "interview", count: 3 } ]
     * To:   { pending: 2, interview: 3 }
     * Why? Easier to use and access in frontend (e.g., charts, dashboard cards)
     * How? Using reduce()
     */
    const stats = statsAggreagtion.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    /** 
     * STEP 2: Monthly Job Trends (Last 6 Months)
     * Purpose: Show how many jobs were created in each of the last 6 months.
     * Why? Helps users visualize their application trend over time (e.g., line chart).
     * -----------------------------------------------------------
     * How?
     * - Match jobs by current user
     * - Group by `year` and `month` from `createdAt`
     * - Count how many jobs per group
     * - Sort by latest first (descending year/month)
     * - Limit to 6 most recent months
     * 
     * Why Aggregation?
     * - Efficient for time-series data.
     * - Avoids needing to load and filter large datasets in JavaScript.
     */

    const monthlyAggregation = await Job.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user) } // Again, match only jobs created by current user
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },  // Extract year from createdAt
            month: { $month: "$createdAt" } // Extract month from createdAt
          },
          count: { $sum: 1 } // Count jobs in each year-month combo
        }
      },
      {
        $sort: {
          "_id.year": -1,   // Sort by year descending
          "_id.month": -1   // Then by month descending
        }
      },
      // {
      //   $limit: 48 // Only keep the 6 latest months
      // }
    ]);

    /**
     * STEP 2.1: Format the Aggregated Monthly Data
     * From: [ { _id: {year: 2025, month: 4}, count: 3 } ]
     * To:   [ { date: 'Apr 2025', count: 3 } ]
     * Why? Much more readable format for the frontend (e.g., charts, tables)
     */
    const monthlyApplications = monthlyAggregation.map((item) => {
      const { year, month } = item._id;

      // Convert month number (1-12) to short month name (e.g., "Apr")
      const shortMonth = new Date(`${year}-${month}-01`).toLocaleString("default", {
        month: "short"
      });

      return {
        date: `${shortMonth} ${year}`, // e.g., "Apr 2025"
        count: item.count
      };
    });

    /**
     * STEP 3: Send Final Response
     * Structure:
     * - stats: { pending: 2, interview: 4, declined: 1 }
     * - monthlyApplications: [ {date: 'Apr 2025', count: 3}, ... ]
     */
    res.status(200).json({
      stats,
      monthlyApplications
    });

  } catch (error) {
    // STEP 4: Handle Errors
    console.error("Get Status Error:", error.message);
    res.status(500).json({ message: "Server Error!" });
  }
}




/**
 * WHY `req.user`?
 * - We assume `req.user` is set by authentication middleware after verifying JWT.
 * - This ensures jobs are user-specific.
 * - Alternative: You could have passed userId in body, but that would be insecure.
 */

// ----------------------------------------
// GET all Jobs for a user
// ----------------------------------------
// exports.getJob = async (req, res) => {
//   try {
//     // Fetch jobs where user matches the logged-in user, sorted by newest first
//     const job = await Job.find({ user: req.user }).sort("-createdAt");

//     res.status(200).json({ message: "Jobs fetched successfully", jobs: job });

//   } catch (error) {
//     console.error("Get Job Error:", error.message);
//     res.status(500).json({ message: "Server Error!" });
//   }
// };

// Controller to fetch jobs with filtering, searching, sorting, and pagination
exports.getJob = async (req, res) => {
  try {
    // Destructuring the query parameters from the URL
    // If page and limit are not provided, defaults are set (page=1, limit=10)
    const { status, search, sort, page = 1, limit = 12 } = req.query;

    /**
     * STEP 1: Construct base query object
     * - We always filter jobs by the logged-in user using `req.user`
     * - This ensures users only see their own job entries
     * 
     * WHY this?
     * - Security and user isolation: one user shouldn't access another's data.
     * 
     * Alternatives:
     * - Pass user ID in request query/body, but that's insecure and could be tampered with.
     */
    const queryObject = {
      user: req.user, // Automatically set by authentication middleware (e.g., after JWT verification)
    };

    /**
     * STEP 2: Apply search filter (if any)
     * - We check if the `search` keyword is provided
     * - If yes, we perform a case-insensitive regex match on `company` and `position` fields
     * 
     * WHY regex with `$or`?
     * - Enables partial and flexible search across multiple fields
     * 
     * Alternatives:
     * - Full-text search via MongoDB indexes (faster, but requires index setup)
     * - Third-party search engines like Elasticsearch (more powerful but overkill for small apps)
     */
    if (search) {
      queryObject.$or = [
        { company: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    /**
     * STEP 3: Filter by job `status` (if any)
     * - Only apply this filter if a valid status is selected (not "all")
     * 
     * WHY skip when "all"?
     * - "all" is a UI concept, not a real filter — it means "no filter"
     * 
     * Alternatives:
     * - Allow "all" and handle logic differently, but this is simple and clean
     */
    if (status && status !== 'all') {
      queryObject.status = status;
    }

    /**
     * STEP 4: Build base query using the constructed queryObject
     * - At this point, queryObject has all filters applied
     * 
     * WHY build a `result` variable?
     * - So we can chain further query modifiers like sort, skip, and limit
     */
    let result = Job.find(queryObject);

    /**
     * STEP 5: Apply sorting based on the `sort` parameter
     * - Supports "latest", "oldest", "a-z", and "z-a"
     * 
     * Explanation of sort values:
     * - latest  => sort by `createdAt` descending
     * - oldest  => sort by `createdAt` ascending
     * - a-z     => sort by `company` ascending (alphabetical)
     * - z-a     => sort by `company` descending (reverse alphabetical)
     * 
     * WHY use `.sort()` here?
     * - MongoDB supports native sorting which is fast and efficient
     * 
     * Alternatives:
     * - You could sort on the client side after fetching, but that's inefficient for large datasets
     */
    if (sort === "latest") {
      result = result.sort("-createdAt");
    } else if (sort === "oldest") {
      result = result.sort("createdAt");
    } else if (sort === "a-z") {
      result = result.sort("company");
    } else if (sort === "z-a") {
      result = result.sort("-company");
    }

    /**
     * STEP 6: Apply pagination logic
     * - We calculate the number of documents to skip based on the page and limit
     * 
     * skip = (page - 1) * limit
     * - Example: page=2, limit=10 => skip = 10
     * 
     * WHY use skip/limit?
     * - Efficient server-side pagination using MongoDB’s built-in methods
     * 
     * Alternatives:
     * - Use range-based pagination with `_id` for performance (used in large-scale apps)
     */
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(Number(limit)); // Ensure limit is a number

    /**
     * STEP 7: Execute the query to fetch paginated & sorted jobs
     */
    const jobs = await result;

    /**
     * STEP 8: Count total matching documents
     * - Needed for frontend pagination UI (e.g., showing total pages)
     */
    const totalJobs = await Job.countDocuments(queryObject);
    const numsOfPages = Math.ceil(totalJobs / limit); // Total pages = total jobs ÷ jobs per page

    /**
     * STEP 9: Respond with final data
     * - Jobs array + metadata for pagination
     */
    res.status(200).json({
      jobs,
      totalJobs,
      numsOfPages,
    });

  } catch (error) {
    console.error("Get Job Error:", error.message);

    // Handle unexpected server errors
    res.status(500).json({ message: "Server Error" });
  }
};


/**
 * WHY `sort("-createdAt")`?
 * - Returns newest jobs first.
 * - Alternative: No sort (unordered), or ascending (`sort("createdAt")`) to get oldest first.
 */


// ----------------------------------------
// CREATE a single Job
// ----------------------------------------
exports.getSingleJob = async (req, res) => {
  console.log("Get Single Job called");
  try {

    const job = await Job.findOne({_id: req.params.id, user: req.user});
    // check if job exists
    if(!job) {
      return res.status(404).json({message: "Job not found"});
    }

    res.status(200).json({message: "Job fetched successfully", job});

  } catch (error) {
    console.error("Get Single Job Error:", error);
    res.status(500).json({ message: "Server Error!" });
  }
}

// ----------------------------------------
// UPDATE a Job
// ----------------------------------------
exports.updateJob = async (req, res) => {
  console.log("Update Job called: ", req.params);
  try {
    const { id } = req.params;

    // First, ensure the job exists and belongs to the logged-in user
    let job = await Job.findOne({ _id: id, user: req.user });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Now, update the job with new data
    job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,           // Return the updated job in the response
      runValidators: true, // Ensure validations from schema are applied
    });

    res.status(200).json({ message: "Job updated successfully", job });

  } catch (error) {
    console.error("Update Job Error:", error.message);
    res.status(500).json({ message: "Server Error!" });
  }
};

/**
 * WHY use `findOne` before `findByIdAndUpdate`?
 * - To check if the job exists and belongs to the user.
 * - Alternative: You could directly try `findByIdAndUpdate(id)` and check result, but
 *   it wouldn't confirm if the job belongs to the logged-in user.
 */

// ----------------------------------------
// DELETE a Job
// ----------------------------------------
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the job by ID and user, and delete it if found
    const job = await Job.findOneAndDelete({ _id: id, user: req.user });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully", job });

  } catch (error) {
    console.error("Delete Job Error:", error.message);
    res.status(500).json({ message: "Server Error!" });
  }
};

/**
 * WHY `findOneAndDelete({ _id: id, user: req.user })`?
 * - This ensures that only the owner of the job can delete it.
 * - Alternative: `findByIdAndDelete(id)` could allow users to delete jobs they don't own.
 */




