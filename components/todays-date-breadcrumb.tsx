// components/todays-date-breadcrumb.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "./ui/separator";

export function TodaysDateBreadcrumb() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toDateString());
  }, []);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-xl font-extrabold">FitPal</BreadcrumbPage>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <BreadcrumbPage>{date}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
