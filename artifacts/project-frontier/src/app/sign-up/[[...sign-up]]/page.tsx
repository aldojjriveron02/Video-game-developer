import { SignUp } from "@clerk/nextjs";
import { AuthShell, authAppearance } from "@/components/frontier/auth-shell";

export default function Page() {
  return (
    <AuthShell>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" fallbackRedirectUrl="/dashboard" appearance={authAppearance} />
    </AuthShell>
  );
}
