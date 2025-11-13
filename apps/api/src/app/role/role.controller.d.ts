import { RoleService } from './role.service';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    findAll(): Promise<import("@proj/data").Role[]>;
    findOne(id: string): Promise<import("@proj/data").Role | null>;
    create(data: {
        name: string;
        permissionIds?: string[];
        inheritsFromId?: string;
    }): Promise<import("@proj/data").Role>;
    update(id: string, data: any): Promise<import("@proj/data").Role>;
    remove(id: string): Promise<import("@proj/data").Role>;
    getEffectivePermissions(id: string): Promise<import("@proj/data").Permission[]>;
}
//# sourceMappingURL=role.controller.d.ts.map