import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Crea una cuenta</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Completa el formulario para registrarte y comenzar
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <Input id="password" type="password" className="w-full" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</Label>
                <Input id="confirmPassword" type="password" className="w-full" required />
              </div>
              <div className="space-y-2 pt-2">
                <Button 
                  type="submit"
                  className="w-full font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                >
                  Registrarse
                </Button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-foreground/20"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">o continuar con</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#7C3AED] text-[#8B5CF6] hover:bg-[#2D2658] hover:text-white cursor-pointer"
                  >
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-[#7C3AED] text-[#8B5CF6] hover:bg-[#2D2658] hover:text-white cursor-pointer"
                  >
                    Facebook
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="font-medium text-[#8B5CF6] hover:text-[#6D28D9] transition-colors">
                Inicia sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
