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
console.log("createTeacher:", typeof createTeacher);
console.log("getAllTeachers:", typeof getAllTeachers);
console.log("getTeacherById:", typeof getTeacherById);
console.log("updateTeacher:", typeof updateTeacher);
console.log("protect:", typeof protect);
console.log("authorize:", typeof authorize);
console.log("deleteTeacher:", typeof deleteTeacher);
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