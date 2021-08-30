import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  id: 'someId',
  username: 'Francis',
  password: '12341234',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    tasksRepository = await module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');

      const result = await tasksService.getTasks(null, mockUser);

      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test title',
        description: 'Test description',
        status: TaskStatus.OPEN,
      };

      await tasksRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById('someId', mockUser);

      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.getTasks and handles and exception', async () => {
      await tasksRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls TasksRepository.createTask and returns the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test title',
        description: 'Test description',
        status: TaskStatus.IN_PROGRESS,
      };

      await tasksRepository.createTask.mockResolvedValue(mockTask);

      const result = await tasksService.createTask(null, mockUser);

      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls TasksRepository.delete and deletes a task', async () => {
      const result = await tasksRepository.delete('someId', mockUser);

      expect(result).toEqual(undefined);
    });
  });
});
