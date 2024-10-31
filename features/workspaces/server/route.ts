import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspace, updateWorkspace } from "../schema";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import {
  Database_ID,
  Members_ID,
  Tasks_ID,
  Workspace_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { GenerateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utilts";
import { z } from "zod";
import { Workspace } from "../type";
import { Project } from "@/features/projects/type";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const member = await databases.listDocuments(Database_ID, Members_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (!member.documents) {
        return c.json({data: {documents: [], total: 0}})
    }

    const workspaceIds = member.documents.map((item) => item.workspaceId);

    const workspaces = await databases.listDocuments(
      Database_ID,
      Workspace_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspaceIds)
      ]
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("json", createWorkspace),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name } = c.req.valid("json");

      const workspaces = await databases.createDocument(
        Database_ID,
        Workspace_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          inviteCode: GenerateInviteCode(12),
          // imageUrl: uploadImageUrl,
        }
      );

      await databases.createDocument(Database_ID, Members_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspaces.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspaces });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("json", updateWorkspace),
    async (c) => {
      const databases = c.get("databases")
      const storage = c.get("storage")
      const user = c.get("user")

      const { workspaceId } = c.req.param()
      const { name } = c.req.valid("json")
    
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if(!member || member.role !== MemberRole.ADMIN) {
        return c.json({error: "Unauthorized"}, 401)
      }

      const workspace = await databases.updateDocument(
        Database_ID,
        Workspace_ID,
        workspaceId,
        {
          name,
        }
      )

      return c.json({data: workspace})
    }
  )
  .delete(
    "/:workspaceId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases")
      const user = c.get("user")

      const {workspaceId} = c.req.param()

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if(!member || member.role !== MemberRole.ADMIN) {
        return c.json({error: "Unautorized access"}, 401)
      }

      await databases.deleteDocument(
        Database_ID,
        Workspace_ID,
        workspaceId
      )

      return c.json({data: {$id: workspaceId}})
    }
  )
  .get(
    "/:workspaceId/analytics",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases")
      const user = c.get("user")
  
      const { workspaceId } = c.req.param()
  
      const member = await getMember({
        databases,
        workspaceId,
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
          Query.equal("workspaceId", workspaceId),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
      )
  
      const lastMonthTask = await databases.listDocuments(
        Database_ID,
        Tasks_ID,
        [
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
          Query.equal("assigneeId", member.$id),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
      )
  
      const lastMonthAssinee = await databases.listDocuments(
        Database_ID,
        Tasks_ID,
        [
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
          Query.notEqual("status", TaskStatus.DONE),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
      )
  
      const lastMonthIncompleteTask  = await databases.listDocuments(
        Database_ID,
        Tasks_ID,
        [
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
          Query.equal("status", TaskStatus.DONE),
          Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
          Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString())
        ]
      )
  
      const lastMonthcompleteTask  = await databases.listDocuments(
        Database_ID,
        Tasks_ID,
        [
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
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
          Query.equal("workspaceId", workspaceId),
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
  .post(
    "/:workspaceId/reset-invite-code",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases")
      const user = c.get("user")

      const {workspaceId} = c.req.param()

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      })

      if(!member || member.role !== MemberRole.ADMIN) {
        return c.json({error: "Unautorized access"}, 401)
      }

      const workspace = await databases.updateDocument(
        Database_ID,
        Workspace_ID,
        workspaceId,
        {
          inviteCode: GenerateInviteCode(6)
        }
      )

      return c.json({data: workspace})
    }
  )
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({
      code: z.string()
    })),
    async (c) => {
      const { workspaceId } = c.req.param()
      const { code } = c.req.valid("json")
    
      const databases = c.get("databases")
      const user = c.get("user")

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if(member) {
        return c.json({error: "Already a member"}, 400)
      }

      const workspace = await databases.getDocument<Workspace>(
        Database_ID,
        Workspace_ID,
        workspaceId
      )

      if(workspace.inviteCode !== code) {
        return c.json({error: "Invalid invite code"}, 400)
      }

      await databases.createDocument(
        Database_ID,
        Members_ID,
        ID.unique(),
        {
          userId: user.$id,
          workspaceId,
          role: MemberRole.MEMBER
        }
      )

      return c.json({data: workspace})


    }
  )

export default app;
