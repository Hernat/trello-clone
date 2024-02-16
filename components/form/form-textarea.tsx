"use client";

import { cn } from "@/lib/utils";
import { KeyboardEventHandler, forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormErrors } from "./form-errors";

interface FormTextareaProps {
	id: string;
	label?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	errors?: Record<string, string[] | undefined>;
	onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
	defaultValue?: string;
	onBlur?: () => void;
	onClick?: () => void;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
	(
		{
			id,
			label,
			placeholder,
			required,
			disabled,
			className,
			errors,
			defaultValue,
			onKeyDown,
			onClick,
			onBlur,
		},
		ref
	) => {
		const { pending } = useFormStatus();
		return (
			<div className="space-y-2 w-full">
				<div className="space-y-1 w-full">
					{label ? (
						<Label
							htmlFor={id}
							className="text-sm font-semibold text-neutral-700"
						>
							{label}
						</Label>
					) : null}
					<Textarea
						onKeyDown={onKeyDown}
						onClick={onClick}
						id={id}
						ref={ref}
						placeholder={placeholder}
						required={required}
						disabled={pending || disabled}
						name={id}
						onBlur={onBlur}
						className={cn(
							"resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
							className
						)}
						aria-describedby={`${id}-error`}
						defaultValue={defaultValue}
					/>
				</div>

				<FormErrors id={id} errors={errors!} />
			</div>
		);
	}
);

FormTextarea.displayName = "FormTextarea";
