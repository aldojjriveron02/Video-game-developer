import { SignIn } from "@clerk/nextjs";
import { AuthShell, authAppearance } from "@/components/frontier/auth-shell";

export default function Page() {
  return (
    <AuthShell>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" appearance={authAppearance} />
    </AuthShell>
  );
}
