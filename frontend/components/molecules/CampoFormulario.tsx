import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PropriedadesCampoFormulario {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export function CampoFormulario({
    label,
    type,
    placeholder,
    value,
    onChange,
    required = false,
}: PropriedadesCampoFormulario) {
    const lidarComMudanca = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className="space-y-2">
            <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/80">
                {label}
            </Label>
            <Input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={lidarComMudanca}
                className="bg-card/30 border-input text-foreground placeholder:text-muted-foreground/45 rounded-xl h-11 focus-visible:ring-ring/50 focus-visible:border-ring transition-all duration-200"
                required={required}
            />
        </div>
    );
}
