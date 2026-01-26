"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabItem<T extends string> = {
  value: T;
  label: string;
  component: ReactNode;
};

type AdminTabsProps<T extends string> = {
  tabs: readonly TabItem<T>[];
};

export default function AdminTabs<T extends string>({
  tabs,
}: AdminTabsProps<T>) {
  const searchParam = useSearchParams();
  const router = useRouter();
  const tab = searchParam.get("tab") || "director";

  return (
    <Tabs value={tab} className="h-2/3">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={`tab-trigger-${tab.value}`}
            value={tab.value}
            onClick={() => router.replace(`/admin?tab=${tab.value}`)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={`tab-content-${tab.value}`} value={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
