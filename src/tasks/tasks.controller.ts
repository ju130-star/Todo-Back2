import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'DONE';
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Task {
    const task = this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`);
    }
    return task;
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Task {
    const task = this.tasksService.update(id, updateTaskDto);
    if (!task) {
      throw new NotFoundException(
        `Tarefa com ID ${id} não encontrada para atualizar.`,
      );
    }
    return task;
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    const removed = this.tasksService.remove(id);
    if (!removed) {
      throw new NotFoundException(
        `Tarefa com ID ${id} não encontrada para remover.`,
      );
    }
    return { message: `Tarefa com ID ${id} removida com sucesso.` };
  }
}
