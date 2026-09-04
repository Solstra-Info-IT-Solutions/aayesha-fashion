import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />

      <Header />

      <main className="min-h-screen bg-[var(--color-ivory)]">
        {children}
      </main>

      <Footer />
    </div>
  );
}