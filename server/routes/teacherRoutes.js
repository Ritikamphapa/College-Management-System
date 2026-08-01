const express = require("express");
const router = express.Router();

const {
    createTeacher,
    getAllTeachers
} = require("../controllers/teacherController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin"), getAllTeachers);
router.post(
    "/",
    protect,
    authorize("admin"),
    createTeacher
);


module.exports = router;