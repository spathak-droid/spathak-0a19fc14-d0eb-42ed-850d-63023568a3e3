import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '@proj/auth';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  create(@Body() data: { name: string; description?: string; parentId?: string }) {
    return this.orgService.create(data);
  }

  @Get()
  findAll() {
    return this.orgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.orgService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgService.remove(id);
  }

  @Get('tree/:id')
  findTree(@Param('id') id: string) {
    return this.orgService.findWithDescendants(id);
  }

}
