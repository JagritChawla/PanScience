import express from "express";
import { registerUser ,loginUser} from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

const getUserDetails = (req,res)=>{
    res.send("User Details") ;
}

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protectRoute, getUserDetails);




export default router;