import express from "express";
import {
  changePassword,
  createAdmin,
  createUser,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  resetPassword,
  selfDeleteUser,
  updateProfilePicture,
  uploadProfilePicture,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated, isUser } from "../middlewares/Auth.js";
import singleUpload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(createUser);
router.route("/registeradmin").post(createAdmin);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated, logout);
router.route("/delete/:id").delete(isAuthenticated, isAdmin, deleteUser);
router.route("/deleteuser").delete(isAuthenticated, isUser, selfDeleteUser);

router
  .route("/profile")
  .get(isAuthenticated, isAdmin, getMyProfile)
  .post(isAuthenticated, singleUpload, uploadProfilePicture)
  .put(isAuthenticated, singleUpload, updateProfilePicture);

router.route("/changepassword").put(isAuthenticated, isUser, changePassword);
router.route("/allusers").get(isAuthenticated, isAdmin, getAllUsers);
router.route("/forgetpassword").post(isAuthenticated, isUser, forgetPassword);

router
  .route("/resetpassword/:token")
  .put(isAuthenticated, isUser, resetPassword);

export default router;
