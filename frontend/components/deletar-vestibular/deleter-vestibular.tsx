"use client"

import { Vestibular } from "@/types/vestibular";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export const DeletarVestibular = ({ v }: { v: Vestibular }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/vestibulares/${v.id}/`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            },
        );

        if (res.ok) {
            router.refresh(); 
        }

        setLoading(false);
    }

    return (
        <Button
            onClick={handleDelete}
            disabled={loading}
            variant={"destructive"}
            className="flex cursor-pointer items-center bg-transparent gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
        >
            <Trash2 className="h-3.5 w-3.5" />
            {loading ? "Excluindo..." : "Excluir"}
        </Button>
    );
};