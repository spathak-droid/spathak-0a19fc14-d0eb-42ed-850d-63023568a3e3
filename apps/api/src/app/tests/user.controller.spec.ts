import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '@proj/auth';

describe('UserController', () => {
  let controller: UserController;
  let service: any;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Disable JWT
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  it('should return all users', async () => {
    service.findAll.mockResolvedValue(['user1', 'user2']);

    const result = await controller.findAll();
    expect(result).toEqual(['user1', 'user2']);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one user', async () => {
    service.findOne.mockResolvedValue({ id: 1, name: 'User1' });

    const result = await controller.findOne('1');
    expect(result).toEqual({ id: 1, name: 'User1' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should create a user', async () => {
    const dto = { name: 'New User' };
    service.create.mockResolvedValue(dto);

    const result = await controller.create(dto);
    expect(result).toEqual(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', async () => {
    const dto = { name: 'Updated User' };
    service.update.mockResolvedValue(dto);

    const result = await controller.update('1', dto);
    expect(result).toEqual(dto);
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a user', async () => {
    service.remove.mockResolvedValue(true);

    const result = await controller.remove('1');
    expect(result).toBe(true);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
