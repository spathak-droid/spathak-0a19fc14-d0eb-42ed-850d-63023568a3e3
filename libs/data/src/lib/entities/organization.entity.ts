import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Organization, (org) => org.children, { nullable: true })
  parent?: Organization;

  @OneToMany(() => Organization, (org) => org.parent)
  children?: Organization[];
}
