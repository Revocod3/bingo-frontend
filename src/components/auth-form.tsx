import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface AuthFormProps extends React.ComponentProps<"div"> {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthForm({
  className,
  title,
  description,
  children,
  ...props
}: AuthFormProps) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

// TODO 2: Replace the RegisterForm component with the AuthForm component in the RegisterPage component