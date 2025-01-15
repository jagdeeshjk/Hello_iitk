const express = require("express");
const {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllCourses);
router.post("/", authenticateToken, addCourse);
router.put("/:id", authenticateToken, updateCourse);
router.delete("/:id", authenticateToken, deleteCourse);

module.exports = router;
