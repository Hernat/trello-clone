"use client";

import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { CircleFadingPlus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ListWrapper } from "./list-wrapper";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

export const ListForm = () => {
	const router = useRouter();

	const params = useParams();
	const [isEditing, setIsEditing] = useState(false);

	const formRef = useRef<ElementRef<"form">>(null);
	const inputRef = useRef<ElementRef<"input">>(null);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
		});
	};

	const disableEditing = () => {
		setIsEditing(false);
	};

	const { execute, fieldErrors } = useAction(createList, {
		onSuccess: (data) => {
			toast.success(`List "${data.title}" created`);
			disableEditing();
			router.refresh();
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			disableEditing();
		}
	};

	useEventListener("keydown", onKeyDown);
	useOnClickOutside(formRef, disableEditing);

	const onSubmit = (formData: FormData) => {
		const title = formData.get("title") as string;
		const boardId = formData.get("boardId") as string;

		execute({ title, boardId });
	};

	if (isEditing) {
		return (
			<ListWrapper>
				<form
					action={onSubmit}
					ref={formRef}
					className="w-full bg-white p-3 space-y-3 shadow-sm rounded-sm"
				>
					<FormInput
						ref={inputRef}
						errors={fieldErrors}
						id="title"
						className=" text-sm px-2 py-1 h-7 font-light border-transparent hover:border-input focus:border-input transition"
						placeholder="Enter list title..."
					/>
					<input hidden value={params.boardId} name="boardId" />
					<div className="flex items-center gap-x-1 ">
						<FormSubmit className="font-light">
							<CircleFadingPlus className="h-4 w-4 mr-2" />
							Add list
						</FormSubmit>
						<Button
							onClick={disableEditing}
							size="sm"
							variant="ghost"
							className="flex"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</form>
			</ListWrapper>
		);
	}

	return (
		<ListWrapper>
			<button
				onClick={enableEditing}
				className=" w-auto rounded-sm bg-sky-600 hover:bg-sky-600/50 text-white transition flex items-center font-light text-sm p-3"
			>
				<CircleFadingPlus className="h-4 w-4 mr-2" /> New list
			</button>
		</ListWrapper>
	);
};
