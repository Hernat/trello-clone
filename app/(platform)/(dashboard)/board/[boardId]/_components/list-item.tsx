"use client";

import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { ListHeader } from "./list-header";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ListItemProps {
	data: ListWithCards;
	index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
	const textareaRef = useRef<ElementRef<"textarea">>(null);
	const [isEditing, setIsEditing] = useState(false);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			textareaRef.current?.focus();
		});
	};

	const disableEditing = () => {
		setIsEditing(false);
	};

	return (
		<Draggable draggableId={data.id} index={index}>
			{(provided) => (
				<li
					{...provided.draggableProps}
					ref={provided.innerRef}
					className=" shrink-0 h-full w-[272px] select-none"
				>
					<div
						{...provided.dragHandleProps}
						className=" w-full rounded-md bg-[#f1f2f3] shadow-md pb-2"
					>
						<ListHeader onAddCard={enableEditing} data={data} />

						<Droppable droppableId={data.id} type="card">
							{(provided) => (
								<ol
									{...provided.droppableProps}
									ref={provided.innerRef}
									className={cn(
										"mx-1 px-1 py-0.5f flex flex-col gap-y-2",
										data.cards.length > 0 ? "mt-2" : "mt-0"
									)}
								>
									{data.cards.map((card, index) => (
										<CardItem
											key={card.id}
											data={card}
											index={index}
										/>
									))}
									{provided.placeholder}
								</ol>
							)}
						</Droppable>

						<CardForm
							listId={data.id}
							ref={textareaRef}
							isEditing={isEditing}
							disableEditing={disableEditing}
							enableEditing={enableEditing}
						/>
					</div>
				</li>
			)}
		</Draggable>
	);
};
