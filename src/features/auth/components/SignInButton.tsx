'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';

export function SignInButton() {
  return (
    <button
      onClick={() => signIn('google')}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Sign in with Google
    </button>
  );
}
