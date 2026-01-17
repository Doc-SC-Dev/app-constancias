import { getUserById } from "../actions";
import UserCard from "./_components/user-card";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);
  return <UserCard user={user} />;
}
