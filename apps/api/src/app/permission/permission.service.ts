import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '@proj/data';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  findAll() {
    return this.permRepo.find();
  }

  findOne(id: string) {
    return this.permRepo.findOneBy({ id });
  }

  create(data: Partial<Permission>) {
    const perm = this.permRepo.create(data);
    return this.permRepo.save(perm);
  }

  async update(id: string, data: Partial<Permission>) {
    const perm = await this.permRepo.findOneBy({ id });
    if (!perm) throw new NotFoundException('Permission not found');
    Object.assign(perm, data);
    return this.permRepo.save(perm);
  }

  async remove(id: string) {
    const perm = await this.permRepo.findOneBy({ id });
    if (!perm) throw new NotFoundException('Permission not found');
    return this.permRepo.remove(perm);
  }
}
