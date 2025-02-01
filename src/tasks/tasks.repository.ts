import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

export interface TasksRepository extends Repository<Task> {
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>;
}

export const extendedTaskRepository = {
  async createTask(
    this: Repository<Task>,
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  },
  async getTasks(
    this: Repository<Task>,
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) like LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return query.getMany();
  },
};
