import { VerifyEmailForm } from "@/components/verify-email-form"

export default function VerifyEmailPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <VerifyEmailForm />
      </div>
    </div>
  )
}
