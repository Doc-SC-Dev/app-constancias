import NavigationLink from "./_components/layout/navigation-links";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto h-full">
      {/* <NavigationLink /> */}
      <div className="space-y-4 mt-4">{children}</div>
    </div>
  );
}
