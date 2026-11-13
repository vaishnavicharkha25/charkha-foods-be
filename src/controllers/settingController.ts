import { Request, Response } from 'express';
import { AppSetting } from '../database/models';

export class SettingController {
  /**
   * GET /api/v1/settings/gst
   * Returns current GST enabled status and rate directly from DB
   */
  public static async getGstSetting(req: Request, res: Response) {
    try {
      const isEnabled = await AppSetting.isGstEnabled();
      const rateStr = await AppSetting.getSetting('gst_rate', '5');
      const rate = Number(rateStr) || 5;

      return res.status(200).json({
        success: true,
        data: {
          gstEnabled: isEnabled,
          gstRate: rate,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch GST setting.',
      });
    }
  }

  /**
   * PUT /api/v1/settings/gst
   * Updates GST enabled flag directly in DB
   */
  public static async updateGstSetting(req: Request, res: Response) {
    try {
      const { gstEnabled, gstRate } = req.body;

      if (gstEnabled !== undefined) {
        const flagVal = (gstEnabled === true || gstEnabled === 'true' || gstEnabled === 1 || gstEnabled === '1') ? 'true' : 'false';
        await AppSetting.setSetting(
          'gst_enabled',
          flagVal,
          'Enable or disable 5% GST across orders and billing (true / false)'
        );
      }

      if (gstRate !== undefined) {
        const rateNum = Number(gstRate);
        if (!isNaN(rateNum) && rateNum >= 0) {
          await AppSetting.setSetting(
            'gst_rate',
            String(rateNum),
            'Default GST percentage rate'
          );
        }
      }

      const updatedEnabled = await AppSetting.isGstEnabled();
      const updatedRate = Number(await AppSetting.getSetting('gst_rate', '5')) || 5;

      return res.status(200).json({
        success: true,
        message: `GST mode successfully updated in database to ${updatedEnabled ? '5%' : '0% (Disabled)'}.`,
        data: {
          gstEnabled: updatedEnabled,
          gstRate: updatedRate,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update GST setting in database.',
      });
    }
  }

  /**
   * GET /api/v1/settings
   * Returns all system settings
   */
  public static async getAllSettings(req: Request, res: Response) {
    try {
      const settings = await AppSetting.findAll();
      const result: Record<string, string> = {};
      for (const s of settings) {
        result[s.key] = s.value;
      }
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch settings.',
      });
    }
  }
}
