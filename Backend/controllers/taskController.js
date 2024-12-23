// const Task = require("../models/Task");
// const User = require("../models/User");
// const mongoose = require("mongoose"); // Add this line

// const createTask = async (req, res) => {
//   const { title, description, status, priority, dueDate } = req.body;

//   try {
//     const user = req.user;
//     if (user.role === "User") {
//       const taskCount = await Task.countDocuments({ user: user.id });
//       if (taskCount >= 10) {
//         return res
//           .status(400)
//           .json({ message: "You can only create up to 10 tasks." });
//       }
//     }
//     const task = await Task.create({
//       title,
//       description,
//       status,
//       priority,
//       dueDate,
//       user: user.id,
//     });

//     res.status(201).json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getTasks = async (req, res) => {
//   const { page = 1, limit = 10, sortBy = "dueDate", order = "asc", title = "" } = req.query;

//   try {
//     const user = req.user;
//     console.log("Logged-in user:", user); // Add this for debugging

//     const query = user.role === "Admin" ? {} : { user: user.id }; // Admin sees all, User sees their tasks

//     if (title) {
//       query.title = { $regex: title, $options: "i" }; // Case-insensitive title search
//     }

//     const tasks = await Task.find(query)
//       .populate("user", "name email")
//       .sort({ [sortBy]: order === "asc" ? 1 : -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const totalTasks = await Task.countDocuments(query);
//     const totalPages = Math.ceil(totalTasks / limit);

//     res.status(200).json({ tasks, totalPages });
//   } catch (error) {
//     console.error("Error fetching tasks:", error); // Log errors
//     res.status(500).json({ message: error.message });
//   }
// };



// // Update a Task
// const updateTask = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const task = await Task.findById(id);

//     if (!task) {
//       return res.status(404).json({ message: "Task not found." });
//     }

//     // Check permissions
//     if (req.user.role !== "Admin" && task.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "You are not authorized to update this task." });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
//     res.status(200).json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete a Task
// const deleteTask = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const task = await Task.findById(id);

//     if (!task) {
//       return res.status(404).json({ message: "Task not found." });
//     }

//     // Check permissions
//     if (req.user.role !== "Admin" && task.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "You are not authorized to delete this task." });
//     }

//     // Delete task using findByIdAndDelete
//     await Task.findByIdAndDelete(id);

//     res.status(200).json({ message: "Task deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getTaskById = async (req, res) => {
//   const { id } = req.params;

//   // Validate the MongoDB ObjectId
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid task ID." });
//   }

//   try {
//     const task = await Task.findById(id);

//     if (!task) {
//       return res.status(404).json({ message: "Task not found." });
//     }

//     res.status(200).json(task);
//   } catch (error) {
//     console.error("Error fetching task:", error);
//     res.status(500).json({ message: "Error fetching task details." });
//   }
// };

// module.exports = { createTask, getTasks, updateTask, deleteTask,getTaskById };




const Task = require("../models/Task");
const User = require("../models/User");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  try {
    const user = req.user;

    // Limit tasks for regular users
    if (user.role === "User") {
      const taskCount = await Task.countDocuments({ user: user.id });
      if (taskCount >= 10) {
        return res.status(400).json({ message: "You can only create up to 10 tasks." });
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  const { page = 1, limit = 10, sortBy = "dueDate", order = "asc", title = "" } = req.query;

  try {
    const user = req.user;
    console.log("Logged-in user:", user); // Debugging info

    const query = user.role === "Admin" ? {} : { user: user.id }; // Admin sees all, users see their tasks

    if (title) {
      query.title = { $regex: title, $options: "i" }; // Case-insensitive title search
    }

    const tasks = await Task.find(query)
      .populate("user", "name email")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({ tasks, totalPages });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Check permissions
    if (req.user.role !== "Admin" && task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this task." });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Check permissions
    if (req.user.role !== "Admin" && task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this task." });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Error fetching task details." });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask, getTaskById };
