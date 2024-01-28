import { Request, Response } from "express";
import prisma from "../../../prisma";
import { Sales, SalesItem } from "@prisma/client";
import {
  calculateMonthlySalesTotal,
  calculateTotal,
  filterSalesByDay,
  paginateData,
} from "../../utils/helper";

class SalesController {
  createSales = async (req: Request, res: Response) => {
    try {
      const { data } = req?.body || {};
      const { invoiceTotal }: Sales = req?.body || {};

      const invoice = await prisma.sales.create({
        data: {
          invoiceTotal,
          invoiceNumber: `INV${Math.floor(Math.random() * 100000)}`,
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

        // update the stock
        const updateProductPromises = data?.map(async (item: any) => {
          await prisma.products.update({
            where: {
              id: item?.id,
            },
            data: {
              quantity: {
                decrement: item?.quantity,
              },
            },
          });
        });

        await Promise.all(updateProductPromises);
      }

      res
        .status(201)
        .json({ message: "Invoice generated Successfully", invoice });
    } catch (error) {
      console.error("Error creating Invoice:", error);
      res.status(500).json({ message: "Failed to create Invoice" });
    }
  };

  updateSales = async (req: Request, res: Response) => {
    try {
      const { data } = req?.body || {};

      // update the stock
      const updateProductPromises = data?.map(async (item: any) => {
        await prisma.products.update({
          where: {
            id: item?.id,
          },
          data: {
            quantity: {
              increment: item?.quantity,
            },
          },
        });
      });

      await Promise.all(updateProductPromises);

      res.status(201).json({ message: "Items Return Successfully" });
    } catch (error) {
      console.error("Error creating Invoice:", error);
      res.status(500).json({ message: "Failed to create Invoice" });
    }
  };

  getAllInvoices = async (req: Request, res: Response) => {
    try {
      let invoices: any = [];
      let count = 0;
      const { search, start = 0, limit = 10 } = req?.query || {};
      const skip = Number(start);
      const take = Number(limit);

      invoices = await prisma.sales.findMany({
        where: {
          invoiceNumber: {
            contains: search as string,
          },
        },
        orderBy: {
          date: "desc",
        },
        include: {
          salesItem: {
            include: {
              product: true,
            },
          },
        },
      });

      count = invoices?.length;
      const paginatedDate = paginateData(invoices, take, skip);

      res.status(200).json({ count, invoices: paginatedDate });
    } catch (error) {
      console.error("Error fectching Invoices:", error);
      res.status(500).json({ message: "Failed to fetch Invoices" });
    }
  };

  getTotalSale = async (req: Request, res: Response) => {
    try {
      const currentDay = new Date();
      const currentYear = currentDay.getFullYear();

      const sales = await prisma.sales.findMany({
        orderBy: [{ date: "asc" }],
        select: {
          invoiceTotal: true,
          date: true,
        },
      });

      const salesTotal = calculateTotal(sales);
      const currentDaysales = filterSalesByDay(sales, currentDay);
      const currentYearSales = sales?.filter(
        (item) => new Date(item?.date).getFullYear() == currentYear,
      );

      const currentDaySalesTotal = calculateTotal(currentDaysales);
      const eachMonthSalesTotal = calculateMonthlySalesTotal(currentYearSales);

      res.status(200).json({
        salesTotal,
        currentDaySalesTotal,
        eachMonthSalesTotal,
      });
    } catch (error) {
      console.error("Error fectching Total Sales data:", error);
      res.status(500).json({ message: "Failed to fetch Total Sales data" });
    }
  };
}

export default SalesController;
