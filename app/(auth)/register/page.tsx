import { redirectIfAuthenticated } from "@/lib/redirectIfAuthenticated";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  await redirectIfAuthenticated(); // if logged in → redirect
  return <RegisterForm />;
}
