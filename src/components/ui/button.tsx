// components/ui/button.tsx
import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
    />
  );
}
