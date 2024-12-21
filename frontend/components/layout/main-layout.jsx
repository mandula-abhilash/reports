import { Header } from "./header";

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-14">{children}</div>
    </div>
  );
}
