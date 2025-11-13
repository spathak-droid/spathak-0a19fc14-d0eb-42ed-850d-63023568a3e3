import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string; // e.g. 'OWNER', 'ADMIN', 'VIEWER'

  // 🔗 Many-to-many relationship with Permission
  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions', // join table name
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions!: Permission[];

  // 🔁 Self-reference for inheritance
  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'inherits_from_id' })
  inheritsFrom?: Role;
}
