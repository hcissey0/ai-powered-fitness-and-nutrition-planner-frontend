"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}



export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  
  const classes = {
    green: "bg-green-950",
    rose: "bg-rose-950",
    blue: "bg-blue-950",
    dark: "bg-black",
    light: "bg-zinc-600"
  }
   React.useEffect(() => {
     Object.keys(classes).map((k) =>
       window.document.body.classList.remove(classes[k as keyof typeof classes])
     );
     window.document.body.classList.add(classes[theme as keyof typeof classes]);
     console.log("theme");
   }, []);

  

  const changeClassTo = (className: keyof typeof classes) => {
    Object.keys(classes).map((k) => window.document.body.classList.remove(classes[k as keyof typeof classes]))
    
    window.document.body.classList.add(classes[className])
    setTheme(className)
    console.log("THeme set to", className)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" /> */}
          {/* <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" /> */}
          <SunMoon />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass">
        <DropdownMenuItem onClick={() => changeClassTo("green")}>
          Green
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeClassTo('rose')}>
          Rose
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeClassTo('blue')}>
          Blue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeClassTo('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeClassTo('dark')}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
