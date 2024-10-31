import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CreateProjectModal from "@/features/projects/components/CreateProjectModal";
import CreateTasksModal from "@/features/tasks/components/CreateTasksModal";
import EditTasksModal from "@/features/tasks/components/EditTasksModal";
import CreateWorkspaceModal from "@/features/workspaces/components/CreateWorkspaceModal";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTasksModal />
      <EditTasksModal />
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:flex lg:w-[264px] h-full bg-gray-100 overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl w-full h-full">
            <div className="border-b">
              <Navbar />
            </div>
            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
