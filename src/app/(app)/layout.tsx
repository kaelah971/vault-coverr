import { WalletProvider } from "@/components/WalletProvider";
import NavSidebar from "./NavSidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WalletProvider>
      <div className="flex min-h-screen bg-obsidian">
        <NavSidebar />
        <main className="flex-1 p-6 pt-20 lg:ml-60 lg:p-8 lg:pt-8 xl:p-12 xl:pt-12">
          {children}
        </main>
      </div>
    </WalletProvider>
  );
}
