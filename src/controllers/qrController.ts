import { Request, Response } from 'express';
import { QrSource } from '../database/models';

export class QrController {
  /**
   * Get all QR sources (Protected: qr:manage)
   */
  public static async getQrSources(req: Request, res: Response) {
    try {
      const qrSources = await QrSource.findAll({ order: [['createdAt', 'DESC']] });
      return res.status(200).json({ success: true, data: qrSources });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Create a new QR code source origin (Protected: qr:manage)
   */
  public static async createQrSource(req: Request, res: Response) {
    try {
      const { id, label, type } = req.body;

      if (!id || !label || !type) {
        return res.status(400).json({ success: false, message: 'QR ID, label, and type are required.' });
      }

      const qrSource = await QrSource.create({
        id,
        label,
        type,
        scansCount: 0,
        ordersCount: 0,
      });

      return res.status(201).json({ success: true, message: 'QR code source created', data: qrSource });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Record scan count when customer scans a QR code (Public)
   */
  public static async recordScan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const qrSource = await QrSource.findByPk(id);

      if (!qrSource) {
        return res.status(404).json({ success: false, message: 'QR source not found.' });
      }

      await qrSource.increment('scansCount');

      return res.status(200).json({ success: true, message: 'Scan recorded successfully.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
