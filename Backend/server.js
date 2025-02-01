const express = require("express");
const app = express()
const mongoose = require("mongoose");
require('dotenv').config();
const path = require("path");
const cors = require("cors");
app.use(cors());

app.use(express.json());
const port = 3000;

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("Error connecting to MongoDB:", err));

// app.use(express.static(path.join(__dirname, "FrontEnd")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "FrontEnd", "index.html"));
// });

// Define a schema for our simulation results
const ResultSchema = new mongoose.Schema({
  algorithm: String,
  input: {
    jobs: [
      {
        name: String,
        arrivalTime: Number,
        burstTime: Number,
        priority: Number,
      },
    ],
  },
  result: {
    sjf: {
      jobs: [
        {
          name: String,
          completionTime: Number,
          turnaroundTime: Number,
          waitingTime: Number,
        },
      ],
      averages: {
        avgTAT: Number,
        avgWT: Number,
      },
    },
    rr: {
      jobs: [
        {
          name: String,
          completionTime: Number,
          turnaroundTime: Number,
          waitingTime: Number,
        },
      ],
      averages: {
        avgTAT: Number,
        avgWT: Number,
      },
    },
    priority: {
      jobs: [
        {
          name: String,
          completionTime: Number,
          turnaroundTime: Number,
          waitingTime: Number,
        },
      ],
      averages: {
        avgTAT: Number,
        avgWT: Number,
      },
    },
    srtf: {
      jobs: [
        {
          name: String,
          completionTime: Number,
          turnaroundTime: Number,
          waitingTime: Number,
        },
      ],
      averages: {
        avgTAT: Number,
        avgWT: Number,
      },
    },
    fcfs: {
      jobs: [
        {
          name: String,
          completionTime: Number,
          turnaroundTime: Number,
          waitingTime: Number,
        },
      ],
      averages: {
        avgTAT: Number,
        avgWT: Number,
      },
    },
    bestAlgorithm: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Result = mongoose.model("Result", ResultSchema);

app.use(express.static(path.join(__dirname, "public")));



// Function to calculate average turnaround time and waiting time
function calculateAverages(jobs) {
  const totalTurnaroundTime = jobs.reduce((sum, job) => sum + job.turnaroundTime, 0);
  const totalWaitingTime = jobs.reduce((sum, job) => sum + job.waitingTime, 0);
  return {
    avgTAT: totalTurnaroundTime / jobs.length,
    avgWT: totalWaitingTime / jobs.length,
  };
}



// Shortest Job First (SJF) Scheduling Algorithm
function sjfScheduling(jobs) {
    const sortedJobs = [...jobs].sort((a, b) => a.burstTime - b.burstTime);
    let time = 0;
    const scheduledJobs = sortedJobs.map(job => {
      let waitingTime = Math.max(time - job.arrivalTime, 0);
      let turnaroundTime = waitingTime + job.burstTime;
      time += job.burstTime;
      return {
        ...job,
        completionTime: time,
        turnaroundTime,
        waitingTime,
      };
    });
  
    return {
      jobs: scheduledJobs,
      averages: calculateAverages(scheduledJobs),
    }
}



// Round Robin (RR) Scheduling Algorithm (Simple Placeholder)
function roundRobinScheduling(jobs, quantum = 2) {
    let queue = [...jobs];  
    let time = 0;
    let scheduledJobs = [];
    let remainingTime = jobs.map(job => job.burstTime);
    let turnaroundTimes = {};
    let waitingTimes = {};
  
    while (queue.length > 0) {
      let job = queue.shift();
      let jobIndex = jobs.findIndex(j => j.name === job.name);
  
      if (remainingTime[jobIndex] > quantum) {
        time += quantum;
        remainingTime[jobIndex] -= quantum;
        queue.push(job);
      } else {
        time += remainingTime[jobIndex];
        remainingTime[jobIndex] = 0;
        turnaroundTimes[job.name] = time - job.arrivalTime;
        waitingTimes[job.name] = turnaroundTimes[job.name] - job.burstTime;
        scheduledJobs.push({
          ...job,
          completionTime: time,
          turnaroundTime: turnaroundTimes[job.name],
          waitingTime: waitingTimes[job.name]
        });
      }
    }
  
    return {
      jobs: scheduledJobs,
      averages: calculateAverages(scheduledJobs),
    };
  }
  
  function srtfScheduling(jobs) {
    const remainingJobs = jobs.map((job) => ({ ...job, remainingTime: job.burstTime }))
    let currentTime = 0
    const completedJobs = []
  
    while (remainingJobs.length > 0) {
      const availableJobs = remainingJobs.filter((job) => job.arrivalTime <= currentTime)
  
      if (availableJobs.length === 0) {
        currentTime = Math.min(...remainingJobs.map((job) => job.arrivalTime))
        continue
      }
  
      const shortestJob = availableJobs.reduce((prev, curr) => (prev.remainingTime < curr.remainingTime ? prev : curr))
  
      shortestJob.remainingTime--
      currentTime++
  
      if (shortestJob.remainingTime === 0) {
        const completedJob = {
          ...shortestJob,
          completionTime: currentTime,
          turnaroundTime: currentTime - shortestJob.arrivalTime,
          waitingTime: currentTime - shortestJob.arrivalTime - shortestJob.burstTime,
        }
        completedJobs.push(completedJob)
        const index = remainingJobs.findIndex((job) => job.name === shortestJob.name)
        remainingJobs.splice(index, 1)
      }
    }
  
    return {
      jobs: completedJobs,
      averages: calculateAverages(completedJobs),
    }
  }
  
  // First-Come, First-Served (FCFS) Scheduling Algorithm
  function fcfsScheduling(jobs) {
    const sortedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime)
    let currentTime = 0
    const scheduledJobs = sortedJobs.map((job) => {
      currentTime = Math.max(currentTime, job.arrivalTime)
      const waitingTime = currentTime - job.arrivalTime
      const turnaroundTime = waitingTime + job.burstTime
      const completionTime = currentTime + job.burstTime
      currentTime = completionTime
      return {
        ...job,
        completionTime,
        turnaroundTime,
        waitingTime,
      }
    })
  
    return {
      jobs: scheduledJobs,
      averages: calculateAverages(scheduledJobs),
    }
  }
  



// Priority Scheduling Algorithm (Simple Placeholder)
function priorityScheduling(jobs) {
    const sortedJobs = [...jobs].sort((a, b) => a.priority - b.priority);
    let time = 0;
    const scheduledJobs = sortedJobs.map(job => {
      let waitingTime = Math.max(time - job.arrivalTime, 0);
      let turnaroundTime = waitingTime + job.burstTime;
      time += job.burstTime;
      return {
        ...job,
        completionTime: time,
        turnaroundTime,
        waitingTime,
      };
    });
  
    return {
      jobs: scheduledJobs,
      averages: calculateAverages(scheduledJobs),
    };
  }
  

// Determine the Best Scheduling Algorithm Based on Waiting Time
function getBestAlgorithm(sjfResult, rrResult, priorityResult, srtfResult, fcfsResult) {
  const avgWaitingTimes = {
    SJF: sjfResult.averages.avgWT,
    "Round Robin": rrResult.averages.avgWT,
    Priority: priorityResult.averages.avgWT,
    SRTF: srtfResult.averages.avgWT,
    FCFS: fcfsResult.averages.avgWT,
  };
  return Object.entries(avgWaitingTimes).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
}

// API Endpoint to Simulate Scheduling Algorithms
app.post("/simulate", async (req, res) => {
  console.log("Received simulation request:", req.body);
  const { jobs } = req.body;

  const sjfJobs = sjfScheduling(jobs);
  const rrJobs = roundRobinScheduling(jobs);
  const priorityJobs = priorityScheduling(jobs);
  const srtfJobs = srtfScheduling(jobs)
  const fcfsJobs = fcfsScheduling(jobs)


  const sjfResult = { jobs: sjfJobs.jobs, averages: calculateAverages(sjfJobs.jobs) };
  const rrResult = { jobs: rrJobs.jobs, averages: calculateAverages(rrJobs.jobs) };
  const priorityResult = { jobs: priorityJobs.jobs, averages: calculateAverages(priorityJobs.jobs) };
  const fcfsResult = { jobs: fcfsJobs.jobs, averages: calculateAverages(fcfsJobs.jobs) };
  const srtfResult = { jobs: srtfJobs.jobs, averages: calculateAverages(srtfJobs.jobs) };

  const result = {
    sjf: sjfResult,
    rr: rrResult,
    srtf: srtfResult,
    fcfs: fcfsResult,
    priority: priorityResult,
    bestAlgorithm: getBestAlgorithm(sjfResult, rrResult, priorityResult, srtfResult, fcfsResult),
  };

  // Save result to database
  const newResult = new Result({
    algorithm: "CPU Scheduling",
    input: { jobs },
    result,
  });

  try {
    await newResult.save();
    console.log("Result saved to database");
  } catch (err) {
    console.error("Error saving to database:", err);
  }

  res.json(result);
});

// API Endpoint to Retrieve the Last 10 Simulation Results
app.get("/past-results", async (req, res) => {
  const results = await Result.find().sort("-createdAt").limit(10);
  res.json(results);
});

// API Endpoint to Retrieve a Specific Simulation Result by ID
app.get("/past-results/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
    if (!result) {
      return res.status(404).json({ message: "Result not found" })
    }

 
    const formattedResult = {
      sjf: formatAlgorithmResult(result.result.sjf),
      rr: formatAlgorithmResult(result.result.rr),
      priority: formatAlgorithmResult(result.result.priority),
      srtf: formatAlgorithmResult(result.result.srtf),
      fcfs: formatAlgorithmResult(result.result.fcfs),
      bestAlgorithm: result.result.bestAlgorithm,
    }

    res.json({ result: formattedResult })
  } catch (error) {
    console.error("Error fetching past result:", error)
    res.status(500).json({ message: "Server error" })
  }
})

function formatAlgorithmResult(algorithmResult) {
  if (!algorithmResult) {
    return {
      jobs: [],
      averages: { avgTAT: 0, avgWT: 0 },
    }
  }

  return {
    jobs: algorithmResult.jobs || [],
    averages: {
      avgTAT: algorithmResult.averages ? algorithmResult.averages.avgTAT : 0,
      avgWT: algorithmResult.averages ? algorithmResult.averages.avgWT : 0,
    },
  }
}


app.delete("/past-results/:id", async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id)
    if (!result) {
      return res.status(404).json({ message: "Result not found" })
    }
    res.json({ message: "Result deleted successfully" })
  } catch (error) {
    console.error("Error deleting result:", error)
    res.status(500).json({ message: "Server error" })
  }
})



// Start the Server
app.listen(port, () => {
  console.log(process.env.MONGO_URI)
  console.log(`Server running at https://cpu-scheduling-simulator-iota.vercel.app/${port}`);
});
