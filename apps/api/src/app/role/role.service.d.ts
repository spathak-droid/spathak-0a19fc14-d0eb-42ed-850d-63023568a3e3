import { Repository } from 'typeorm';
import { Role } from '@proj/data';
import { Permission } from '@proj/data';
export declare class RoleService {
    private readonly roleRepo;
    private readonly permRepo;
    constructor(roleRepo: Repository<Role>, permRepo: Repository<Permission>);
    findAll(): Promise<Role[]>;
    findOne(id: string): Promise<Role | null>;
    create(data: {
        name: string;
        permissionIds?: string[];
        inheritsFromId?: string;
    }): Promise<Role>;
    update(id: string, data: Partial<Role>): Promise<Role>;
    remove(id: string): Promise<Role>;
    /**
     * ✅ Compute full permission set (with inheritance)
     */
    getEffectivePermissions(roleId: string, seen?: Set<string>): Promise<Permission[]>;
}
//# sourceMappingURL=role.service.d.ts.map