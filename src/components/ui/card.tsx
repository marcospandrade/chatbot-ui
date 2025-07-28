import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white rounded-2xl shadow p-4">{children}</div>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-2 space-y-2">{children}</div>;
}
