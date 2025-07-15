//BLOG ROUTES
import { Router } from "express";
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } from "../controllers/blog.controller";
import { validate } from "../middlewares/validate";
import { blogSchema } from "../schemas/blog.schema";
import { verifyToken } from "../middlewares/verifyToken";
import{ getMyBlogs } from "../controllers/blog.controller";
import multer from 'multer';
import path from 'path';

  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'uploads/');
  //   },
  //   filename: (req, file, cb) => {
  //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  //   }
  // });

  // const upload = multer({ storage: storage });


const router: Router = Router();

router.post(  "/blogs/new",
  verifyToken,
  validate(blogSchema),
  createBlog
);
router.get("/", getBlogs);
router.get("/me", verifyToken, getMyBlogs); 
router.get("/:id", getBlogById);
router.patch(
  "/:id",
  verifyToken,
  validate(blogSchema),
  updateBlog
);
router.delete("/:id",verifyToken, deleteBlog);


export default router;