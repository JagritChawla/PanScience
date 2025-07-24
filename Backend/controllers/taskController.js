import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from 'fs';

export const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    console.log("Authenticated user:", req.user);


    // Set createdBy to admin user's ID
    taskData.createdBy = req.user._id;

    if (taskData.assignedTo) {
      const assignedUser = await User.findOne({ email: taskData.assignedTo });
      if (!assignedUser) {
        return res.status(400).json({ message: "Assigned user does not exist" });
      }
      taskData.assignedTo = assignedUser._id;
    }

    // req.files will contain the uploaded documents , it is created by multer middleware
    if (req.files && req.files.length > 0) {
      const uploadedDocs = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'tasks', // optional: group files in cloudinary
          resource_type: 'raw'
        });

        uploadedDocs.push({
          name: file.originalname,
          url: result.secure_url,
          public_id: result.public_id,
          contentType: file.mimetype,
          size: file.size
        });

      }

      taskData.documents = uploadedDocs;
    }

    const task = new Task(taskData);
    await task.save();

    // Populate assigned user details in response
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'email');

    res.status(201).json(populatedTask);
  } catch (error) {
  console.error("Error creating task:", error.message);
  console.error(error.stack);
  res.status(500).json({ error: error.message });
}

}

export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, sort, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const sortOptions = {};
    if (sort) {
      if (sort === 'dueDate:asc') sortOptions.dueDate = 1;
      if (sort === 'dueDate:desc') sortOptions.dueDate = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'email')
      .populate('createdBy', 'email');

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'email')
      .populate('createdBy', 'email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields from body
    task.title = req.body.title;
    task.description = req.body.description;
    task.status = req.body.status;
    task.priority = req.body.priority;
    task.dueDate = req.body.dueDate;

    // Handle assignedTo email -> user._id
    if (req.body.assignedTo) {
      const user = await User.findOne({ email: req.body.assignedTo });
      if (!user) {
        return res.status(400).json({ message: 'Assigned user does not exist' });
      }
      task.assignedTo = user._id;
    } else {
      task.assignedTo = undefined;
    }

    // Handle file deletions
    if (req.body.filesToDelete) {
      const filesToDelete = Array.isArray(req.body.filesToDelete) 
        ? req.body.filesToDelete 
        : [req.body.filesToDelete];
      
      // Remove files from Cloudinary and documents array
      for (const fileId of filesToDelete) {
        const fileIndex = task.documents.findIndex(doc => doc._id.toString() === fileId);
        if (fileIndex !== -1) {
          const file = task.documents[fileIndex];
          // Delete from Cloudinary
          await cloudinary.uploader.destroy(file.public_id);
          // Remove from documents array
          task.documents.splice(fileIndex, 1);
        }
      }
    }

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'tasks',
          resource_type: 'raw'
        });

        task.documents.push({
          name: file.originalname,
          url: result.secure_url,
          public_id: result.public_id,
          contentType: file.mimetype,
          size: file.size
        });
      }
    }

    const updatedTask = await task.save();

    // Populate references for response
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'email name')
      .populate('createdBy', 'email name');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      message: 'Failed to update task',
      error: error.message 
    });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const { status, priority, sort, page = 1, limit = 10 } = req.query;

    // Filter tasks assigned to logged-in user + optional filters
    const filter = { assignedTo: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Sorting options
    const sortOptions = {};
    if (sort) {
      if (sort === 'dueDate:asc') sortOptions.dueDate = 1;
      else if (sort === 'dueDate:desc') sortOptions.dueDate = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'email')
      .populate('createdBy', 'email');

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.remove();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};