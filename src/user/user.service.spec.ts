import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { AvatarService } from '../avatar/avatar.service';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { Role, User } from './shemas/user.shema';

describe('UserService - Find by ID', () => {
  let service: UserService;
  let axiosMock: AxiosMockAdapter;

  beforeEach(async () => {
    axiosMock = new AxiosMockAdapter(axios);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
        {
          provide: AvatarService,
          useValue: {
            getAvatarByUserId: jest.fn(),
            deleteAvatar: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    axiosMock.reset(); // Reset mocks after each test
  });

  it('should create a user id db', async () => {
    const user = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@mail.com',
      Role: Role.USER,
    };

    
  });

  it('should find a user by ID', async () => {
    const userId = 1;
    const expectedUser = {
      id: userId,
      email: 'user@example.com',
      first_name: 'Test',
      last_name: 'User',
    };

    axiosMock.onGet(`https://reqres.in/api/users/${userId}`).reply(200, {
      data: expectedUser,
    });

    const result = await service.findById(userId);

    expect(result).toEqual(expectedUser);
  });

  it('should throw an error if user not found', async () => {
    const userId = 999;

    axiosMock.onGet(`https://reqres.in/api/users/${userId}`).reply(404);

    await expect(service.findById(userId)).rejects.toThrow(
      'User with ID 999 not found or request failed',
    );
  });
});
