"use client";

import { ChevronRight, Circle, CircleDashed } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

type TabsSideBarProps = {
  items: { id: string; label: string }[];
  onChange: (index: number) => void;
  children: ReactNode;
  index: number;
};
export default function TabsSideBar({
  items,
  children,
  onChange,
  index: selectedItem,
}: TabsSideBarProps) {
  return (
    <div className="flex flex-1 h-full gap-4">
      <div className="flex-1 space-y-2 h-full">
        {items.map((pt, index) => (
          <Item key={pt.id} variant="outline" size="sm">
            <ItemMedia variant="icon" className="bg-transparent border-none">
              {selectedItem === index ? (
                <CircleDashed className="text-amber-500" />
              ) : (
                <Circle />
              )}
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{pt.label}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange(index)}
              >
                <ChevronRight />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
      <div className="flex-5 h-full">{children}</div>
    </div>
  );
}
