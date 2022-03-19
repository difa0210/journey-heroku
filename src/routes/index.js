const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");
const {
  register,
  checkAuth,
  login,
  profile,
  updateProfile,
} = require("../controllers/auth");
const {
  addJourney,
  getJourneysUser,
  getJourneys,
  getJourneyDetail,
  deleteJourney,
  getJourneySearch,
  updateJourney,
} = require("../controllers/journey");
const {
  addBookmark,
  getBookmarks,
  deleteBookmark,
} = require("../controllers/bookmark");

// Controller Route Here
router.post("/register", uploadFile("image"), register);
router.post("/login", login);
router.post("/journey", auth, uploadFile("image"), addJourney);
router.post("/bookmark", auth, addBookmark);
router.patch("/profile/:id", auth, uploadFile("image"), updateProfile);
router.patch("/journey/:id", auth, uploadFile("image"), updateJourney);
router.get("/check-auth", auth, checkAuth);
router.get("/profile/:id", auth, profile);
router.get("/bookmarks", auth, getBookmarks);
router.get("/my-journeys", auth, getJourneysUser);
router.get("/journeys", getJourneys);
router.get("/journey/:id", getJourneyDetail);
router.get("/journey-search", getJourneySearch);
router.delete("/bookmark/:id", deleteBookmark);
router.delete("/deletejourney/:id", deleteJourney);

module.exports = router;
