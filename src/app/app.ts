import { Component } from '@angular/core';
import { TaskManager } from './task-manager/task-manager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskManager],   // ✅ correct
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}