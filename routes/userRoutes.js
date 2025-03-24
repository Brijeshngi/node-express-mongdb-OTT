import express from "express";
import {
  changePassword,
  createAdmin,
  createUser,
  deactivateProfile,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getContentOnsubcriptionPlan,
  getMyProfile,
  login,
  logout,
  logoutAllDevices,
  logoutFromOneDevice,
  resetPassword,
  selfDeleteUser,
  updateDevice,
  updateProfilePicture,
  upgradeSubscription,
  uploadProfilePicture,
} from "../controllers/userController.js";
import {
  checkDevice,
  isAdmin,
  isAuthenticated,
  isUser,
} from "../middlewares/Auth.js";
import singleUpload from "../middlewares/multer.js";
const router = express.Router();

router.route("/register").post(createUser);
router.route("/registeradmin").post(createAdmin);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated, logout);
router.route("/logoutall").post(isAuthenticated, logoutAllDevices);
router.route("/logoutfromdevice").post(isAuthenticated, logoutFromOneDevice);
router.route("/delete/:id").delete(isAuthenticated, isAdmin, deleteUser);
router
  .route("/deleteuser")
  .delete(isAuthenticated, isUser, selfDeleteUser)
  .put(isAuthenticated, isAdmin, deactivateProfile);

router
  .route("/profile")
  .get(isAuthenticated, isUser, checkDevice, getMyProfile)
  .post(isAuthenticated, singleUpload, uploadProfilePicture)
  .put(isAuthenticated, singleUpload, updateProfilePicture);

router.route("/changepassword").put(isAuthenticated, isUser, changePassword);
router.route("/allusers").get(isAuthenticated, isAdmin, getAllUsers);
router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword/:token").put(resetPassword);

router.route("/getdata").get(getContentOnsubcriptionPlan);

router.route("/updatedevices").put(updateDevice);

router.route("/upgrade").put(isAuthenticated, isUser, upgradeSubscription);

export default router;
