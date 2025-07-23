import express from 'express';
import { createTask, getAllTasks,getTaskById, getMyTasks , updateTask, deleteTask } from '../controllers/taskController.js';
import { protectRoute, adminRoute } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';


const router = express.Router();


// Only admin can create and assign tasks
router.post('/',protectRoute,adminRoute,upload.array('documents', 3),createTask);

router.get('/', protectRoute, adminRoute, getAllTasks);

router.get('/:id', protectRoute, getTaskById);

router.put('/:id', protectRoute, adminRoute, upload.array('documents', 3), updateTask);


router.get('/my', protectRoute, getMyTasks);

router.delete('/:id', protectRoute, adminRoute, deleteTask);

export default router;