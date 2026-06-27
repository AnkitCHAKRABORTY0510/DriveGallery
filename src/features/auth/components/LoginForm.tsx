'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export function LoginForm() {
  return (
    <div className="flex flex-col w-full">
      <div className="mb-10 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-6">
          Studio Access
        </p>
        <h1 className="font-serif text-5xl tracking-tight text-white mb-8">
          Sign in
        </h1>
      </div>

      <div className="flex flex-col space-y-6">
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full rounded-lg border border-zinc-800 bg-[#0f0f0f] py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          Continue with Google
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="mx-4 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Or Email
          </span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-zinc-800 bg-[#0f0f0f] px-4 py-3.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-800 bg-[#0f0f0f] px-4 py-3.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            disabled
          />
          <button
            type="button"
            className="w-full rounded-lg bg-zinc-100 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={() => alert('Email authentication is disabled in DriveGallery. Please use Google OAuth to maintain image ownership.')}
          >
            Sign in
          </button>
        </form>

        <div className="mt-8 text-center pt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors">
            Need an account? Create one
          </p>
        </div>

        <div className="mt-12 text-center pt-10">
          <Link 
            href="/"
            className="inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span className="mr-2">←</span> Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
