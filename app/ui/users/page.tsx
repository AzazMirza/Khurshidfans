// app/users/page.tsx
import { UsersTable } from '@/app/ui/users/table';

export const metadata = {
  title: 'Users | AIRION Admin',
};

export default async function UsersPage({
  searchParams: { query, page, totalPages } = {},
}: {
  searchParams?: { query?: string; page?: string; totalPages?: number };
}) {

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">
          Manage and review user accounts and activity.
        </p>
      </div>

      {/* ✅ Only pass users — all interactivity happens client-side */}
      <UsersTable searchParams={{ query, page, totalPages }}  />
    </div>
  );
}
