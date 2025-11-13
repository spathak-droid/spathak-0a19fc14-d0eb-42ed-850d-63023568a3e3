import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { eager: true })
  createdBy!: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  assignedTo?: User;

  @ManyToOne(() => Organization, { eager: true })
  organization!: Organization;

  @Column({ type: 'varchar', default: 'Work' })
  category!: 'Work' | 'Personal' | 'Other'

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'varchar', default: 'TODO' })
  status!: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @UpdateDateColumn()
  updatedAt!: Date;
}
