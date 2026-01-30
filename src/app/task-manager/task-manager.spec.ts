import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManager } from './task-manager';

describe('TaskManager', () => {
  let component: TaskManager;
  let fixture: ComponentFixture<TaskManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Task Initialization', () => {
    it('should initialize with empty tasks array', () => {
      expect(component.tasks).toEqual([]);
    });

    it('should initialize with empty taskTitle', () => {
      expect(component.taskTitle).toBe('');
    });

    it('should initialize with empty taskDescription', () => {
      expect(component.taskDescription).toBe('');
    });

    it('should initialize filter to "all"', () => {
      expect(component.filter).toBe('all');
    });

    it('should initialize nextId to 1', () => {
      expect(component.nextId).toBe(1);
    });
  });

  describe('addTask()', () => {
    it('should add a new task when valid title is provided', () => {
      component.taskTitle = 'Test Task';
      component.taskDescription = 'Test Description';

      component.addTask();

      expect(component.tasks.length).toBe(1);
      expect(component.tasks[0].title).toBe('Test Task');
      expect(component.tasks[0].description).toBe('Test Description');
    });

    it('should set completed to false for new task', () => {
      component.taskTitle = 'New Task';

      component.addTask();

      expect(component.tasks[0].completed).toBe(false);
    });

    it('should increment nextId when adding task', () => {
      component.taskTitle = 'Task 1';
      component.addTask();
      const firstTaskId = component.tasks[0].id;

      component.taskTitle = 'Task 2';
      component.addTask();

      expect(component.tasks[1].id).toBe(firstTaskId + 1);
    });

    it('should clear taskTitle after adding task', () => {
      component.taskTitle = 'Test Task';
      component.addTask();

      expect(component.taskTitle).toBe('');
    });

    it('should clear taskDescription after adding task', () => {
      component.taskDescription = 'Test Description';
      component.taskTitle = 'Test Task';

      component.addTask();

      expect(component.taskDescription).toBe('');
    });

    it('should not add task with empty title', () => {
      component.taskTitle = '';
      component.addTask();

      expect(component.tasks.length).toBe(0);
    });

    it('should not add task with whitespace-only title', () => {
      component.taskTitle = '   ';
      component.addTask();

      expect(component.tasks.length).toBe(0);
    });

    it('should add multiple tasks with incremental IDs', () => {
      component.taskTitle = 'Task 1';
      component.addTask();
      component.taskTitle = 'Task 2';
      component.addTask();
      component.taskTitle = 'Task 3';
      component.addTask();

      expect(component.tasks.length).toBe(3);
      expect(component.tasks[0].id).toBe(1);
      expect(component.tasks[1].id).toBe(2);
      expect(component.tasks[2].id).toBe(3);
    });
  });

  describe('deleteTask()', () => {
    beforeEach(() => {
      component.taskTitle = 'Task 1';
      component.addTask();
      component.taskTitle = 'Task 2';
      component.addTask();
      component.taskTitle = 'Task 3';
      component.addTask();
    });

    it('should remove task from tasks array', () => {
      const taskToDelete = component.tasks[1];

      component.deleteTask(taskToDelete);

      expect(component.tasks.length).toBe(2);
      expect(component.tasks).not.toContain(taskToDelete);
    });

    it('should not affect other tasks when deleting', () => {
      const firstTask = component.tasks[0];
      const thirdTask = component.tasks[2];
      const taskToDelete = component.tasks[1];

      component.deleteTask(taskToDelete);

      expect(component.tasks[0]).toBe(firstTask);
      expect(component.tasks[1]).toBe(thirdTask);
    });

    it('should handle deleting from empty array gracefully', () => {
      component.tasks = [];
      const fakeTask = { id: 999, title: 'Fake', description: '', completed: false };

      expect(() => component.deleteTask(fakeTask)).not.toThrow();
    });
  });

  describe('setFilter()', () => {
    it('should set filter to "all"', () => {
      component.setFilter('all');
      expect(component.filter).toBe('all');
    });

    it('should set filter to "completed"', () => {
      component.setFilter('completed');
      expect(component.filter).toBe('completed');
    });

    it('should set filter to "pending"', () => {
      component.setFilter('pending');
      expect(component.filter).toBe('pending');
    });
  });

  describe('filteredTasks', () => {
    beforeEach(() => {
      // Create test tasks
      component.taskTitle = 'Task 1';
      component.addTask();
      component.taskTitle = 'Task 2';
      component.addTask();
      component.taskTitle = 'Task 3';
      component.addTask();

      // Mark some as completed
      component.tasks[0].completed = true;
      component.tasks[2].completed = true;
    });

    it('should return all tasks when filter is "all"', () => {
      component.filter = 'all';

      expect(component.filteredTasks.length).toBe(3);
      expect(component.filteredTasks).toEqual(component.tasks);
    });

    it('should return only completed tasks when filter is "completed"', () => {
      component.filter = 'completed';

      expect(component.filteredTasks.length).toBe(2);
      expect(component.filteredTasks[0].completed).toBe(true);
      expect(component.filteredTasks[1].completed).toBe(true);
    });

    it('should return only pending tasks when filter is "pending"', () => {
      component.filter = 'pending';

      expect(component.filteredTasks.length).toBe(1);
      expect(component.filteredTasks[0].completed).toBe(false);
    });

    it('should return empty array when no completed tasks exist', () => {
      component.tasks.forEach(task => task.completed = false);
      component.filter = 'completed';

      expect(component.filteredTasks.length).toBe(0);
    });

    it('should return empty array when no pending tasks exist', () => {
      component.tasks.forEach(task => task.completed = true);
      component.filter = 'pending';

      expect(component.filteredTasks.length).toBe(0);
    });

    it('should update filtered results when filter changes', () => {
      component.filter = 'all';
      expect(component.filteredTasks.length).toBe(3);

      component.filter = 'completed';
      expect(component.filteredTasks.length).toBe(2);

      component.filter = 'pending';
      expect(component.filteredTasks.length).toBe(1);
    });
  });

  describe('Task Workflow', () => {
    it('should handle complete task workflow', () => {
      // Add tasks
      component.taskTitle = 'Buy groceries';
      component.taskDescription = 'Milk, eggs, bread';
      component.addTask();

      component.taskTitle = 'Complete project';
      component.taskDescription = 'Finish the Angular app';
      component.addTask();

      expect(component.tasks.length).toBe(2);

      // Mark first as completed
      component.tasks[0].completed = true;
      component.filter = 'completed';
      expect(component.filteredTasks.length).toBe(1);

      // Filter pending
      component.filter = 'pending';
      expect(component.filteredTasks.length).toBe(1);

      // Delete completed task
      component.filter = 'all';
      component.deleteTask(component.tasks[0]);
      expect(component.tasks.length).toBe(1);
    });
  });
});
