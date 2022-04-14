import { describe, test, expect, vi, afterEach } from "vitest";
import { IndexedDBService } from "./indexeddb.service";
import { TasksService } from "./tasks.service";

vi.mock("./indexeddb.service");

describe("TasksService", () => {
  let idbService: IndexedDBService;
  let tasksService: TasksService;
  const task = { name: "run tests" };

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("#addTask", () => {
    test("returns null if database not open", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(false),
          close: vi.fn().mockResolvedValue(true),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.addTask(task)).resolves.toBeNull();
    });

    test("returns new record key if successful", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(true),
          close: vi.fn().mockResolvedValue(true),
          create: vi.fn().mockResolvedValue(1),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.addTask(task)).resolves.toBe(1);
    });

    test("returns null if error", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(true),
          close: vi.fn().mockResolvedValue(true),
          create: vi.fn(() => {
            throw new Error("Error creating task");
          }),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.addTask(task)).resolves.toBeNull();
    });
  });

  describe("#getAllTasks", () => {
    test("returns empty array if database not open", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(false),
          close: vi.fn().mockResolvedValue(true),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.getAllTasks()).resolves.toEqual([]);
    });

    test("returns array of tasks if successful", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(true),
          close: vi.fn().mockResolvedValue(true),
          read: vi.fn().mockResolvedValue([task]),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.getAllTasks()).resolves.toEqual([task]);
    });

    test("returns empty array if error", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(true),
          close: vi.fn().mockResolvedValue(true),
          read: vi.fn(() => {
            throw new Error("Error getting tasks");
          }),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.getAllTasks()).resolves.toEqual([]);
    });
  });

  describe("#deleteTask", () => {
    test("returns false if database not open", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(false),
          close: vi.fn().mockResolvedValue(true),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.deleteTask(1)).resolves.toBe(false);
    });

    test("returns true if successful", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(true),
          close: vi.fn().mockResolvedValue(true),
          delete: vi.fn().mockResolvedValue(true),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.deleteTask(1)).resolves.toBe(true);
    });

    test("returns false if error", () => {
      // @ts-expect-error - mock
      vi.mocked(IndexedDBService).mockImplementation(() => {
        return {
          open: vi.fn().mockResolvedValue(true),
          close: vi.fn().mockResolvedValue(true),
          delete: vi.fn(() => {
            throw new Error("Error deleting task");
          }),
        };
      });

      idbService = new IndexedDBService("testDB", 1, []);
      tasksService = new TasksService(idbService, "testCollection");

      expect(tasksService.deleteTask(1)).resolves.toBe(false);
    });
  });
});
