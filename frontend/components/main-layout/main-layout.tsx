import { Navbar } from "@/components/navbar";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
});


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className={`${jakarta.variable} font-sans flex-1`}>
                {children}
            </div>
        </div>
    );
}