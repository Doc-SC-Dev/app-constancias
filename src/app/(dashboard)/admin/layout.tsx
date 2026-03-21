import NavigationLink from "./_components/layout/navigation-links";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-h-full mx-auto flex flex-col">
      <NavigationLink />
      <div className="flex-1 flex flex-col min-h-0 mt-4">{children}</div>
    </div>
  );
}
