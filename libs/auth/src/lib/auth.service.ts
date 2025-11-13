import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@proj/data';
// import { RoleService } from '../../../../apps/api/src/app/role/role.service.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    // private readonly roleService: RoleService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({
        where: { email },
        relations: [
            'role',
            'role.permissions',
            'role.inheritsFrom',
            'role.inheritsFrom.permissions',
            'organization',
        ],
    });


    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  private collectPermissions(role: any, set: Set<string>) {
  if (role.permissions) {
    role.permissions.forEach((p: any) => set.add(p.name));
  }
  if (role.inheritsFrom) {
    this.collectPermissions(role.inheritsFrom, set);
  }
}


  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const permSet = new Set<string>();
    this.collectPermissions(user.role, permSet);
    const permissions = Array.from(permSet);

    // const effectivePerms = await this.roleService.getEffectivePermissions(user.role.id);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
      orgId: user.organization.id,
      permissions
      // permissions: effectivePerms.map(p => p.name),
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        permissions
      },
    };
  }

  async verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
