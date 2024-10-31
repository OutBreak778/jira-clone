import { Database_ID, Project_ID, Tasks_ID } from "@/config";
import { getMember } from "@/features/members/utilts";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { Project } from "../type";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
.get(
  "/",
  sessionMiddleware,
  zValidator("query", z.object({ workspaceId: z.string() })),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.valid("query");
    if(!workspaceId) {
      return c.json({error: "Missing Workspace ID"}, 400)
    }
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if(!member) {
        return c.json({error: "Unauthorized access"}, 401)
    }

    const projects = await databases.listDocuments(
        Database_ID,
        Project_ID,
        [Query.equal("workspaceId", workspaceId),Query.orderDesc("$createdAt")]
    )

    return c.json({data: projects})
  }
)
.post(
    "/",
    sessionMiddleware,
    zValidator("json", createProjectSchema),
    async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");
  
        const { name, workspaceId } = c.req.valid("json");

        const members = await getMember({
            databases,
            workspaceId,
            userId: user.$id
        })

        if(!members) {
            return c.json({error: "Unauthorized access"}, 401)
        }
  
        const project = await databases.createDocument(
          Database_ID,
          Project_ID,
          ID.unique(),
          {
            name,
            workspaceId
          }
        );
  
        return c.json({ data: project });
      }

)
.patch(
  "/:projectId",
  sessionMiddleware,
  zValidator("json", updateProjectSchema),
  async (c) => {
    const databases = c.get("databases")
    const storage = c.get("storage")
    const user = c.get("user")

    const { projectId } = c.req.param()
    const { name } = c.req.valid("json")

    const existingProject = await databases.getDocument<Project>(
      Database_ID,
      Project_ID,
      projectId
    )
  
    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id
    })

    if(!member) {
      return c.json({error: "Unauthorized"}, 401)
    }

    const project = await databases.updateDocument(
      Database_ID,
      Project_ID,
      projectId,
      {
        name,
      }
    )

    return c.json({data: project})
  }
)
.delete(
  "/:projectId",
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases")
    const user = c.get("user")

    const {projectId} = c.req.param()

    const existingProject = await databases.getDocument<Project>(
      Database_ID,
      Project_ID,
      projectId
    )

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id
    })

    if(!member ) {
      return c.json({error: "Unautorized access"}, 401)
    }

    await databases.deleteDocument(
      Database_ID,
      Project_ID,
      projectId
    )

    return c.json({data: {$id: existingProject.$id}})
  }
)
.get(
  "/:projectId/analytics",
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases")
    const user = c.get("user")

    const { projectId } = c.req.param()
    
    const project = await databases.getDocument<Project>(
      Database_ID,
      Project_ID,
      projectId
    )

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id
    })

    if(!member) {
      return c.json({error: "Unauthorized access"}, 401)
    }

    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)

    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const thisMonthTask = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthTask = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const taskCount = thisMonthTask.total
    const taskDifference = taskCount - lastMonthTask.total

    const thisMonthAssinee = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthAssinee = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const assigneedTaskCount = thisMonthAssinee.total
    const assigneedTaskDifference = assigneedTaskCount - lastMonthAssinee.total

    const thisMonthIncompleteTask = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthIncompleteTask  = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const incompleteCount = thisMonthIncompleteTask.total
    const incomleteTaskDifference = incompleteCount - lastMonthIncompleteTask.total


    const thisMonthcompleteTask = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthcompleteTask  = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const completeCount = thisMonthcompleteTask.total
    const comleteTaskDifference = completeCount - lastMonthcompleteTask.total

    const thisMonthoverdueTask = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.lessThan("dueDate",now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
      ]
    )

    const lastMonthoverdueTask  = await databases.listDocuments(
      Database_ID,
      Tasks_ID,
      [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.lessThan("dueDate",now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
      ]
    )

    const overdueTaskCount = thisMonthoverdueTask.total
    const overdueTaskDifference = overdueTaskCount - lastMonthoverdueTask.total

    return c.json({data: {
      taskCount,
      taskDifference,
      assigneedTaskCount,
      assigneedTaskDifference,
      completeCount,
      comleteTaskDifference,
      incomleteTaskDifference,
      incompleteCount,
      overdueTaskCount,
      overdueTaskDifference
    }})
 
  }

)
.get(
  "/:projectId",
  sessionMiddleware,
  async (c) => {
    const user = c.get("user")
    const databases = c.get("databases")
    const {projectId} = c.req.param()
    console.log("object",projectId)

    const project = await databases.getDocument<Project>(
      Database_ID,
      Project_ID,
      projectId
    )

    if(!projectId) {
      return c.json({error: "Missing project id"}, 400)

    }

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id
    })

    if(!member) {
      return c.json({error: "Unauthorized access"}, 401)
    }

    return c.json({data: project})
  }
)

export default app;
