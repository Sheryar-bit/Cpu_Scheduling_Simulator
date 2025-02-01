# Process Scheduling Simulator

This is a **CPU Process Scheduling Simulator** that allows users to input processes and simulate different scheduling algorithms to compare their performance.

[Live Demo](https://comforting-cajeta-b307bb.netlify.app/)

## Features
- User-friendly interface to input processes
- Supports multiple scheduling algorithms:
  - **Shortest Job First (SJF)**
  - **Round Robin (RR)**
  - **Priority Scheduling**
  - **Shortest Remaining Time First (SRTF)**
  - **First-Come, First-Served (FCFS)**
- Displays results in tabular format
- Generates Gantt charts for visualization
- Stores and retrieves past results from a database

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Styling:** Responsive UI with CSS

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (version 14+ recommended)
- **MongoDB Atlas** (or local MongoDB instance)

### Steps to Run

1. **Clone the repository**
   ```sh
   git clone https://github.com/Sheryar-bit/Cpu_Scheduling_Simulator.git
   cd process-scheduling-simulator
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the server**
   ```sh
   node server.js
   ```
   The backend will start at `https://cpu-scheduling-simulator-iota.vercel.app/`.

5. **Open `index.html`**
   Simply open `index.html` in a browser to start using the simulator.

---

## 📂 Project Structure
```
process-scheduling-simulator/
│── public/
│   ├── index.html
│── server.js
│── package.json
│── .env
│── README.md
```

---

## 📜 Code Overview

### `index.html`
This file contains the **frontend UI** of the project, allowing users to input processes and view results.

### `server.js`
This file contains the **backend logic** to handle process scheduling calculations and database interactions.

---

## API Endpoints
| Method | Endpoint            | Description                     |
|--------|---------------------|---------------------------------|
| POST   | `/simulate`         | Simulates scheduling algorithms |
| GET    | `/past-results`     | Retrieves past results         |
| GET    | `/past-results/:id` | Retrieves a specific result    |
| DELETE | `/past-results/:id` | Deletes a result               |

---


## Future Improvements
- Add user authentication for saved results
- Support for additional scheduling algorithms
- Improve UI for better user experience

---


### 🔗 Connect with Me
[LinkedIn](www.linkedin.com/in/httsheryar-ali-53349a219) | [GitHub](https://github.com/Sheryar-bit)

###Owner
Muhammad Sheryar
