import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { taskSchema } from "../schema";
import { getMember } from "@/features/members/utilts";
import { Database_ID, Members_ID, Project_ID, Tasks_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Tasks, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/type";

const app = new Hono()
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Tasks>(
      Database_ID,
      Tasks_ID,
      taskId
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized Access" }, 401);
    }

    await databases.deleteDocument(Database_ID, Tasks_ID, taskId);

    return c.json({ data: { $id: task.$id } });
  })
  .post("/", sessionMiddleware, zValidator("json", taskSchema), async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { name, status, assigneeId, dueDate, projectId, workspaceId } =
      c.req.valid("json");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    console.log("There are members here" + member.$id)

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const highestPositionTask = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("status", status),
        Query.equal("workspaceId", workspaceId),
        Query.orderAsc("position"),
        Query.limit(1),
      ]
    );

    const newPosition =
      highestPositionTask.documents.length > 0
        ? highestPositionTask.documents[0].position + 1000
        : 1000;

    const task = await databases.createDocument<Tasks>(
      Database_ID,
      Tasks_ID,
      ID.unique(),
      {
        name,
        status,
        workspaceId,
        projectId,
        dueDate,
        assigneeId,
        position: newPosition,
      }
    );

    return c.json({ data: task });
  })
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      // console.log("Databases object:", databases.listDocuments);
      const { search, status, assigneeId, dueDate, projectId, workspaceId } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("Project Id tasks route: " + projectId);
        query.push(Query.equal("projectId", projectId));
      }

      if (status) {
        console.log("Project Id tasks route: " + status);
        query.push(Query.equal("status", status));
      }

      if (assigneeId) {
        console.log("Project Id tasks route: " + assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        console.log("Project Id tasks route: " + dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        console.log("Project Id tasks route: " + search);
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments<Tasks>(
        Database_ID,
        Tasks_ID,
        query
      );

      const projectIds = tasks.documents.map((item) => item.projectId);
      const assigneeIds = tasks.documents.map((item) => item.assigneeId);

      const projects = await databases.listDocuments<Project>(
        Database_ID,
        Project_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );
      
      const members = await databases.listDocuments(
        Database_ID,
        Members_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (item) => {
          const user = await users.get(item.userId);
          return {
            ...item,
            name: user.name,
            email: user.email,
          };
        })
      );


      const populatedTask = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTask,
        },
      });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", taskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { name, status, assigneeId, dueDate, projectId, description } =
        c.req.valid("json");
      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Tasks>(
        Database_ID,
        Tasks_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument<Tasks>(
        Database_ID,
        Tasks_ID,
        taskId,
        {
          name,
          status,
          description,
          projectId,
          dueDate,
          assigneeId,
        }
      );
      console.log("This is updated task:- "+ task)

      return c.json({ data: task });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user");
    const databases = c.get("databases");
    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Tasks>(
      Database_ID,
      Tasks_ID,
      taskId
    );

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized access" }, 401);
    }

    const project = await databases.getDocument<Project>(
      Database_ID,
      Project_ID,
      task.projectId
    );

    const member = await databases.getDocument(
      Database_ID,
      Members_ID,
      task.assigneeId
    );

    const user = await users.get(member.userId);
 
    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  });

export default app;
