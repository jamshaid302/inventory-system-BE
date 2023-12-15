import { Request, Response } from "express";
import prisma from "../../../prisma";
import { Buyers } from "@prisma/client";
import { paginateData } from "../../utils/helper";

class BuyerController {
  createBuyer = async (req: Request, res: Response) => {
    try {
      const { fullName, city, buyingDate }: Buyers = req?.body;

      const buyer = await prisma.buyers.create({
        data: {
          fullName,
          city,
          buyingDate,
        },
      });

      res.status(201).json({ message: "Buyer Add Successfully", buyer });
    } catch (error) {
      console.error("Error creating Buyer:", error);
      res.status(500).json({ message: "Failed to save Buyer" });
    }
  };

  getAllBuyers = async (req: Request, res: Response) => {
    try {
      let buyers: Buyers[] = [];
      let count = 0;
      const { search, start = 0, limit = 10 } = req?.query;
      const skip = Number(start);
      const take = Number(limit);

      buyers = await prisma.buyers.findMany({
        where: {
          fullName: {
            contains: search as string,
          },
        },
        orderBy: [{ buyingDate: "desc" }],
      });

      count = buyers?.length;
      const paginatedDate = paginateData(buyers, take, skip);

      res.status(200).json({ count, buyers: paginatedDate });
    } catch (error) {
      console.error("Error getting buyers:", error);
      res.status(500).json({ message: "Failed to fetch buyers" });
    }
  };

  getBuyerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const buyer: Buyers | null = await prisma.buyers.findUnique({
        where: { id: Number(id) },
      });

      if (!buyer) {
        return res.status(404).json({ message: "Buyer not found" });
      }

      res.status(200).json({ message: "Success", buyer });
    } catch (error) {
      console.error("Error getting buyer:", error);
      res.status(500).json({ message: "Failed to fetch buyer" });
    }
  };

  updateBuyer = async (req: Request, res: Response) => {
    try {
      const { fullName, city, buyingDate, payment }: Buyers = req?.body;
      const data = {
        fullName,
        city,
        buyingDate,
        payment,
      };
      const buyer: Buyers | null = await prisma.buyers.update({
        where: { id: Number(req?.params?.id) },
        data,
      });

      res.status(200).json({ message: "Buyer updated Successfully", buyer });
    } catch (error) {
      console.error("Error updating buyer:", error);
      res.status(500).json({ message: "Failed to update buyer" });
    }
  };

  deleteBuyer = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deletedBuyer: Buyers | null = await prisma.buyers.delete({
        where: { id: Number(id) },
      });

      res
        .status(200)
        .json({ message: "Buyer deleted Successfully", deletedBuyer });
    } catch (error) {
      console.error("Error deleting buyer:", error);
      res.status(500).json({ message: "Failed to delete buyer" });
    }
  };
}

export default BuyerController;
