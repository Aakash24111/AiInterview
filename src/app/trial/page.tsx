import { currentUser } from "@clerk/nextjs/server";

export default async function TrialPage() {
  const user = await currentUser();

  if (!user) {
    return <div>You must be signed in to access this page.</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">
        Welcome, {user.firstName}! You are on the Interview Page.
      </h1>
    </div>
  );
}
