const express = require("express");
const router = express.Router();

const {
    createStudent,
    getStudentProfile,
    updateStudentProfile,
    getAllStudents,
    getStudentById,
    updateStudentById,
    deleteStudent
} = require("../controllers/studentController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// Admin Routes
router.get("/", protect, authorize("admin"), getAllStudents);
router.get("/:id", protect, authorize("admin"), getStudentById);
router.post("/", protect, authorize("admin"), createStudent);
router.put("/:id", protect, authorize("admin"), updateStudentById);
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteStudent
);

// Student Routes
router.get("/profile", protect, authorize("student"), getStudentProfile);
router.put(
    "/profile",
    protect,
    authorize("student"),
    updateStudentProfile
);

module.exports = router;