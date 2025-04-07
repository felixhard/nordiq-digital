import clsx from "clsx";

type InputProps = {
    label?: string;
    name: string;
    type?: string;
    value?: string;
    className?: string;
    placeholder: string;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    autoComplete?: string;
    autoFocus?: boolean;
};

export default function Input({
    onChange,
    label,
    name,
    type = "text",
    placeholder,
    className,
    value,
    onBlur,
    error,
    autoComplete,
    autoFocus,
}: InputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <p className="text-[14px] font-medium">{label}</p>}

            <input
                className={clsx(
                    "bg-background border border-border rounded-lg px-2 py-2 text-white-100 placeholder:text-sm placeholder:text-content/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-inset focus:border-border transition-colors",
                    error && "border-red-500 focus:ring-red-500/50",
                    className
                )}
                onChange={onChange}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                onBlur={onBlur}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
