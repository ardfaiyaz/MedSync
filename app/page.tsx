import { redirect } from "next/navigation";

export default function Home() {
  // Landing page should be the login screen
  redirect("/login");
}
