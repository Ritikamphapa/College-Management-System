const express = require("express");
const router = express.Router();

const {
    createTeacher,
    getAllTeachers,
    getTeacherById
} = require("../controllers/teacherController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");
console.log("createTeacher:", typeof createTeacher);
console.log("getAllTeachers:", typeof getAllTeachers);
console.log("getTeacherById:", typeof getTeacherById);
console.log("protect:", typeof protect);
console.log("authorize:", typeof authorize);
router.get("/", protect, authorize("admin"), getAllTeachers);
router.get("/:id", protect, authorize("admin"), getTeacherById);
router.post(
    "/",
    protect,
    authorize("admin"),
    createTeacher
);


module.exports = router;