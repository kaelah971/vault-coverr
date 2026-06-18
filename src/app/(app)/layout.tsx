import { WalletProvider } from "@/components/WalletProvider";
import NavSidebar from "./NavSidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WalletProvider>
      <div className="min-h-screen overflow-x-hidden bg-[#0E100F] [font-family:Mori,var(--font-geist-sans),-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] text-[#FFFCE1]">
        <NavSidebar />
        <main className="min-w-0 max-w-full overflow-x-hidden pt-16 lg:ml-72 lg:pt-0">
          <div className="min-h-screen min-w-0 max-w-full overflow-x-hidden bg-[radial-gradient(circle_at_100%_0%,rgba(0,186,226,0.055),transparent_30rem)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10 xl:px-12 xl:py-12">
            {children}
          </div>
        </main>
      </div>
    </WalletProvider>
  );
}
