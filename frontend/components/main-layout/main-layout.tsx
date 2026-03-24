import { Navbar } from "@/components/navbar";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
});


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <div className={`${jakarta.variable} font-sans h-full flex-1 overflow-auto`}>
                {children}
            </div>
        </div>
    );
}