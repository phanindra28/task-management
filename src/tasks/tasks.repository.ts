import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

export interface TasksRepository extends Repository<Task> {
  createTask(createTaskDto: CreateTaskDto): Promise<Task>;
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>;
}

export const extendedTaskRepository = {
  async createTask(
    this: Repository<Task>,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  },
  async getTasks(
    this: Repository<Task>,
    filterDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE :search OR LOWER(task.description) like LOWER(:search)',
        { search: `%${search}%` },
      );
    }
    const tasks = query.getMany();
    return tasks;
  },
};
