import express from "express";
import morgan from 'morgan';
import { Router, type Request, type Response } from "express";
import studentRouter from "./routes/studentRoutes.js"
import courseRouter from "./routes/courseRoutes.js"

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use("/api/v2/students", studentRouter); // student router
app.use("/api/v2/courses", courseRouter);  // course router

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

app.get("/me", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Student Information",
    data: {
      studentId: "670610714",
      firstName: "Benyaporn",
      lastName: "Udomsilapasub",
      program: "CPE",
      section: "001",
    },
  });
});
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "lab 15 API service successfully",
  });
});

export default app;
