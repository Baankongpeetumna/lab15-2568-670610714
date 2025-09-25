import express from "express";
import morgan from 'morgan';
import { Router, type Request, type Response } from "express";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

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

export default app;
