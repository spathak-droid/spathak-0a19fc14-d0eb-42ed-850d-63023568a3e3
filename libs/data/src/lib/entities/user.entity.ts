import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @ManyToOne(() => Role, { eager: true })
  role!: Role;

  @Column()
  password!: string;

  @ManyToOne(() => Organization, { nullable: false, eager: true })
  organization!: Organization;

  @CreateDateColumn()
  createdAt!: Date;
}
