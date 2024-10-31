import { getCurrent } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspaces/actions";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in")
  } 
  
  const workspace = await getWorkspaces()
  if(workspace.total === 0) {
    redirect("/workspaces/create")
  } else {
    redirect(`/workspaces/${workspace.documents[0].$id}`)
  }
 
};

export default page;