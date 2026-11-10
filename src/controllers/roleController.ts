import { Request, Response } from 'express';
import { Role, Permission, RolePermission } from '../database/models';

/**
 * Controller for managing Roles & Permissions (Role Access Module)
 */
export class RoleController {
  /**
   * Get all roles with their assigned permissions
   */
  public static async getRoles(req: Request, res: Response) {
    try {
      const roles = await Role.findAll({
        include: [
          {
            model: Permission,
            as: 'permissions',
            attributes: ['id', 'module', 'action', 'code', 'description'],
            through: { attributes: [] },
          },
        ],
      });

      return res.status(200).json({
        success: true,
        data: roles,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get all permissions available in the system grouped by module
   */
  public static async getPermissions(req: Request, res: Response) {
    try {
      const permissions = await Permission.findAll({
        order: [['module', 'ASC'], ['code', 'ASC']],
      });

      return res.status(200).json({
        success: true,
        data: permissions,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Create a custom role with permissions
   */
  public static async createRole(req: Request, res: Response) {
    try {
      const { id, name, description, permissionIds } = req.body;

      if (!id || !name) {
        return res.status(400).json({ success: false, message: 'Role ID and Name are required.' });
      }

      const role = await Role.create({
        id,
        name,
        description,
        isSystemRole: false,
      });

      if (Array.isArray(permissionIds) && permissionIds.length > 0) {
        const mappings = permissionIds.map((pId: string) => ({
          roleId: role.id,
          permissionId: pId,
        }));
        await RolePermission.bulkCreate(mappings);
      }

      const updatedRole = await Role.findByPk(role.id, {
        include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }],
      });

      return res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: updatedRole,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Update role permissions
   */
  public static async updateRolePermissions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { permissionIds, description } = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found.' });
      }

      if (description !== undefined) {
        role.description = description;
        await role.save();
      }

      if (Array.isArray(permissionIds)) {
        // Sync role permissions
        await RolePermission.destroy({ where: { roleId: id } });
        const mappings = permissionIds.map((pId: string) => ({
          roleId: id,
          permissionId: pId,
        }));
        await RolePermission.bulkCreate(mappings);
      }

      const updatedRole = await Role.findByPk(id, {
        include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }],
      });

      return res.status(200).json({
        success: true,
        message: 'Role permissions updated successfully',
        data: updatedRole,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
