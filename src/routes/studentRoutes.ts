
import { Router, type Request, type Response } from "express";
import { students,courses } from "../db/db.js";
const router = Router();

router.get("/students/:studentId/courses", (req, res) => {
  const { studentId } = req.params;


  if (studentId.length !== 9) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      detail: "Student Id must contain 9 characters"
    });
  }


  const student = students.find((s) => s.studentId === studentId);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: "student does not exist"
    });
  }

  const enrolledCourses = (student.courses ?? []).map((cid) => {
    const course = courses.find((c) => c.courseId === cid);
    return course
      ? { courseId: course.courseId, courseTitle: course.courseTitle }
      : null;
  }).filter(Boolean);

  return res.json({
    success: true,
    message: `Get courses detail of student ${studentId}`,
    data: {
      studentId: student.studentId,
      courses: enrolledCourses
    }
  });
});

export default router;
