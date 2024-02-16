"use client";

import { Delete, MoreHorizontal, X } from "lucide-react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/delete-board";
import { toast } from "sonner";

interface BoardOptionsProps {
	id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {
	const { execute, isLoading } = useAction(deleteBoard, {
		onError: (error) => {
			toast.error(error);
		},
		onSuccess: () => {
			toast.info("Board deleted");
		},
	});

	const onDelete = () => {
		execute({ id });
	};
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="h-auto w-auto p-2" variant="transparent">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="px-0 pt-3 pb-3"
				side="bottom"
				align="start"
			>
				<div className="text-sm font-medium text-center text-neutral-600 pb-4">
					Board actions
				</div>
				<PopoverClose asChild>
					<Button
						className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
						variant="ghost"
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>
				<div className="flex justify-center">
					<Button
						variant="ghost"
						onClick={onDelete}
						disabled={isLoading}
						className="rounded-sm w-auto h-auto p-2 px-5 justify-end font-normal text-sm bg-rose-200 hover:bg-rose-300 cent"
					>
						Delete this board <Delete size={16} className="mx-4" />
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
