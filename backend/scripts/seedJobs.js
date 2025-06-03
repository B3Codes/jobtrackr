const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("../models/Job");

// Load env
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Mongo connected ✅");
  seedJobs();
});

const userId = "67f7bb8351764c645badbe2c"; // 👈 use a real userId from your DB

const jobs = [
  {
    company: "Infosys",
    position: "Backend Developer",
    status: "applied",
    user: userId,
    createdAt: new Date("2025-04-01T10:00:00Z")
  },
  {
    company: "Zoho",
    position: "Frontend Engineer",
    status: "interview",
    user: userId,
    createdAt: new Date("2025-04-05T14:30:00Z")
  },
  {
    company: "TCS",
    position: "Full Stack Developer",
    status: "rejected",
    user: userId,
    createdAt: new Date("2025-04-10T09:45:00Z")
  },
  {
    company: "Flipkart",
    position: "React Developer",
    status: "offer",
    user: userId,
    createdAt: new Date("2025-04-11T12:00:00Z")
  },
  {
    company: "Google",
    position: "Frontend Developer",
    status: "interview",
    jobLocation: "Bangalore",
    salary: "30 LPA",
    interviewDate: new Date("2025-04-22"),
    notes: "Tech round completed",
    createdAt: new Date("2025-03-29T16:10:00Z")
  },
  {
    company: "Amazon",
    position: "Backend Developer",
    status: "applied",
    jobLocation: "Hyderabad",
    salary: "27 LPA",
    notes: "Waiting for response",
    createdAt: new Date("2024-04-03T08:25:00Z")
  },
  {
    company: "Microsoft",
    position: "Full Stack Developer",
    status: "offer",
    jobLocation: "Noida",
    salary: "32 LPA",
    notes: "Offer pending confirmation",
    createdAt: new Date("2025-03-15T13:15:00Z")
  },
  {
    company: "Flipkart",
    position: "Frontend Developer",
    status: "rejected",
    jobLocation: "Bangalore",
    salary: "22 LPA",
    notes: "Round 2 failed",
    createdAt: new Date("2025-04-12T11:00:00Z")
  },
  {
    company: "TCS",
    position: "Java Developer",
    status: "applied",
    jobLocation: "Pune",
    salary: "10 LPA",
    createdAt: new Date("2025-03-20T09:00:00Z")
  },
  {
    company: "Infosys",
    position: "React Developer",
    status: "interview",
    jobLocation: "Remote",
    salary: "15 LPA",
    interviewDate: new Date("2025-04-28"),
    createdAt: new Date("2025-04-15T17:45:00Z")
  },
  {
    company: "Wipro",
    position: "Angular Developer",
    status: "rejected",
    jobLocation: "Delhi",
    salary: "12 LPA",
    createdAt: new Date("2025-03-10T15:30:00Z")
  },
  {
    company: "Zoho",
    position: "Software Engineer",
    status: "applied",
    jobLocation: "Chennai",
    salary: "9 LPA",
    createdAt: new Date("2025-04-08T07:40:00Z")
  },
  {
    company: "CRED",
    position: "UI/UX Developer",
    status: "interview",
    jobLocation: "Remote",
    salary: "25 LPA",
    interviewDate: new Date("2025-04-24"),
    createdAt: new Date("2025-04-09T10:20:00Z")
  },
  {
    company: "Paytm",
    position: "Mobile App Developer",
    status: "offer",
    jobLocation: "Noida",
    salary: "20 LPA",
    createdAt: new Date("2025-04-06T19:05:00Z")
  },
  {
    company: "Freshworks",
    position: "DevOps Engineer",
    status: "applied",
    jobLocation: "Chennai",
    salary: "18 LPA",
    createdAt: new Date("2025-03-28T12:50:00Z")
  },
  {
    company: "BYJU'S",
    position: "QA Engineer",
    status: "interview",
    jobLocation: "Bangalore",
    salary: "16 LPA",
    createdAt: new Date("2025-04-02T08:55:00Z")
  },
  {
    company: "PhonePe",
    position: "Backend Engineer",
    status: "rejected",
    jobLocation: "Bangalore",
    salary: "21 LPA",
    createdAt: new Date("2025-04-07T18:40:00Z")
  },
  {
    company: "Ola",
    position: "Node.js Developer",
    status: "applied",
    jobLocation: "Pune",
    salary: "17 LPA",
    createdAt: new Date("2025-03-26T11:25:00Z")
  },
  {
    company: "Zerodha",
    position: "Full Stack Engineer",
    status: "interview",
    jobLocation: "Remote",
    salary: "28 LPA",
    createdAt: new Date("2025-04-04T13:30:00Z")
  },
];

