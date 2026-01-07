import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

interface InputPasswordProps extends Omit<React.ComponentProps<"input">, "type"> {
  className?: string
  label?: string
  placeholder?: string
}

function InputPassword({ className, label, placeholder, ...props }: InputPasswordProps) {
  const id = React.useId()
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  return (
    <div className="*:not-first:mt-2">
      {label && <Label htmlFor={id} className="text-white">{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          className={cn("pe-9 bg-white/10 border-white/20 text-white placeholder:text-white/40", className)}
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          {...props}
        />
        <button
          className="text-white/60 hover:text-white focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={
            isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          aria-pressed={isVisible}
          aria-controls={id}
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}

export { Input, InputPassword }
