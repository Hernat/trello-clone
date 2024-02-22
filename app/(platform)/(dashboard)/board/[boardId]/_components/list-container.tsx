"use client";

import { useAction } from "@/hooks/use-action";
import { ListWithCards } from "@/types";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { updateListOrder } from "@/actions/update-list-order";
import { cn } from "@/lib/utils";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
	boardId: string;
	data: ListWithCards[];
}

/**
 * Reorders a list by moving an element from one index to another.
 *
 * @param {T[]} list - the original list
 * @param {number} startIndex - the index of the element to move
 * @param {number} endIndex - the index where the element should be moved to
 * @return {T[]} the reordered list
 */
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
	const [orderedData, setOrderedData] = useState(data);

	const {
		execute: executeUpdateListOrder,
		isLoading: isLoadingUpdateListOrder,
	} = useAction(updateListOrder, {
		onSuccess: () => {
			toast.success("List order updated");
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const {
		execute: executeUpdateCardOrder,
		isLoading: isLoadingUpdateCardOrder,
	} = useAction(updateCardOrder, {
		onSuccess: (data) => {
			const title = orderedData.find(
				(list) => list.id === data[0].listId
			)?.title;
			toast.success(`Card moved to "${title}" list`);
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	useEffect(() => {
		setOrderedData(data);
	}, [data]);

	const onDragEnd = (result: DragResult) => {
		const { destination, source, type } = result;

		if (!destination) {
			return;
		}

		//Dropped in same position
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		//User moves a List

		if (type === "list") {
			const items = reorder(
				orderedData,
				source.index,
				destination.index
			).map((item, index) => ({
				...item,
				order: index,
			}));

			setOrderedData(items);
			//TODO: Trigger server action
			executeUpdateListOrder({ boardId, items });
		}

		//User moves a Card

		if (type === "card") {
			const newOrderedData = [...orderedData];

			// Source and destination list
			const sourceList = newOrderedData.find(
				(list) => list.id === source.droppableId
			);
			const destList = newOrderedData.find(
				(list) => list.id === destination.droppableId
			);

			if (!sourceList || !destList) {
				return;
			}

			// Check if cards exists on the sourceList
			if (!sourceList.cards) {
				sourceList.cards = [];
			}

			// Check if cards exists on the destList
			if (!destList.cards) {
				destList.cards = [];
			}

			// Moving the card in the same list
			if (source.droppableId === destination.droppableId) {
				const reorderedCards = reorder(
					sourceList.cards,
					source.index,
					destination.index
				);

				reorderedCards.forEach((card, idx) => {
					card.order = idx;
				});

				sourceList.cards = reorderedCards;

				setOrderedData(newOrderedData);

				executeUpdateCardOrder({
					boardId: boardId,
					items: reorderedCards,
				});

				//Move card from one list to another list
			} else {
				//Remove card from source list
				const [movedCard] = sourceList.cards.splice(source.index, 1);

				// Assign the new listId to the moved card
				movedCard.listId = destination.droppableId;

				// Add card to the destination list
				destList.cards.splice(destination.index, 0, movedCard);

				sourceList.cards.forEach((card, idx) => {
					card.order = idx;
				});

				// Update the order for each card in the destination list
				destList.cards.forEach((card, idx) => {
					card.order = idx;
				});

				setOrderedData(newOrderedData);
				executeUpdateCardOrder({
					boardId: boardId,
					items: destList.cards,
				});
			}
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="lists" type="list" direction="horizontal">
				{(provided) => (
					<ol
						{...provided.droppableProps}
						ref={provided.innerRef}
						className={cn(
							"flex gap-x-3 h-full",
							(isLoadingUpdateListOrder ||
								isLoadingUpdateCardOrder) &&
								"animate-pulse "
						)}
					>
						{orderedData.map((list, index) => (
							<ListItem key={list.id} data={list} index={index} />
						))}
						{provided.placeholder}
						<ListForm />
						<div className="flex-shrink-0 w-1" />
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	);
};