// const jobs = [
//   {
//     company: "Google",
//     position: "Frontend Developer",
//     status: "interview",
//     jobLocation: "Bangalore",
//     salary: "30 LPA",
//     interviewDate: new Date("2025-04-22"),
//     notes: "Tech round completed",
//   },
//   {
//     company: "Amazon",
//     position: "Backend Developer",
//     status: "applied",
//     jobLocation: "Hyderabad",
//     salary: "27 LPA",
//     notes: "Waiting for response",
//   },
//   {
//     company: "Microsoft",
//     position: "Full Stack Developer",
//     status: "offer",
//     jobLocation: "Noida",
//     salary: "32 LPA",
//     notes: "Offer pending confirmation",
//   },
//   {
//     company: "Flipkart",
//     position: "Frontend Developer",
//     status: "rejected",
//     jobLocation: "Bangalore",
//     salary: "22 LPA",
//     notes: "Round 2 failed",
//   },
//   {
//     company: "TCS",
//     position: "Java Developer",
//     status: "applied",
//     jobLocation: "Pune",
//     salary: "10 LPA",
//   },
//   {
//     company: "Infosys",
//     position: "React Developer",
//     status: "interview",
//     jobLocation: "Remote",
//     salary: "15 LPA",
//     interviewDate: new Date("2025-04-28"),
//   },
//   {
//     company: "Wipro",
//     position: "Angular Developer",
//     status: "rejected",
//     jobLocation: "Delhi",
//     salary: "12 LPA",
//   },
//   {
//     company: "Zoho",
//     position: "Software Engineer",
//     status: "applied",
//     jobLocation: "Chennai",
//     salary: "9 LPA",
//   },
//   {
//     company: "CRED",
//     position: "UI/UX Developer",
//     status: "interview",
//     jobLocation: "Remote",
//     salary: "25 LPA",
//     interviewDate: new Date("2025-04-24"),
//   },
//   {
//     company: "Paytm",
//     position: "Mobile App Developer",
//     status: "offer",
//     jobLocation: "Noida",
//     salary: "20 LPA",
//   },
//   {
//     company: "Freshworks",
//     position: "DevOps Engineer",
//     status: "applied",
//     jobLocation: "Chennai",
//     salary: "18 LPA",
//   },
//   {
//     company: "BYJU'S",
//     position: "QA Engineer",
//     status: "interview",
//     jobLocation: "Bangalore",
//     salary: "16 LPA",
//   },
//   {
//     company: "PhonePe",
//     position: "Backend Engineer",
//     status: "rejected",
//     jobLocation: "Bangalore",
//     salary: "21 LPA",
//   },
//   {
//     company: "Ola",
//     position: "Node.js Developer",
//     status: "applied",
//     jobLocation: "Pune",
//     salary: "17 LPA",
//   },
//   {
//     company: "Zerodha",
//     position: "Full Stack Engineer",
//     status: "interview",
//     jobLocation: "Remote",
//     salary: "28 LPA",
//   },
// ];

const seedJobs = async () => {
  const finalJobs = jobs.map((job) => ({
    ...job,
    user: userId,
  }));

  await Job.insertMany(finalJobs);
  console.log("Dummy jobs inserted ✅");
  process.exit(0);
};
