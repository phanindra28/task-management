import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  public getTasks(): Task[] {
    return this.tasks;
  }
  public getTaskById(id: string){
    return this.tasks.find(task => task.id === id);
  }
  public createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  public deleteTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  public updateTask(id: string, status: TaskStatus): Task | undefined {
    let task = this.getTaskById(id);
    if(task){
      task.status = status
    }
    return task;
  }

  public getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { search, status } = filterDto;
    const res = [];
    let tasks = this.tasks;
    if(status){
      tasks = tasks.filter(task => task.status === status);
    }
    if(search){
      tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
    }
    return tasks
  }
}
