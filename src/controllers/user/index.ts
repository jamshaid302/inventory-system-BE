import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import prisma from "../../../prisma";
import { User } from "@prisma/client";
import { hashing, matchingPass } from "../../utils/helper";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../../utils/response";
import { CustomError } from "../../utils/error";

class UserController {
  createUser = async (req: Request, res: Response) => {
    try {
      const userData: User = req?.body;

      const existingUser = await prisma.user.findUnique({
        where: {
          email: userData?.email,
        },
      });

      if (existingUser) throw new CustomError("User already exists", 409);

      const passwordHash = await hashing(req?.body?.password);
      userData["password"] = passwordHash;

      const newUser = await prisma.user.create({
        data: userData,
      });

      return res
        ?.status(201)
        .send(successResponse({ newUser }, "User created successfully"));
    } catch (error: any) {
      const { statusCode, message } = error || {};
      return res
        .status(statusCode || 500)
        .send(errorResponse(message || "Error creating user."));
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password }: User = req?.body || undefined;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) throw new CustomError("User does not exist", 401);

      const isMatch = await matchingPass(password, user?.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            id: user?.id,
            name: user?.name,
          },
          process.env?.JWT_SECRET as string,
        );

        return res
          .status(200)
          .send(successResponse({ token }, "Login successful"));
      } else {
        throw new CustomError("Incorrect password", 401);
      }
    } catch (error: any) {
      const { statusCode, message } = error || {};
      return res
        .status(statusCode || 500)
        .send(errorResponse(message || "Error logging in user."));
    }
  };
}

export default UserController;
