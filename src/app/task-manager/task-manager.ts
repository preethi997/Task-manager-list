import { Component } from '@angular/core';
import { Task } from '../task.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-manager.html',
  styleUrls: ['./task-manager.css']   // ✅ FIXED (plural)
})
export class TaskManager {

  tasks: Task[] = [];
  taskTitle: string = '';
  taskDescription: string = '';
  filter: string = 'all';
  nextId: number = 1;

  addTask() {
    if (!this.taskTitle.trim()) return;

    this.tasks.push({
      id: this.nextId++,
      title: this.taskTitle,
      description: this.taskDescription,
      completed: false
    });

    this.taskTitle = '';
    this.taskDescription = '';
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }

  setFilter(filter: string) {
    this.filter = filter;
  }

  get filteredTasks() {
    if (this.filter === 'completed') {
      return this.tasks.filter(t => t.completed);
    }
    if (this.filter === 'pending') {
      return this.tasks.filter(t => !t.completed);
    }
    return this.tasks;
  }
}