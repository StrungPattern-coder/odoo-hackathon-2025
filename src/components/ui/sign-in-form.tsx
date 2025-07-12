

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      // Bypass authentication and go directly to admin dashboard
      router.push("/admin");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--card)] p-8 rounded-lg shadow-lg w-full max-w-md border border-[var(--primary)]"
      >
        <h2 className="text-2xl font-bold mb-6 text-[var(--primary)]">Sign In to SkillSync</h2>
        <div className="mb-4">
          <label className="block mb-2 text-[var(--highlight)]" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-[var(--secondary)] bg-[var(--background)]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-[var(--highlight)]" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-[var(--secondary)] bg-[var(--background)]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[var(--accent)] text-[var(--background)] font-semibold rounded hover:bg-[var(--primary)] transition"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};
