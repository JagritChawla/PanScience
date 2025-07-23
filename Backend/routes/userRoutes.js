import express from "express";
import { registerUser ,loginUser,updateMyCredentials,getAllUsers , adminUpdateUserRole, deleteMyAccount , getUserById} from "../controllers/userController.js";
import { protectRoute,adminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);

router.put('/mine', protectRoute, updateMyCredentials);

router.get('/', protectRoute, adminRoute, getAllUsers);

router.put('/:id', protectRoute, adminRoute, adminUpdateUserRole);

router.delete('/mine', protectRoute, deleteMyAccount);

router.get('/:id', protectRoute, adminRoute, getUserById);


export default router;