import React from "react";
import { Loader2 } from "lucide-react"; 

const LoadingComponent = ({ message = "Carregando..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-400">
            <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
            <p className="text-lg font-medium">{message}</p>
        </div>
    );
};

export default LoadingComponent;
