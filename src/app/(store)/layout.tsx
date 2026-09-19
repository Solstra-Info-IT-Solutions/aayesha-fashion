import { NavDrape } from "@/components/layout/nav-drape";
import { Footer } from "@/components/layout/footer";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <NavDrape />

      <main
        className="
          min-h-screen
          bg-[var(--color-ivory)]
        "
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}