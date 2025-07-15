import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();


router.get("/", async (req, res) => {
  try {
    
    await prisma.$queryRaw`SELECT 1`;
    
   
    const userCount = await prisma.user.count();
    const blogCount = await prisma.blog.count();
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      stats: {
        users: userCount,
        blogs: blogCount
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});


router.get("/db-test", async (req, res) => {
  try {
   
    const testUser = await prisma.user.findFirst({
      select: { id: true, firstName: true, lastName: true, emailAddress: true }
    });
    
    const testBlog = await prisma.blog.findFirst({
      include: { user: { select: { firstName: true, lastName: true } } }
    });
    
    res.status(200).json({
      message: "Database operations successful",
      userTest: testUser ? "User table accessible" : "No users found",
      blogTest: testBlog ? "Blog table accessible" : "No blogs found",
      sampleData: {
        user: testUser ? {
          id: testUser.id,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          emailAddress: testUser.emailAddress
        } : null,
        blog: testBlog ? {
          id: testBlog.id,
          title: testBlog.title,
          userId: testBlog.userId,
          user: testBlog.user
        } : null
      }
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      message: "Database test failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});


router.get("/connection-test", async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({
      message: "Database connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Connection test failed:", error);
    res.status(500).json({
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router; 