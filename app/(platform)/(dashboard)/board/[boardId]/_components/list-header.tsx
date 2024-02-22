"use client";

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { ListOptions } from "./list-options";
import { Edit2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListHeaderProps {
	data: List;
	onAddCard: () => void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
	const [title, setTitle] = useState(data.title);
	const [isEditing, setIsEditing] = useState(false);

	const formRef = useRef<ElementRef<"form">>(null);
	const inputRef = useRef<ElementRef<"input">>(null);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		});
	};

	const disableEditing = () => {
		setIsEditing(false);
	};

	const { execute } = useAction(updateList, {
		onSuccess: (data) => {
			toast.success(`List rename to  "${data.title}"`);
			setTitle(data.title);
			disableEditing();
		},
		onError: (error) => {
			toast.error(error);
		},
	});
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			formRef.current?.requestSubmit();
		}
	};

	useEventListener("keydown", onKeyDown);

	const handleSubmit = (formData: FormData) => {
		const title = formData.get("title") as string;
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		if (title === data.title) {
			return disableEditing();
		}

		execute({ title, id, boardId });
	};

	const onBlur = () => {
		formRef.current?.requestSubmit();
	};

	return (
		<div
			className={cn(
				"py-2 px-2 text-white flex justify-between items-start gap-x-2 bg-slate-600",
				data.order === 1 && "bg-sky-600",
				data.order === 2 && "bg-yellow-500",
				data.order === 3 && "bg-emerald-600"
			)}
		>
			{isEditing ? (
				<form
					action={handleSubmit}
					ref={formRef}
					className="flex-1 px-[2px]"
				>
					<input
						type="text"
						hidden
						id="id"
						name="id"
						value={data.id}
					/>
					<input
						type="text"
						hidden
						id="boardId"
						name="boardId"
						value={data.boardId}
					/>
					<FormInput
						ref={inputRef}
						onBlur={onBlur}
						id="title"
						placeholder=" Enter list title..."
						defaultValue={title}
						className="text-base px-[7px] py-1 h-6 text-black font-medium border-transparent hover:border-input/50 focus:border-input transition truncate bg-transparent focus:bg-white "
					/>
					<button type="submit" hidden />
				</form>
			) : (
				<div
					onClick={enableEditing}
					className="w-full text-base px-2.5 py-1 h-7 font-medium border-transparent cursor-pointer flex items-center hover:bg-transparent/10 rounded-sm"
				>
					{title}
					<Edit2Icon className="inline w-2 h-2 ml-2" />
				</div>
			)}

			<ListOptions onAddCard={onAddCard} data={data} />
		</div>
	);
};
