import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User, Role, Organization, Permission, Task } from '@proj/data';

import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { OrganizationModule } from './organization/organization.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from '@proj/auth';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dev.sqlite',
      entities: [
        Role,
        Permission,
        Organization,
        User,
        Task,
      ],
      synchronize: true,
      logging: true,
      extra: {
        busyTimeout: 60000,
      },
    }),
    AuthModule,
    RoleModule,
    PermissionModule,
    OrganizationModule,
    UserModule,
    TaskModule,
  ],
})
export class AppModule {}
