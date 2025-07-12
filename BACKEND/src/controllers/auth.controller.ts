import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";


const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { 
    firstName, 
    lastName, 
    emailAddress, 
    username, 
    password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { emailAddress },
    });

    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (username && username !== existingUser.username) {
      const taken = await prisma.user.findUnique({ where: { username } });
      if (taken) {
        res.status(409).json({ message: "Username already being used" });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: username || existingUser.username,
        password: password
          ? await bcrypt.hash(password, 10)
          : existingUser.password,
      },
    });
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (e) {
    res.status(500).json({ message: "Updating user failed" });
  }
};

export const changePassword = async (
  req: Request, res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id; // From verifyToken middleware
    
    console.log('Change password request:', { userId, hasCurrentPassword: !!currentPassword, hasNewPassword: !!newPassword });

    if (!userId) {
      res.status(401).json({ message: "User ID not found in token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Users must first Verify their current password
    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    //To  Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (e) {
    res.status(500).json({ message: "Failed to change password" });
  }
};

export const login = async (
  req: Request, res: Response
): Promise<void> => {
  try{
    const { identifier, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR:[
          { username: identifier },
          { emailAddress: identifier }
        ]
      }
    });
    if (!user) {
      res.status(404).json({ message: "Wrong login details" });
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Oops!! Wrong login details" });
      return;
    }

    
    const token = jwt.sign(
      { 
        userId: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        username: user.username 
      },
      process.env.JWT_SECRET!);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      }).json({
        message: "Login successful",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddress,
          username: user.username,
        },
        token: token,
      });
  
  }catch(e) {
    res.status(500).json({ message: "Oopss☹️! Login failed" });
  }
}

