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

// Student Routes (must stay ABOVE "/:id", otherwise "/profile" is treated as an id)
router.get("/profile", protect, authorize("student"), getStudentProfile);
router.put(
    "/profile",
    protect,
    authorize("student"),
    updateStudentProfile
);

// Admin Routes (teachers may list students to mark attendance and marks)
router.get("/", protect, authorize("admin", "teacher"), getAllStudents);
router.get("/:id", protect, authorize("admin"), getStudentById);
router.post("/", protect, authorize("admin"), createStudent);
router.put("/:id", protect, authorize("admin"), updateStudentById);
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteStudent
);

module.exports = router;
