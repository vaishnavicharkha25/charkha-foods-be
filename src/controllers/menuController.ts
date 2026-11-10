import { Request, Response } from 'express';
import { Category, Product, AddOn, ProductAddOn } from '../database/models';
import { Op } from 'sequelize';

export class MenuController {
  /**
   * Get all categories
   */
  public static async getCategories(req: Request, res: Response) {
    try {
      const categories = await Category.findAll({
        where: { isActive: true },
        order: [['displayOrder', 'ASC']],
      });
      return res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get products with optional category, search, and add-ons
   */
  public static async getProducts(req: Request, res: Response) {
    try {
      const { categoryId, search, availableOnly } = req.query;

      const whereClause: any = {};
      if (categoryId) {
        whereClause.categoryId = categoryId;
      }
      if (availableOnly === 'true') {
        whereClause.isAvailable = true;
      }
      if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
      }

      const products = await Product.findAll({
        where: whereClause,
        include: [
          {
            model: AddOn,
            as: 'addOns',
            through: { attributes: [] },
          },
          {
            model: Category,
            as: 'category',
          },
        ],
        order: [['name', 'ASC']],
      });

      return res.status(200).json({ success: true, data: products });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get single product details
   */
  public static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [
          { model: AddOn, as: 'addOns', through: { attributes: [] } },
          { model: Category, as: 'category' },
        ],
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      return res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Create a new product (Protected: menu:manage)
   */
  public static async createProduct(req: Request, res: Response) {
    try {
      const { id, categoryId, name, price, description, bestseller, offerTag, serves, addOnIds } = req.body;

      if (!id || !categoryId || !name || price === undefined) {
        return res.status(400).json({ success: false, message: 'Product ID, categoryId, name, and price are required.' });
      }

      const product = await Product.create({
        id,
        categoryId,
        name,
        price,
        description,
        bestseller: bestseller || false,
        offerTag,
        serves,
        isAvailable: true,
      });

      if (Array.isArray(addOnIds) && addOnIds.length > 0) {
        const mappings = addOnIds.map((aId: string) => ({
          productId: product.id,
          addOnId: aId,
        }));
        await ProductAddOn.bulkCreate(mappings);
      }

      const createdProduct = await Product.findByPk(product.id, {
        include: [{ model: AddOn, as: 'addOns', through: { attributes: [] } }],
      });

      return res.status(201).json({ success: true, message: 'Product created successfully', data: createdProduct });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Update product (Protected: menu:manage)
   */
  public static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, description, categoryId, bestseller, offerTag, serves, isAvailable, addOnIds } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      await product.update({
        ...(name && { name }),
        ...(price !== undefined && { price }),
        ...(description !== undefined && { description }),
        ...(categoryId && { categoryId }),
        ...(bestseller !== undefined && { bestseller }),
        ...(offerTag !== undefined && { offerTag }),
        ...(serves !== undefined && { serves }),
        ...(isAvailable !== undefined && { isAvailable }),
      });

      if (Array.isArray(addOnIds)) {
        await ProductAddOn.destroy({ where: { productId: id } });
        const mappings = addOnIds.map((aId: string) => ({
          productId: id,
          addOnId: aId,
        }));
        await ProductAddOn.bulkCreate(mappings);
      }

      const updatedProduct = await Product.findByPk(id, {
        include: [{ model: AddOn, as: 'addOns', through: { attributes: [] } }],
      });

      return res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Toggle product stock availability (Protected: Kitchen / Staff)
   */
  public static async toggleAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isAvailable } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      product.isAvailable = isAvailable !== undefined ? isAvailable : !product.isAvailable;
      await product.save();

      return res.status(200).json({ success: true, message: 'Product availability updated', data: product });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Delete product (Protected: menu:manage)
   */
  public static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      await ProductAddOn.destroy({ where: { productId: id } });
      await product.destroy();

      return res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
