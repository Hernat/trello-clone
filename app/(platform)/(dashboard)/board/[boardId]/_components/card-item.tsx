"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
	data: Card;
	index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
	const cardModal = useCardModal();
	return (
		<Draggable draggableId={data.id} index={index}>
			{(provided) => (
				<div
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					role="button"
					onClick={() => cardModal.onOpen(data.id)}
					className="truncate h-[80px] border-2 border-transparent hover:border-black/50 py-2 px-3 text-sm font-normal bg-white shadow-sm rounded-sm cursor-pointer "
				>
					{data.title}
				</div>
			)}
		</Draggable>
	);
};
