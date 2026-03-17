import { Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditActionButton({ url }: { url: string }) {
  return (
    <Button
      className="group flex items-center justify-center transition-all duration-300 ease-in-out hover:gap-2 gap-0 px-3 hover:px-4 "
      variant="ghost"
      asChild
    >
      <Link href={url}>
        <Pencil className="h-4 w-4 shrink" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[150px] group-hover:opacity-100">
          Editar
        </span>
      </Link>
    </Button>
  );
}
