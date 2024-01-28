import { Request, Response } from "express";
import prisma from "../../../prisma";
import { Purchase } from "@prisma/client";
import { paginateData } from "../../utils/helper";

class PurchasesController {
  getAllPurchases = async (req: Request, res: Response) => {
    try {
      let purchases: Purchase[] = [];
      let count = 0;
      const { search, start = 0, limit = 10 } = req?.query || {};
      const skip = Number(start);
      const take = Number(limit);

      purchases = await prisma.purchase.findMany({
        where: {
          item: {
            contains: search as string,
          },
        },
        orderBy: [{ id: "desc" }],
        include: {
          buyer: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      });

      count = purchases?.length;
      const paginatedDate = paginateData(purchases, take, skip);

      res.status(200).json({ count, purchases: paginatedDate });
    } catch (error) {
      console.error("Error getting purchases:", error);
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  };

  getTotalPurchasesAmount = async (req: Request, res: Response) => {
    try {
      let stock = 0;
      const purchases = await prisma.purchase.findMany({
        select: {
          totalAmount: true,
        },
      });

      stock = await prisma.products.count();

      const totalPurchases = purchases?.reduce(
        (acc: any, current: any) => acc + current?.totalAmount,
        0,
      );

      res.status(200).json({ totalPurchases, itmeInStock: stock });
    } catch (error) {
      console.error("Error getting purchases:", error);
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  };
}

export default PurchasesController;
