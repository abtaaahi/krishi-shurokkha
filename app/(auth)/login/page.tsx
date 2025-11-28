// app/(auth)/login/page.tsx
import { redirectIfAuthenticated } from "@/lib/redirectIfAuthenticated";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return <LoginForm />;
}
