import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@proj/data';
import { Permission } from '@proj/data';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  findAll() {
    return this.roleRepo.find({ relations: ['permissions', 'inheritsFrom'] });
  }

  findOne(id: string) {
    return this.roleRepo.findOne({
      where: { id },
      relations: ['permissions', 'inheritsFrom'],
    });
  }

  

  async create(data: { name: string; permissionIds?: string[]; inheritsFromId?: string }) {
    const role = this.roleRepo.create({ name: data.name });

    // Attach inherited role
    if (data.inheritsFromId) {
      const parent = await this.roleRepo.findOneBy({ id: data.inheritsFromId });
      if (!parent) throw new NotFoundException('Inherited role not found');
      role.inheritsFrom = parent;
    }

    // Attach permissions
    if (data.permissionIds?.length) {
      role.permissions = await this.permRepo.findByIds(data.permissionIds);
    }

    return this.roleRepo.save(role);
  }

  async update(id: string, data: Partial<Role>) {
    const role = await this.roleRepo.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) throw new NotFoundException('Role not found');

    Object.assign(role, data);
    return this.roleRepo.save(role);
  }

  async remove(id: string) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('Role not found');
    return this.roleRepo.remove(role);
  }

  /**
   * ✅ Compute full permission set (with inheritance)
   */
  async getEffectivePermissions(roleId: string, seen = new Set<string>()): Promise<Permission[]> {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['permissions', 'inheritsFrom', 'inheritsFrom.permissions'],
    });

    if (!role) throw new NotFoundException('Role not found');

    if (seen.has(role.id)) return [];
    seen.add(role.id);

    const own = role.permissions || [];

    if (!role.inheritsFrom) return own;

    const inherited = await this.getEffectivePermissions(role.inheritsFrom.id, seen);
    const merged = [...own, ...inherited];
    const unique = Array.from(new Map(merged.map(p => [p.id, p])).values());
    return unique;
  }
}
