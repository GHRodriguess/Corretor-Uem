import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Corretor UEM",
    description: "Corretor provas UEM",
};

export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>{children}</>
    );
}
