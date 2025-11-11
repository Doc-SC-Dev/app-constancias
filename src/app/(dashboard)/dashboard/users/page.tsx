import { DataTable } from "../_components/data-table";
import { columns } from "./colums";
import { UsersEmpty } from "./users-empty";

export default function UsersPage() {
  const data = [
    {
      name: "Tomas Alonso Bravo Cañete",
      id: "a;klaksjdflkajsdflkj",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "tomas.b.c@outlook.com",
      emailVerified: true,
      banned: false,
      role: "admin",
      rut: "20.488.616-4",
    },
    {
      name: "Tomas Alonso Bravo Cañete",
      id: "a;klaksjdflkajsdflkj",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "tomas.b.c@outlook.com",
      emailVerified: true,
      banned: true,
      role: "student",
      rut: "20.488.616-4",
    },
    {
      name: "Tomas Alonso Bravo Cañete",
      id: "kkkkkkllllllmmmlll",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "tomas.b.c@outlook.com",
      emailVerified: true,
      banned: true,
      role: "professor",
      rut: "20.488.616-4",
    },
    {
      name: "Tomas Alonso Bravo Cañete",
      id: "a;klaksjdflkajsdflkj",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "tomyalonsobravo@gmail.com",
      emailVerified: true,
      banned: false,
      role: "sub_admin",
      rut: "20.488.616-4",
    },
  ];
  if (!data.length) {
    return <UsersEmpty />;
  }
  return <DataTable columns={columns} data={data} />;
}
