import { Router, type Request, type Response } from "express";
import { students,courses } from "../db/db.js";
import { zCourseDeleteBody, zCoursePutBody ,zCoursePostBody} from "../schemas/courseValidator.js";
const router: Router = Router();


// READ all
router.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Get all courses",
    data: courses.map((c) => ({
      courseId: c.courseId,
      courseTitle: c.courseTitle,
      instructors: c.instructors
    }))
  });
});

// Params URL 
router.get("/:courseId", (req: Request, res: Response) => {
  const courseId = Number(req.params.courseId);

  // ตรวจสอบ input
  if (isNaN(courseId)) {
    return res.status(400).json({
      message: "Validation failed",
      errors: "Invalid input: expected number, received NaN",
    });
  }

  // หา course จร้า
  const course = courses.find((c) => c.courseId === courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course does not exists",
    });
  }

  // ส่งข้อมูล course ให้เรา
  return res.json({
    success: true,
    message: `Get course ${courseId} successfully`,
    data: course,
  });
});

//เพิ่มข้อมูลวิชาเรียน
router.post("/", (req: Request, res: Response) => {
  
  const parseResult = zCoursePostBody.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.issues.map((e) => e.message).join(", "),
    });
  }

  const { courseId, courseTitle, instructors } = parseResult.data;

  // ดูว่ามีอยู่แล้วไหม
  const exists = courses.find((c) => c.courseId === courseId);
  if (exists) {
    return res.status(409).json({
      success: false,
      message: "Course Id already exists",
    });
  }

  // สร้างใหม่
  const newCourse = { courseId, courseTitle, instructors };
  courses.push(newCourse);

  return res.status(201).json({
    success: true,
    message: `Course ${courseId} has been added successfully`,
    data: newCourse,
  });
});


router.put("/", (req, res) => {
  // ตรวจสอบ Body ด้วย Zod
  const parseResult = zCoursePutBody.safeParse(req.body);

  if (!parseResult.success) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: parseResult.error.issues.map(e => e.message).join(", ")
  });
}

  const { courseId, courseTitle, instructors } = parseResult.data;

  // หา index ของ course
  const courseIndex = courses.findIndex(course => course.courseId === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Course Id does not exists"
    });
  }

  // อัพเดตข้อมูลถ้ามี
  (courses[courseIndex] as any).courseTitle = courseTitle;
(courses[courseIndex] as any).instructors = instructors;


  return res.json({
    success: true,
    message: `course ${courseId} has been updated successfully`,
    data: courses[courseIndex]
  });
});

router.delete("/", (req, res) => {
  // ตรวจสอบ Body ด้วย Zod
  const parseResult = zCourseDeleteBody.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: parseResult.error.issues.map(e => e.message).join(", ")
    });
  }

  const { courseId } = parseResult.data;

  // หา index ของ course
  const courseIndex = courses.findIndex(course => course.courseId === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Course Id does not exists"
    });
  }

  // เก็บข้อมูลก่อนลบ เพื่อส่งกลับใน response
  const deletedCourse = courses[courseIndex];

  // ลบ course ออกจาก array
  courses.splice(courseIndex, 1);

  return res.status(200).json({
    success: true,
    message: `Course ${courseId} has been deleted successfully`,
    data: deletedCourse
  });
});
export default router;
