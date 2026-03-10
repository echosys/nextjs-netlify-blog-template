import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.has("auth");
    if (isLoggedIn) {
        redirect("/mongo");
    } else {
        redirect("/login");
    }
}

