import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, StaffProfile, Role, Permission } from '../database/models';

export interface AuthenticatedUser {
  id: string;
  phone: string;
  fullName: string;
  userType: 'customer' | 'staff';
  roleName?: string;
  permissions?: string[]; // Array of permission codes (e.g., ['orders:read', 'menu:manage'])
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'charkha-foods-secret';

/**
 * Middleware to authenticate requests via JWT Token
 */
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: StaffProfile,
          as: 'staffProfile',
          include: [
            {
              model: Role,
              as: 'roleDetail',
              include: [
                {
                  model: Permission,
                  as: 'permissions',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User account is inactive or not found.' });
    }

    const staffProfile = user.staffProfile;
    const roleDetail = staffProfile?.roleDetail;
    const permissionCodes = roleDetail?.permissions?.map((p: Permission) => p.code) || [];

    req.user = {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      userType: user.userType as 'customer' | 'staff',
      roleName: roleDetail?.name || staffProfile?.role,
      permissions: permissionCodes,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

/**
 * Middleware to enforce required permission code(s) (RBAC Guard)
 * @param requiredPermissions Array of permission codes required (e.g. 'staff:manage', 'orders:read')
 */
export const authorizePermission = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Owner role automatically bypasses all individual permission checks
    if (req.user.roleName === 'Owner') {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      return res.status(403).json({
        message: `Access denied. Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`,
      });
    }

    next();
  };
};
