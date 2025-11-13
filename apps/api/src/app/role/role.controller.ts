import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtAuthGuard } from '@proj/auth';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Post()
  create(@Body() data: { name: string; permissionIds?: string[]; inheritsFromId?: string }) {
    return this.roleService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.roleService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  // ✅ New endpoint for full effective permissions (inherited + direct)
  @Get(':id/effective-permissions')
  getEffectivePermissions(@Param('id') id: string) {
    return this.roleService.getEffectivePermissions(id);
  }
}
