import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@proj/data';
import { Role } from '@proj/data';
import { Organization } from '@proj/data';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async findAll() {
    return this.userRepo.find({
      relations: ['role', 'organization'],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role', 'organization'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
    organizationId: string;
  }) {
    const org = await this.orgRepo.findOneBy({ id: data.organizationId });
    if (!org) throw new NotFoundException('Organization not found');

    const role = await this.roleRepo.findOneBy({ id: data.roleId });
    if (!role) throw new NotFoundException('Role not found');

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
      organization: org,
    });

    return this.userRepo.save(user);
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return this.userRepo.remove(user);
  }

  async validatePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
