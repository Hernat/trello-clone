"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

interface FormSubmitProps {
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| "primary";
}
export const FormSubmit = ({
	children,
	disabled,
	className,
	variant = "primary",
}: FormSubmitProps) => {
	const { pending } = useFormStatus();

	return (
		<Button
			disabled={disabled || pending}
			className={cn(className)}
			type="submit"
			variant={variant}
			size="sm"
		>
			{children}
		</Button>
	);
};
