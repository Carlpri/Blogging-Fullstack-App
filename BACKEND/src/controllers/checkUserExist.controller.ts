import { Express, NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function checkUserExist(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { username, emailAddress } = req.body;
  const userWithUsername = await client.user.findFirst({ where: { username } });
  if (userWithUsername) {
    res.status(400).json({ message: "Sorry! Your username already in use" });
    return;
  }
  const userWithEmail = await client.user.findFirst({
    where: { emailAddress },
  });
  if (userWithEmail) {
    res.status(400).json({ message: "Sorry! Your email is already in use" });
    return;
  }
  next();
}

export default checkUserExist;
