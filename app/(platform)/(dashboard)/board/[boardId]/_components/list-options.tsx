"use client";

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import {
	CircleFadingPlusIcon,
	CopyIcon,
	MoreHorizontal,
	Trash,
	X,
} from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
	data: List;
	onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
	const closeRef = useRef<ElementRef<"button">>(null);

	const { execute: executeDelete } = useAction(deleteList, {
		onSuccess: (data) => {
			toast.success(`List "${data.title}" deleted`);
			closeRef.current?.click();
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const { execute: executeCopy } = useAction(copyList, {
		onSuccess: (data) => {
			toast.success(`List "${data.title}" copied`);
			closeRef.current?.click();
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onDelete = (formData: FormData) => {
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		executeDelete({ id, boardId });
	};

	const onCopy = (formData: FormData) => {
		const id = formData.get("id") as string;
		const boardId = formData.get("boardId") as string;

		executeCopy({ id, boardId });
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className="w-auto h-auto p-2 hover:bg-transparent/10 hover:text-white"
					variant="ghost"
				>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="px-0 pt-3 pb-3"
				side="bottom"
				align="start"
			>
				<div className="text-sm font-extralight text-center text-neutral-600 pb-4">
					List Action
				</div>
				<Separator />
				<PopoverClose ref={closeRef} asChild>
					<Button
						className="w-auto h-auto p-2 top-2 right-2 text-neutral-600 absolute"
						variant="ghost"
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>
				<Button
					onClick={onAddCard}
					className="rounded-none w-full h-auto p-2  justify-start font-light text-sm"
					variant="ghost"
				>
					<CircleFadingPlusIcon className="h-4 w-4 mr-4" /> Create
					Card
				</Button>
				<form action={onCopy}>
					<input hidden name="id" id="id" value={data.id} />
					<input
						hidden
						name="boardId"
						id="boardId"
						value={data.boardId}
					/>
					<FormSubmit
						variant="ghost"
						className="rounded-none w-full h-auto p-2  justify-start font-light text-sm "
					>
						<CopyIcon className="h-4 w-4 mr-4" /> Copy list
					</FormSubmit>
				</form>
				<Separator />
				<form action={onDelete}>
					<input hidden name="id" id="id" value={data.id} />
					<input
						hidden
						name="boardId"
						id="boardId"
						value={data.boardId}
					/>
					<FormSubmit
						variant="ghost"
						className="rounded-none w-full h-auto p-2  justify-start font-light text-sm text-red-600 hover:bg-rose-200 hover:text-rose-800"
					>
						<Trash className="h-4 w-4 mr-4" /> Delete
					</FormSubmit>
				</form>
			</PopoverContent>
		</Popover>
	);
};
