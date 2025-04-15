import { cn } from "@/lib/utils"
import * as React from "react"

interface InputProps extends React.ComponentProps<"input"> {
  mobileFriendly?: boolean;
}

function Input({ className, type, mobileFriendly = true, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        mobileFriendly ? "h-12 py-2.5 sm:h-10 sm:py-2" : "h-9 py-1", // Mayor altura en móvil
        className
      )}
      // Añadiendo atributos optimizados para móvil
      {...(type === "number" && mobileFriendly ? { inputMode: "numeric", pattern: "[0-9]*" } : {})}
      {...(type === "email" && mobileFriendly ? { inputMode: "email", autoCapitalize: "none", autoCorrect: "off" } : {})}
      {...(type === "tel" && mobileFriendly ? { inputMode: "tel", pattern: "[0-9]*" } : {})}
      {...props}
    />
  )
}

export { Input }
