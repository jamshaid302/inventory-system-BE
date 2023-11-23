import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import prisma from "../../../prisma";
import { User } from "@prisma/client";
import { hashing, matchingPass } from "../../utils/helper";
import jwt from "jsonwebtoken";

class UserController {
  createUser = async (req: Request, res: Response) => {
    try {
      const userData: User = req?.body;
      const passwordHash = await hashing(req?.body?.password);
      userData["password"] = passwordHash;

      const newUser = await prisma.user.create({
        data: userData,
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating User:", error);
      res.status(500).json({ message: "Failed to save User" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password }: User = req?.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return res.status(404).json({ message: "User not Found" });

      const isMatch = await matchingPass(password, user?.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            id: user?.id,
            name: user?.name,
          },
          process.env?.JWT_SECRET as string
        );

        res.status(200).json({
          message: "Login successful",
          token,
        });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } catch (error) {
      console.error("Error Login:", error);
      res.status(500).json({ message: "Failed to Login" });
    }
  };
}

export default UserController;
