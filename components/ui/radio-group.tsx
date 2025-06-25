"use client";

import * as React from "react";
import { CircleIcon } from "lucide-react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-white/30 text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        "hover:border-primary/50 hover:bg-primary/10",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <CircleIcon className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

// "use client"

// import * as React from "react"
// import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
// import { CircleIcon } from "lucide-react"

// import { cn } from "@/lib/utils"

// function RadioGroup({
//   className,
//   ...props
// }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
//   return (
//     <RadioGroupPrimitive.Root
//       data-slot="radio-group"
//       className={cn("grid gap-3", className)}
//       {...props}
//     />
//   )
// }

// function RadioGroupItem({
//   className,
//   ...props
// }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
//   return (
//     <RadioGroupPrimitive.Item
//       data-slot="radio-group-item"
//       className={cn(
//         "border-neutral-200 text-neutral-900 focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:bg-neutral-200/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:text-neutral-50 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 dark:dark:bg-neutral-800/30",
//         className
//       )}
//       {...props}
//     >
//       <RadioGroupPrimitive.Indicator
//         data-slot="radio-group-indicator"
//         className="relative flex items-center justify-center"
//       >
//         <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
//       </RadioGroupPrimitive.Indicator>
//     </RadioGroupPrimitive.Item>
//   )
// }

// export { RadioGroup, RadioGroupItem }
