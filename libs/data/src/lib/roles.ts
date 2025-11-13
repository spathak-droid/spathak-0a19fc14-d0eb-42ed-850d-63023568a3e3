// export enum Role {
//   Viewer = 'viewer',
//   Admin = 'admin',
//   Owner = 'owner',
// }

// export enum Permission {
//   TaskCreate = 'task:create',
//   TaskRead   = 'task:read',
//   TaskUpdate = 'task:update',
//   TaskDelete = 'task:delete',
//   AuditRead  = 'audit:read',
// }

// export const RolePermissions: Record<Role, Permission[]> = {
//   [Role.Viewer]: [Permission.TaskRead],
//   [Role.Admin]: [
//     Permission.TaskRead,
//     Permission.TaskCreate,
//     Permission.TaskUpdate,
//     Permission.TaskDelete,
//     Permission.AuditRead,
//   ],
//   [Role.Owner]: [
//     Permission.TaskRead,
//     Permission.TaskCreate,
//     Permission.TaskUpdate,
//     Permission.TaskDelete,
//     Permission.AuditRead,
//   ],
// };
