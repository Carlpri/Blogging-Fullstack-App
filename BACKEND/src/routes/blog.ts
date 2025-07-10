//BLOG ROUTES
import { Router } from "express";
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } from "../controllers/blog.controller";
import { validate } from "../middlewares/validate";
import { blogSchema } from "../schemas/blog.schema";
import { verifyToken } from "../middlewares/verifyToken";
import{ getMyBlogs } from "../controllers/blog.controller";


const router: Router = Router();

router.post("/create", validate(blogSchema),verifyToken, createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.get("/me", verifyToken, getMyBlogs); 
router.patch("/:id", validate(blogSchema),verifyToken, updateBlog);
router.delete("/:id",verifyToken, deleteBlog);

export default router;