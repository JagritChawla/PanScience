import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

export const createTask = async (req, res) => {
    try {
      const taskData = req.body;
      
      // Set createdBy to admin user's ID
      taskData.createdBy = req.user._id;
      
      if (taskData.assignedTo) {
        const assignedUser = await User.findOne({email:taskData.assignedTo});
        if (!assignedUser) {
          return res.status(400).json({ message: "Assigned user does not exist" });
        }
        taskData.assignedTo = assignedUser._id; 
      }

      // req.files will contain the uploaded documents , it is created by multer middleware
      if (req.files) {
        taskData.documents = req.files.map(file => ({
          name: file.originalname,
          path: file.path,
          contentType: file.mimetype,
          size: file.size
        }));
      }

      const task = new Task(taskData);
      await task.save();
      
      // Populate assigned user details in response
      const populatedTask = await Task.findById(task._id).populate('assignedTo', 'email');
      
      res.status(201).json(populatedTask);
    } catch (error) {
      res.status(400).json({ error: error.message });
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
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo // email from form
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields from body
    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate;

    // Handle assignedTo email -> user._id
    if (assignedTo) {
      const user = await User.findOne({ email: assignedTo });
      if (!user) {
        return res.status(400).json({ message: 'Assigned user does not exist' });
      }
      task.assignedTo = user._id;
    } else {
      task.assignedTo = undefined;
    }

    // Handle uploaded documents
    if (req.files && req.files.length > 0) {
      task.documents = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        contentType: file.mimetype,
        size: file.size
      }));
    }

    const updatedTask = await task.save();

    // Populate references for response
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'email')
      .populate('createdBy', 'email');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
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