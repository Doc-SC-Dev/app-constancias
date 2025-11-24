"use client";
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ForgotPasswordCard from "./forgot-password-card";
import LoginCard from "./login-card";

type Tab = "login" | "fogot";

export default function CardTabs() {
  const [tab, setTab] = useState<Tab>("login");
  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
      <TabsContent value="login">
        <LoginCard goToTab={() => setTab("fogot")} />
      </TabsContent>
      <TabsContent value="fogot">
        <ForgotPasswordCard goToTab={() => setTab("login")} />
      </TabsContent>
    </Tabs>
  );
}
