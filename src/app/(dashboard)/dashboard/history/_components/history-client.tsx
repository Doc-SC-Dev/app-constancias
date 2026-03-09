"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/lib/types/users";

interface HistoryClientProps {
  isAdmin: boolean;
  user: User;
  standardTable: React.ReactNode;
  otherTable: React.ReactNode;
}

export function HistoryClient({
  standardTable,
  otherTable,
}: HistoryClientProps) {
  const [activeTab, setActiveTab] = useState<"standard" | "other">("standard");

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)] w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Solicitudes</h2>
      </div>

      <Tabs
        defaultValue="standard"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "standard" | "other")}
        className="h-full flex flex-col"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="standard">Solicitudes</TabsTrigger>
          <TabsTrigger value="other">Solicitudes Especiales</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="flex-1 flex flex-col h-[calc(100vh-210px)] w-full">
          {standardTable}
        </TabsContent>

        <TabsContent value="other" className="flex-1 flex flex-col h-[calc(100vh-210px)] w-full">
          {otherTable}
        </TabsContent>
      </Tabs>
    </div>
  );
}
