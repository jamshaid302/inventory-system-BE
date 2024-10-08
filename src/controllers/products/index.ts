import { Request, Response } from "express";
import prisma from "../../../prisma";
import { Buyers, Products } from "@prisma/client";
import { paginateData } from "../../utils/helper";
import { successResponse } from "../../utils/response";

class ProductsController {
  createProduct = async (req: Request, res: Response) => {
    try {
      const {
        itemName,
        buyingPrice,
        sellingPrice,
        company,
        quantity,
        unit,
        buyerId,
        buyingDate,
      }: Products = req?.body || {};

      const product = await prisma.products.create({
        data: {
          itemName,
          buyingPrice,
          company,
          sellingPrice,
          quantity,
          unit,
          buyerId,
          buyingDate,
        },
      });

      if (product) {
        await prisma.purchase.create({
          data: {
            item: product?.itemName,
            perUnitPrice: product?.buyingPrice,
            quantity: product?.quantity,
            buyerId: product?.buyerId,
            purchasingDate: product?.buyingDate,
            totalAmount: product?.quantity * product?.buyingPrice,
          },
        });

        await prisma.buyers.update({
          where: { id: Number(product?.buyerId) },
          data: {
            buyingDate: product?.buyingDate,
            payment: {
              increment: product?.quantity * product?.buyingPrice,
            },
          },
        });
      }

      res.status(201).json({ message: "Product Add Successfully", product });
    } catch (error) {
      console.error("Error creating Product:", error);
      res.status(500).json({ message: "Failed to save Product" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const products = await prisma.products.findMany({});
      res.status(200).json({ products });
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  };

  getAllProducts = async (req: Request, res: Response) => {
    try {
      let products: Products[] = [];
      let count = 0;
      const { search, start = 0, limit = 10 } = req?.query || undefined;
      const skip = Number(start);
      const take = Number(limit);

      products = await prisma.products.findMany({
        where: {
          OR: [
            {
              itemName: {
                contains: search as string,
              },
            },
            {
              company: {
                contains: search as string,
              },
            },
          ],
        },
        orderBy: [{ quantity: "asc" }],
        include: {
          buyer: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      });

      count = products?.length;
      const paginatedData = paginateData(products, take, skip);

      return res
        .status(200)
        .send(successResponse({ count, products: paginatedData }));
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  };

  getAllBuyers = async (req: Request, res: Response) => {
    try {
      let buyers: Buyers[] = [];

      buyers = await prisma.buyers.findMany({
        orderBy: [{ id: "desc" }],
      });

      return res.status(200).send(successResponse({ buyers }));
    } catch (error) {
      console.error("Error getting buyers:", error);
      res.status(500).json({ message: "Failed to fetch buyers" });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const {
        itemName,
        buyingPrice,
        sellingPrice,
        company,
        quantity,
        unit,
        buyerId,
        buyingDate,
      }: Products = req?.body || {};

      const prevProduct: Products | null = await prisma.products.findFirst({
        where: {
          id: Number(req?.params?.id),
        },
      });

      const product: Products | null = await prisma.products.update({
        where: { id: Number(req?.params?.id) },
        data: {
          itemName,
          buyingPrice,
          sellingPrice,
          company,
          quantity,
          unit,
          buyerId,
          buyingDate,
        },
      });

      if (prevProduct && product) {
        await prisma.purchase.create({
          data: {
            item: itemName,
            perUnitPrice: buyingPrice,
            quantity: product?.quantity - prevProduct?.quantity,
            buyerId: buyerId,
            totalAmount:
              (product?.quantity - prevProduct?.quantity) * buyingPrice,
          },
        });

        //update the buyer
        await prisma.buyers.update({
          where: { id: Number(product?.buyerId) },
          data: {
            buyingDate: product?.buyingDate,
            payment: {
              increment:
                (product?.quantity - prevProduct?.quantity) * buyingPrice,
            },
          },
        });
      }

      res
        .status(200)
        .json({ message: "Product updated Successfully", product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deletedProduct: Products | null = await prisma.products.delete({
        where: { id: Number(id) },
      });

      res
        .status(200)
        .json({ message: "Product deleted Successfully", deletedProduct });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  };
}

export default ProductsController;
