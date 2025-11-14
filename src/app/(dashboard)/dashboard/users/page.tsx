import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import { DataTable } from "@/components/data-table";
import type { auth } from "@/lib/auth";
import type { User } from "@/lib/types/users";
import DropdownDialog from "./_components/dropdown-dialog";
import { columns } from "./colums";
import { UsersEmpty } from "./users-empty";

export default async function UsersPage() {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  // if (!session) {
  //   redirect("/login");
  // }
  // const permission = await auth.api.userHasPermission({
  //   body: {
  //     userId: session.user.id,
  //     permissions: { user: ["list"] },
  //   },
  // });
  // if (!permission) {
  //   redirect("/dashboard");
  // }
  // const data = await auth.api.listUsers({
  //   headers: await headers(),
  //   query: {},
  // });
  // if (!data.total || !data.users) {
  //   return <UsersEmpty />;
  // }
  const data: { users: User[] } = {
    users: [
      {
        id: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "tomas.b.c@outlook.com",
        emailVerified: true,
        name: "Tomás Alonso Bravo Cañete",
        rut: "20.488.616-4",
        banned: false,
        role: "admin",
      },
    ],
  };
  return (
    <DataTable<User, unknown> columns={columns} data={data.users}>
      <DropdownDialog />
    </DataTable>
  );
}
