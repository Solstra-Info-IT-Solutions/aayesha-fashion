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
      {/*<AnnouncementBar />*/}

      <Header />

      <main
        className="
          min-h-screen
          bg-[var(--color-ivory)]
          pt-[72px]
          sm:pt-[76px]
          md:pt-[80px]
          lg:pt-[84px]
        "
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}