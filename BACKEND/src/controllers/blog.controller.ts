//BLOG CONTROLLER
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from '../middlewares/verifyToken';


 
const prisma = new PrismaClient();


export const createBlog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, content, image, synopsis } = req.body;

  const userId = req.user?.id;

  if(!userId) {
    res.status(401).json({ message: "Login to create a blog!" });
    return;
  }

  try {
    console.log('Creating blog with image URL:', image);
    
    const newBlog = await prisma.blog.create({
      data:{
        title,
        content,
        image: image || '', 
        userId,
        synopsis,
        dateCreated: new Date(),
        lastUpdated: new Date(), 
      }
    });

    console.log('Created blog:', newBlog);
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
      where: { isDeleted: false }, // Only show non-deleted blogs
      include: {user: true},
      orderBy: {
        dateCreated: 'desc' // Latest created blogs to appear first
      }
    });


    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
}



export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const blog = await prisma.blog.findUnique({
      where: { 
        id: String(id),
        isDeleted: false 
      },
      include: { user: true }, 
    });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    console.log('Blog being returned:', {
      id: blog.id,
      title: blog.title,
      dateCreated: blog.dateCreated,
      lastUpdated: blog.lastUpdated
    });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};


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


export const updateBlog = async (req:AuthenticatedRequest , res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content, synopsis, image } = req.body;
  const userId = req.user?.id;

  try {

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog || blog.userId !== userId) {
      res.status(403).json({ message: 'Kindly log in to update this blog' });
      return;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: { 
        title, 
        content, 
        synopsis,
        image,
        lastUpdated: new Date() 
      },
    });

    console.log('Updated blog:', updatedBlog);
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
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

