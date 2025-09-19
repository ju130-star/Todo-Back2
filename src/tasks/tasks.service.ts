// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'; // Importe NotFoundException

interface Task {
  id: string; // Usaremos string para simplificar por enquanto
  title: string;
  description: string;
  status: 'PENDING' | 'DONE';
}

@Injectable()
export class TasksService {
  // Remova 'readonly' se você pretende reatribuir o array (como em 'remove')
  // Se você *precisa* de 'readonly' aqui, então o método 'remove' precisaria usar splice.
  private tasks: Task[] = []; // Array em memória para simular o DB
  private nextId = 1; // Começaremos IDs do 1

  // Para demonstração, vamos adicionar alguns Tarefas iniciais
  constructor() {
    this.create({
      title: 'Comprar leite',
      description: 'Ir ao mercado e comprar leite',
      status: 'PENDING',
    });
    this.create({
      title: 'Estudar TypeScript',
      description: 'Revisar conceitos de interfaces e classes',
      status: 'PENDING',
    });
    this.create({
      title: 'Enviar relatório',
      description: 'Enviar relatório semanal para o gestor',
      status: 'DONE',
    });
  }

  findAll(): Task[] {
    return this.tasks; // Retorna o array de Tarefas
  }

  // Corrigido: Retorna task | undefined, pois o produto pode não ser encontrado
  findOne(id: String): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  // Alternativa para findOne: Lança um erro se o produto não for encontrado
  findOneOrThrow(id: String): Task {
    const task = this.tasks.find((p) => p.id === id);
    if (!task) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return task;
  }

  // ...existing code...
  create(task: {
    title: string;
    description: string;
    status: 'PENDING' | 'DONE';
  }): Task {
    const newtask: Task = {
      id: String(this.nextId++),
      ...task,
    };
    this.tasks.push(newtask);
    return newtask;
  }

  // Corrigido: Retorna task | undefined, pois o produto pode não ser encontrado
  update(
    id: string,
    task: { title?: string; description?: string; status?: 'PENDING' | 'DONE' },
  ): Task | undefined {
    const index = this.tasks.findIndex((p) => p.id === id);
    if (index > -1) {
      this.tasks[index] = { ...this.tasks[index], ...task };
      return this.tasks[index];
    }
    return undefined;
  }

  // Alternativa para update: Lança um erro se o produto não for encontrado
  updateOrThrow(id: String, task: { name?: string; price?: String }): Task {
    const index = this.tasks.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Produto com ID ${id} não encontrado para atualização.`,
      );
    }
    this.tasks[index] = { ...this.tasks[index], ...task };
    return this.tasks[index];
  }

  // Corrigido: 'tasks' não pode ser 'readonly' se você for reatribuí-lo
  remove(id: String): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((p) => p.id !== id); // Reatribuição do array
    return this.tasks.length < initialLength; // Retorna true se um produto foi removido
  }

  // Alternativa para remove: Lança um erro se o produto não for encontrado
  removeOrThrow(id: String): void {
    const index = this.tasks.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Produto com ID ${id} não encontrado para remoção.`,
      );
    }
    this.tasks.splice(index, 1); // Remove no local
  }
}
