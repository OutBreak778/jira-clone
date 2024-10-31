import UserButton from "@/features/auth/components/UserButton";
import Image from "next/image";
import Link from "next/link";

const StandAloneLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-screen-2xl">
        <nav className="flex items-center border-b-2 border-gray-200 justify-between px-6 h-[73px]">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo.svg"
              className="text-gray-700"
              alt="logo"
              width={46}
              height={46}
            />
            <span className="text-xl font-bold ml-3 text-gray-800">
              OUTBREAK
            </span>
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center p-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandAloneLayout;
