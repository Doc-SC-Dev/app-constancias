import { getUserById } from "../actions";
import UserCard from "./_components/user-card";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getUserById(id);
  if (response.isSuccess) return <UserCard user={response.value} />;
}
