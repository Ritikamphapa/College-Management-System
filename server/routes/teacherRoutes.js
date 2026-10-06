const express = require("express");
const router = express.Router();

const {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    getTeacherProfile,
    updateTeacherProfile,
    deleteTeacher
} = require("../controllers/teacherController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// Teacher's own profile (must stay ABOVE "/:id")
router.get("/profile", protect, authorize("teacher"), getTeacherProfile);
router.put("/profile", protect, authorize("teacher"), updateTeacherProfile);

router.get("/", protect, authorize("admin"), getAllTeachers);
router.get("/:id", protect, authorize("admin"), getTeacherById);
router.post(
    "/",
    protect,
    authorize("admin"),
    createTeacher
);
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateTeacher
);
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteTeacher
);


module.exports = router;
