'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSearchResult } from '@/features/profile/types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export function UserSearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [message, setMessage] = useState('');

  const searchUsers = async () => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setMessage('Type at least 2 characters.');
      setResults([]);
      return;
    }

    const res = await fetch(`/api/search/users?q=${encodeURIComponent(trimmedQuery)}`);
    const json = (await res.json()) as ApiResponse<UserSearchResult[]>;

    if (!json.success || !json.data) {
      setMessage(json.message || 'Search failed.');
      setResults([]);
      return;
    }

    setResults(json.data);
    setMessage(json.data.length === 0 ? 'No users found.' : '');
  };

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col px-6 py-10 lg:px-8">
      <section className="mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Search
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
          Find a gallery.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
          Search by username, or exact email if you already know it.
        </p>
      </section>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void searchUsers();
            }
          }}
          className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          placeholder="username or exact@email.com"
        />
        <Button className="min-h-11 rounded-lg" onClick={searchUsers}>
          <Search className="size-4" />
          Search
        </Button>
      </div>

      {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}

      <div className="mt-8 grid gap-3">
        {results.map((user) => (
          <article
            key={user.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-muted">
                <UserRound className="size-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-medium text-foreground">{user.displayName}</h2>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <Button asChild variant="outline" className="min-h-11 rounded-lg">
              <Link href={`/${user.username}`}>View Published Photos</Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
