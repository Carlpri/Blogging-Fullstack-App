import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        firstName?: string;
        lastName?: string;
        emailAddress?: string;
        username?: string;
      };
    }
  }
}


const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { 
    firstName, 
    lastName, 
    emailAddress, 
    username, 
    password } = req.body;

  try {
    console.log('Registration attempt:', { firstName, lastName, emailAddress, username });
    
    const existingUser = await prisma.user.findUnique({
      where: { emailAddress },
    });

    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        username,
        password: hashedPassword,
      },
    });

    console.log('User created successfully:', { userId: newUser.id, emailAddress });
    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(500).json({ message: "Registration failed", error: e instanceof Error ? e.message : "Unknown error" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstName, lastName, emailAddress, username, password } = req.body;
  const userId = req.user?.id; 

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (emailAddress && emailAddress !== existingUser.emailAddress) {
      const emailTaken = await prisma.user.findUnique({ where: { emailAddress } });
      if (emailTaken) {
        res.status(409).json({ message: "Email address already in use" });
        return;
      }
    }

    if (username && username !== existingUser.username) {
      const usernameTaken = await prisma.user.findUnique({ where: { username } });
      if (usernameTaken) {
        res.status(409).json({ message: "Username already being used" });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || existingUser.firstName,
        lastName: lastName || existingUser.lastName,
        emailAddress: emailAddress || existingUser.emailAddress,
        username: username || existingUser.username,
        password: password
          ? await bcrypt.hash(password, 10)
          : existingUser.password,
      },
    });
    const newToken = jwt.sign(
      { 
        userId: updatedUser.id, 
        firstName: updatedUser.firstName, 
        lastName: updatedUser.lastName,
        emailAddress: updatedUser.emailAddress,
        username: updatedUser.username 
      },
      process.env.JWT_SECRET!
    );

    res.status(200).json({ 
      message: "User updated successfully", 
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailAddress: updatedUser.emailAddress,
        username: updatedUser.username,
      },
      token: newToken
    });
  } catch (e) {
    console.error('Error updating user:', e);
    res.status(500).json({ message: "Updating user failed" });
  }
};

export const changePassword = async (
  req: Request, res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id; 
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

    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

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
    console.log('Login attempt:', { identifier });
    
    const user = await prisma.user.findFirst({
      where: {
        OR:[
          { username: identifier },
          { emailAddress: identifier }
        ]
      }
    });
    
    if (!user) {
      console.log('User not found for identifier:', identifier);
      res.status(404).json({ message: "Wrong login details" });
      return;
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log('Incorrect password for user:', user.emailAddress);
      res.status(400).json({ message: "Oops!! Wrong login details" });
      return;
    }

    console.log('Login successful for user:', user.emailAddress);
    
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
    console.error('Login error:', e);
    res.status(500).json({ message: "Login failed", error: e instanceof Error ? e.message : "Unknown error" });
  }
}

