const Availability = require("../models/Availability");
const Teacher = require("../models/Teacher");

const isLive = (a) =>
    !!a && a.isPresent && (!a.expiresAt || a.expiresAt > new Date());

// ================= LIST ALL TEACHERS WITH STATUS (any logged-in user) =================
const getAvailability = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate("user", "name");
        const records = await Availability.find();
        const byTeacher = new Map(records.map((r) => [String(r.teacher), r]));

        const result = teachers.map((t) => {
            const a = byTeacher.get(String(t._id));
            const present = isLive(a);

            return {
                teacherId: t._id,
                name: t.user?.name || "Unknown",
                department: t.department,
                designation: t.designation,
                isPresent: present,
                note: present ? a.note : "",
                since: present ? a.updatedAt : null,
                expiresAt: present ? a.expiresAt : null,
                following: !!a && a.followers.some((f) => String(f) === String(req.user._id)),
            };
        });

        res.status(200).json({ count: result.length, teachers: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ================= TEACHER SETS OWN STATUS =================
const setMyAvailability = async (req, res) => {
    try {
        const { isPresent, note, hours } = req.body;

        const teacher = await Teacher.findOne({ user: req.user._id });

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const duration = Math.min(Math.max(Number(hours) || 4, 1), 12);

        const availability = await Availability.findOneAndUpdate(
            { teacher: teacher._id },
            {
                isPresent: !!isPresent,
                note: isPresent ? String(note || "").slice(0, 120) : "",
                expiresAt: isPresent ? new Date(Date.now() + duration * 3600000) : null,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            message: isPresent ? "Marked as present" : "Marked as away",
            availability,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ================= STUDENT ASKS TO BE ALERTED (toggle) =================
const toggleFollow = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.teacherId);

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const availability = await Availability.findOneAndUpdate(
            { teacher: teacher._id },
            { $setOnInsert: { teacher: teacher._id } },
            { upsert: true, new: true }
        );

        const idx = availability.followers.findIndex(
            (f) => String(f) === String(req.user._id)
        );

        if (idx === -1) availability.followers.push(req.user._id);
        else availability.followers.splice(idx, 1);

        await availability.save();

        res.status(200).json({ following: idx === -1 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getAvailability,
    setMyAvailability,
    toggleFollow,
};
