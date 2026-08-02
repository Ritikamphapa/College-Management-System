const express = require("express");
const router = express.Router();

const {
    markAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    getAttendancePercentage,
    getStudentAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

// Admin & Teacher Routes
router.post("/", protect, authorize("admin", "teacher"), markAttendance);

router.get("/", protect, authorize("admin", "teacher"), getAllAttendance);
router.get(
    "/student/:studentId",
    protect,
    authorize("admin", "teacher", "student"),
    getStudentAttendance
);

router.get(
    "/student/:studentId/percentage",
    protect,
    authorize("admin", "teacher", "student"),
    getAttendancePercentage
);
router.get("/:id", protect, authorize("admin", "teacher"), getAttendanceById);
router.put(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    updateAttendance
);

router.delete(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    deleteAttendance
);

module.exports = router;