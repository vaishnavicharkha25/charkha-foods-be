import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

export = {
  up: async (queryInterface: QueryInterface) => {
    const now = new Date();
    const passwordHash = await bcrypt.hash('Password@123', 10);

    // 1. System Roles
    await queryInterface.bulkInsert('roles', [
      { id: 'role-owner', name: 'Owner', description: 'Full system access & staff administration', is_system_role: true, created_at: now, updated_at: now },
      { id: 'role-manager', name: 'Manager', description: 'Store operations & menu management', is_system_role: true, created_at: now, updated_at: now },
      { id: 'role-kitchen', name: 'Kitchen', description: 'Kitchen Order Display (KDS) & menu availability toggle', is_system_role: true, created_at: now, updated_at: now },
      { id: 'role-cashier', name: 'Cashier', description: 'Counter POS & customer order billing', is_system_role: true, created_at: now, updated_at: now },
      { id: 'role-marketing', name: 'Marketing', description: 'Promotions, loyalty program, & QR campaign management', is_system_role: true, created_at: now, updated_at: now },
    ]);

    // 2. Granular Permissions across modules
    const permissionsData = [
      // Dashboard
      { id: 'perm-dashboard-view', module: 'Dashboard', action: 'read', code: 'dashboard:view', description: 'View dashboard analytics & sales metrics' },
      // Orders
      { id: 'perm-orders-read', module: 'Orders', action: 'read', code: 'orders:read', description: 'View active & past orders' },
      { id: 'perm-orders-update', module: 'Orders', action: 'update', code: 'orders:update', description: 'Update order status (preparing, ready, completed)' },
      // Menu
      { id: 'perm-menu-read', module: 'Menu', action: 'read', code: 'menu:read', description: 'View menu items & categories' },
      { id: 'perm-menu-manage', module: 'Menu', action: 'manage', code: 'menu:manage', description: 'Create, edit, or delete menu products & add-ons' },
      // Offers
      { id: 'perm-offers-manage', module: 'Offers', action: 'manage', code: 'offers:manage', description: 'Manage coupons & promotional banners' },
      // Customers
      { id: 'perm-customers-read', module: 'Customers', action: 'read', code: 'customers:read', description: 'View customer directory & spend details' },
      // Loyalty
      { id: 'perm-loyalty-manage', module: 'Loyalty', action: 'manage', code: 'loyalty:manage', description: 'Manage loyalty rules & points balance' },
      // QR codes
      { id: 'perm-qr-manage', module: 'QR codes', action: 'manage', code: 'qr:manage', description: 'Generate & track QR codes' },
      // Staff
      { id: 'perm-staff-manage', module: 'Staff', action: 'manage', code: 'staff:manage', description: 'Manage staff accounts & assign roles' },
    ];

    await queryInterface.bulkInsert('permissions', permissionsData.map(p => ({ ...p, created_at: now, updated_at: now })));

    // 3. Mapping Role to Permissions
    const rolePermissionsMapping: { role_id: string; permission_id: string }[] = [
      // Owner (All)
      ...permissionsData.map(p => ({ role_id: 'role-owner', permission_id: p.id })),

      // Manager
      { role_id: 'role-manager', permission_id: 'perm-dashboard-view' },
      { role_id: 'role-manager', permission_id: 'perm-orders-read' },
      { role_id: 'role-manager', permission_id: 'perm-orders-update' },
      { role_id: 'role-manager', permission_id: 'perm-menu-read' },
      { role_id: 'role-manager', permission_id: 'perm-menu-manage' },
      { role_id: 'role-manager', permission_id: 'perm-offers-manage' },
      { role_id: 'role-manager', permission_id: 'perm-customers-read' },
      { role_id: 'role-manager', permission_id: 'perm-loyalty-manage' },
      { role_id: 'role-manager', permission_id: 'perm-qr-manage' },

      // Kitchen
      { role_id: 'role-kitchen', permission_id: 'perm-orders-read' },
      { role_id: 'role-kitchen', permission_id: 'perm-orders-update' },
      { role_id: 'role-kitchen', permission_id: 'perm-menu-read' },

      // Cashier
      { role_id: 'role-cashier', permission_id: 'perm-orders-read' },
      { role_id: 'role-cashier', permission_id: 'perm-orders-update' },
      { role_id: 'role-cashier', permission_id: 'perm-customers-read' },

      // Marketing
      { role_id: 'role-marketing', permission_id: 'perm-dashboard-view' },
      { role_id: 'role-marketing', permission_id: 'perm-offers-manage' },
      { role_id: 'role-marketing', permission_id: 'perm-customers-read' },
      { role_id: 'role-marketing', permission_id: 'perm-loyalty-manage' },
      { role_id: 'role-marketing', permission_id: 'perm-qr-manage' },
    ];

    await queryInterface.bulkInsert('role_permissions', rolePermissionsMapping);

    // 4. Admin and Staff User Accounts
    await queryInterface.bulkInsert('users', [
      {
        id: 'c701d0a5-341e-450a-9d99-0a62ff700101',
        phone: '+91 98700 10001',
        email: 'owner@charkhafoods.com',
        password_hash: passwordHash,
        full_name: 'Vaishnavi Charkha',
        user_type: 'staff',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'c701d0a5-341e-450a-9d99-0a62ff700102',
        phone: '+91 98700 10002',
        email: 'manager@charkhafoods.com',
        password_hash: passwordHash,
        full_name: 'Prasad Kulkarni',
        user_type: 'staff',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'c701d0a5-341e-450a-9d99-0a62ff700103',
        phone: '+91 98700 10003',
        email: 'kitchen@charkhafoods.com',
        password_hash: passwordHash,
        full_name: 'Sunil Yadav',
        user_type: 'staff',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 5. Staff Profiles mapped to Roles
    await queryInterface.bulkInsert('staff_profiles', [
      {
        id: 's701d0a5-341e-450a-9d99-0a62ff700101',
        user_id: 'c701d0a5-341e-450a-9d99-0a62ff700101',
        role_id: 'role-owner',
        role: 'Owner',
        shift_status: 'on_duty',
        created_at: now,
        updated_at: now,
      },
      {
        id: 's701d0a5-341e-450a-9d99-0a62ff700102',
        user_id: 'c701d0a5-341e-450a-9d99-0a62ff700102',
        role_id: 'role-manager',
        role: 'Manager',
        shift_status: 'on_duty',
        created_at: now,
        updated_at: now,
      },
      {
        id: 's701d0a5-341e-450a-9d99-0a62ff700103',
        user_id: 'c701d0a5-341e-450a-9d99-0a62ff700103',
        role_id: 'role-kitchen',
        role: 'Kitchen',
        shift_status: 'on_duty',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('staff_profiles', {});
    await queryInterface.bulkDelete('users', { user_type: 'staff' });
    await queryInterface.bulkDelete('role_permissions', {});
    await queryInterface.bulkDelete('permissions', {});
    await queryInterface.bulkDelete('roles', {});
  },
};
