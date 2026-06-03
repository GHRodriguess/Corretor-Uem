interface PropriedadesMensagemErro {
    message: string;
}

export function MensagemErro({ message }: PropriedadesMensagemErro) {
    if (!message) return null;

    return (
        <div className="text-destructive bg-destructive/10 border border-destructive/20 text-xs p-3 rounded-xl text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {message}
        </div>
    );
}
