import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@proj/data';
import { Role } from '@proj/data';
import { Organization } from '@proj/data';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Organization])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
