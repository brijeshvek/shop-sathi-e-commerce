"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template({ children }) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <div key={key} className="animate-fade-in w-full h-full flex flex-col">
      {children}
    </div>
  );
}
