import { School } from "lucide-react";

export function Logo() {
    return (
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center border border-primary/20 shadow-md transition-all duration-300 hover:scale-105">
            <School className="text-primary size-6" />
        </div>
    );
}
