"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ai Interview </h1>

        <SignedOut>
          <SignInButton mode="modal" >
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <button
            onClick={() => router.push("/interview")}
            className="px-6 py-3 bg-green-500 text-white rounded-lg"
          >
            Start Your Interview
          </button>
        </SignedIn>
      </div>
    </main>
  );
}
