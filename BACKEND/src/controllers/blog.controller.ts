//BLOG CONTROLLER
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../middlewares/verifyToken';


 
const prisma = new PrismaClient();


// Creating a new blog
export const createBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, content,image,synopsis } = req.body;
  console.log ("DEBUG - req.user:", req.user);
  const userId =req.user?.id;

  if(!userId) {
    res.status(401).json({ message: "Login to create a blog!" });
    return;
  }

  try {
    const newBlog = await prisma.blog.create({
      data:{
        title,
        content,
        image,
        userId,
        synopsis,
        dateCreated: new Date(),
        lastUpdated: new Date(), 
      }
    });

    res.status(201).json(newBlog);
  } catch (error) {
    console.error("CREATE BLOG ERROR",error);
    res.status(500).json({ message: "Error creating blog", error });
  }
  console.log ("USER:",req.user);
};

export const getBlogs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {user: true}, 
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
}



// Fetching a blog by ID
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: String(id) },
      include: { user: true }, 
    });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};


// Fetching my blogs (User can only see their own blogs)
export const getMyBlogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized ' });
    return;
  }

  try {
    const blogs = await prisma.blog.findMany({
      where: { userId, isDeleted: false },
      include: { user: true },
      orderBy: { dateCreated: 'desc' },
    });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load your blogs', error });
  }
};


// Updating my blog   (User can update only their own blogs)

export const updateBlog = async (req:AuthenticatedRequest , res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user?.id;

  try {

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog || blog.userId !== userId) {
      res.status(403).json({ message: 'Kindly log in to update tis blog' });
      return;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: { title, content, lastUpdated: new Date() },
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error updating the blog", error });
  }
};

export const deleteBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog || blog.userId !== userId) {
      res.status(403).json({ message: 'Kindly log in to delete this blog' });
      return;
    }

    await prisma.blog.delete({
      where: { id: String(id) },
    });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

