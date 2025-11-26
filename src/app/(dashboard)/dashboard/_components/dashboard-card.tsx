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
    <Card className=" h-30 hover:bg-accent hover:text-accent-foreground min-w-2xs max-w-xl">
      <Link href={url} className="place-self-stretch">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="on-hover:text-accent-foreground/10">
            {description}
          </CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
