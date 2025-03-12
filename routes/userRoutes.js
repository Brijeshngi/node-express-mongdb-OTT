import express from "express";
import {
  changePassword,
  createAdmin,
  createUser,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getContentOnsubcriptionPlan,
  getMyProfile,
  login,
  logout,
  resetPassword,
  selfDeleteUser,
  updateDevice,
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
router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword/:token").put(resetPassword);

router.route("/getdata").get(getContentOnsubcriptionPlan);

router.route("/updatedevices").put(updateDevice);
export default router;
