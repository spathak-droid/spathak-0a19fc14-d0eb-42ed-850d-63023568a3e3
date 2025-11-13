import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@proj/data';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async create(data: { name: string; description?: string; parentId?: string }) {
    const organization = this.orgRepo.create({
      name: data.name,
      description: data.description,
    });

    if (data.parentId) {
      const parent = await this.orgRepo.findOne({ where: { id: data.parentId } });
      if (!parent) throw new NotFoundException('Parent organization not found');
      organization.parent = parent;
    }

    return this.orgRepo.save(organization);
  }

  findAll() {
    return this.orgRepo.find({
      relations: ['parent', 'children'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, data: Partial<Organization>) {
    const org = await this.findOne(id);
    Object.assign(org, data);
    return this.orgRepo.save(org);
  }

  async remove(id: string) {
    const org = await this.findOne(id);
    return this.orgRepo.remove(org);
  }

  async findWithDescendants(orgId: string) {
  const root = await this.orgRepo.findOne({
    where: { id: orgId },
    relations: ['children'],
  });

  if (!root) throw new NotFoundException('Organization not found');

  const all: Organization[] = [];

  const traverse = async (org: Organization) => {
    all.push(org);

    if (org.children?.length) {
      for (const child of org.children) {
        const fullChild = await this.orgRepo.findOne({
          where: { id: child.id },
          relations: ['children'],
        });
        await traverse(fullChild as any);
      }
    }
  };

  await traverse(root);

  return all;
}

}
