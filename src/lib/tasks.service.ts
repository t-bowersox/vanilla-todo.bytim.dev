import { DatabaseServiceInterface } from "./database-service.interface";
import { TaskInterface } from "./task.interface";

export class TasksService {
  constructor(
    private dbService: DatabaseServiceInterface,
    private collection: string
  ) {}

  /**
   * @returns The ID of the task if successful; null if not.
   */
  public async addTask(task: TaskInterface): Promise<string | number | null> {
    try {
      const dbOpen = await this.dbService.open();
      if (!dbOpen) {
        return null;
      }

      return await this.dbService.create(task, this.collection);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      return null;
    } finally {
      await this.dbService.close();
    }
  }

  public async getAllTasks(): Promise<TaskInterface[]> {
    try {
      const dbOpen = await this.dbService.open();
      if (!dbOpen) {
        return [];
      }

      return await this.dbService.read<TaskInterface>(this.collection);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      return [];
    } finally {
      await this.dbService.close();
    }
  }

  public async deleteTask(taskId: number): Promise<boolean> {
    try {
      const dbOpen = await this.dbService.open();
      if (!dbOpen) {
        return false;
      }

      return await this.dbService.delete(taskId, this.collection);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      return false;
    } finally {
      await this.dbService.close();
    }
  }
}
