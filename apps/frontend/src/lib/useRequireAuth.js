'use client';
import { useEffect, useState } from 'react';
import { Auth } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function useRequireAuth() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async ()=>{
      try {
        const r = await Auth.me();
        if (!r.user) router.replace('/login');
        else setUser(r.user);
      } catch {
        router.replace('/login');
      } finally { setReady(true); }
    })();
  }, [router]);

  return { user, ready };
}
