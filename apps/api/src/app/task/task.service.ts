import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@proj/data';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) { }

  findAll() {
    return this.taskRepo.find();
  }

  findOne(id: string) {
    return this.taskRepo.findOneBy({ id });
  }

  async create(data: any) {
    const { createdById, organizationId, ...taskFields } = data;

    const task = this.taskRepo.create({
      ...taskFields,        // title, description, category
      status: data.status ?? "TODO",
      category: data.category ?? "Work",
      assignedTo: data.assignedToId ? { id: data.assignedToId } : null,
      createdBy: { id: createdById },
      organization: { id: organizationId },
    });

    return this.taskRepo.save(task);
  }

  async getAuditForOrg(orgId: string) {
    return this.taskRepo.find({
      where: { organization: { id: orgId } },
      relations: ['organization']
    });
  }

  async update(id: string, data: Partial<Task>) {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found');
    Object.assign(task, data);
    return this.taskRepo.save(task);
  }

  async remove(id: string) {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found');
    return this.taskRepo.remove(task);
  }
}
