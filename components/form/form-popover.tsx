"use client";

import { createBoard } from "@/actions/create-board";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { FormInput } from "./form-input";
import { FormPicker } from "./form-picker";
import { FormSubmit } from "./form-submit";

interface FormPopoverProps {
	children: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	align?: "center" | "start" | "end";
	sideOffset?: number;
}

export const FormPopover = ({
	children,
	side = "bottom",
	align,
	sideOffset = 0,
}: FormPopoverProps) => {
	const router = useRouter();
	const closeRef = useRef<ElementRef<"button">>(null);

	const { execute, fieldErrors } = useAction(createBoard, {
		onSuccess: (data) => {
			toast.success("Board created");
			closeRef.current?.click();
			router.push(`/board/${data.id}`);
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onSubmit = (formData: FormData) => {
		const title = formData.get("title") as string;
		const image = formData.get("image") as string;

		execute({ title, image });
	};

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				sideOffset={sideOffset}
				side={side}
				align={align}
				className="w-80 pt-3"
			>
				<div className="text-sm font-medium text-center text-neutral-700 pb-4">
					Create board
				</div>
				<PopoverClose ref={closeRef} asChild>
					<Button
						className="h-auto p-2 absolute top-2 right-2 text-neutral-600"
						variant="ghost"
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>
				<form action={onSubmit} className="space-y-4">
					<div className="space-y-4">
						<FormPicker id="image" errors={fieldErrors} />
						<FormInput
							id="title"
							label="Board title"
							type="text"
							placeholder="Enter board title"
							errors={fieldErrors}
							required
						/>
					</div>
					<FormSubmit className="w-full">Create</FormSubmit>
				</form>
			</PopoverContent>
		</Popover>
	);
};
