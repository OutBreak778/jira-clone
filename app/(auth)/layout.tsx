"use client"


import Header from "@/components/Header";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl">
        <Header />
      </div>
      <div className="flex flex-col items-center justify-center pt-4 md:pt-12">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
