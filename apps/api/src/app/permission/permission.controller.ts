import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '@proj/auth';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permService: PermissionService) {}

  @Get()
  findAll() {
    return this.permService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.permService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.permService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permService.remove(id);
  }
}
