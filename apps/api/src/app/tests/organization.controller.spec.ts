import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from '../organization/organization.controller';
import { OrganizationService } from '../organization/organization.service';
import { JwtAuthGuard } from '@proj/auth';

describe('OrganizationController', () => {
  let controller: OrganizationController;
  let service: any;

  const mockOrgService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findWithDescendants: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [
        { provide: OrganizationService, useValue: mockOrgService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrganizationController>(OrganizationController);
    service = module.get(OrganizationService);
  });

  it('should create organization', async () => {
    const dto = { name: 'Org1' };
    service.create.mockResolvedValue(dto);

    const result = await controller.create(dto);
    expect(result).toEqual(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all organizations', async () => {
    service.findAll.mockResolvedValue(['org1']);

    expect(await controller.findAll()).toEqual(['org1']);
  });

  it('should return one organization', async () => {
    service.findOne.mockResolvedValue('org1');

    expect(await controller.findOne('1')).toBe('org1');
  });

  it('should update organization', async () => {
    const dto = { name: 'Updated' };
    service.update.mockResolvedValue(dto);

    expect(await controller.update('1', dto)).toEqual(dto);
  });

  it('should remove organization', async () => {
    service.remove.mockResolvedValue(true);

    expect(await controller.remove('1')).toBe(true);
  });

  it('should return organization tree', async () => {
    service.findWithDescendants.mockResolvedValue(['child1']);

    expect(await controller.findTree('1')).toEqual(['child1']);
  });
});
