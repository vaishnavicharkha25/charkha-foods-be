import { Router } from 'express';
import { SettingController } from '../controllers/settingController';

const router = Router();

// GST Setting: GET and PUT
router.get('/settings/gst', SettingController.getGstSetting);
router.put('/settings/gst', SettingController.updateGstSetting);
router.post('/settings/gst', SettingController.updateGstSetting);

// All settings
router.get('/settings', SettingController.getAllSettings);

export default router;
