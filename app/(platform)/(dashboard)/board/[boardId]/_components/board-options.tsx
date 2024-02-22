"use client";

import { MoreHorizontal, TrashIcon, X } from "lucide-react";

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
				<div className="text-sm font-extralight text-center text-neutral-600 pb-4">
					Board actions
				</div>
				<Separator />
				<PopoverClose asChild>
					<Button
						className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
						variant="ghost"
					>
						<X className="h-4 w-4" />
					</Button>
				</PopoverClose>

				<Button
					variant="ghost"
					onClick={onDelete}
					disabled={isLoading}
					className="rounded-sm w-full h-auto  justify-start font-light text-sm"
				>
					<TrashIcon className="h-4 w-4 mr-2" /> Delete this board
				</Button>
			</PopoverContent>
		</Popover>
	);
};
