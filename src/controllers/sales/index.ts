import { Request, Response } from "express";
import prisma from "../../../prisma";
import { Sales, SalesItem } from "@prisma/client";

class SalesController {
  createSales = async (req: Request, res: Response) => {
    try {
      const { data } = req?.body;

      const { invoiceTotal }: Sales = req?.body;
      const invoice = await prisma.sales.create({
        data: {
          invoiceTotal,
        },
      });

      if (invoice) {
        const saleItems: SalesItem = data?.map((item: any) => {
          return {
            itemTotal: item?.totalItemPrice,
            discount: item?.discount,
            quantity: item?.quantity,
            saleId: invoice?.id,
            productId: item?.id,
          };
        });

        await prisma.salesItem.createMany({
          data: saleItems,
        });
      }

      res
        .status(201)
        .json({ message: "Invoice generated Successfully", invoice });
    } catch (error) {
      console.error("Error creating Invoice:", error);
      res.status(500).json({ message: "Failed to create Invoice" });
    }
  };
}

export default SalesController;
