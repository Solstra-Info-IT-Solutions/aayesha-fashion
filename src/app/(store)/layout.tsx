import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnnouncementBar />

      <Header />

      <main className="min-h-screen bg-[var(--color-ivory)]">
        {children}
      </main>
    </>
  );
}