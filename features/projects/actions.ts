import { createSessionMiddleware } from "@/lib/appwrite";
import { getMember } from "../members/utilts";
import { Database_ID, Project_ID, Workspace_ID } from "@/config";
import { Workspace } from "../workspaces/type";
import { Project } from "./type";

interface getProjectProps {
    projectId: string
  }
  
  export const getProjects = async ({projectId}: getProjectProps) => {
      const { account, databases } = await createSessionMiddleware()
      
      const user = await account.get();
  
      const project = await databases.getDocument<Project>(
        Database_ID,
        Project_ID,
        projectId
      );

            
      const member = await getMember(({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId
      }))
  
      if(!member) return null
  
      return project;
  };