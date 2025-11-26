import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  url: string;
}

export function DashboardCard({ title, description, url }: DashboardCardProps) {
  return (
    <Link href={url}>
      <Card className="w-full h-30 hover:bg-accent">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
