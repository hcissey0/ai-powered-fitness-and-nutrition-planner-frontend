
'use client';

import { isBackendUp } from "@/lib/api-service";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ApiStatus({ className }: { className?: string }) {
    const [status, setStatus] = useState<boolean>(false);
    useEffect(() => {
        const checkStatus = async () => {
            const backendStatus = await isBackendUp();
            setStatus(backendStatus);
        };
        checkStatus();
    }, []);

    if (status === true) {
      return <></>
    }

    return (
      <div className={cn(`flex justify-end z-150 ${className ? "":"fixed top-4 right-4"}`, className)}>
        <div
          className={`relative group flex items-center ${
            status ? "text-green-500" : "text-red-500"
          }`}
        >
          <div
            className={`rounded-full h-5 w-5 ${
              status ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <div className="absolute bottom-full top-5 right-1 z-10 mb-2 whitespace-nowrap rounded-lg  text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100 ">
            {status ? "Backend is running" : "Backend is not running"}
          </div>
        </div>
      </div>
    );
}