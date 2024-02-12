import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/actions/delete-board";

interface BoardProps {
	title: string;
	id: string;
}

export const Board = ({ title, id }: BoardProps) => {
	const handleDelete = deleteBoard.bind(null, id);

	return (
		<form action={handleDelete}>
			<p className="mx-2">
				Board name : {title}
				<Button
					type="submit"
					variant="destructive"
					size="sm"
					className="mx-2"
				>
					Delete
				</Button>
			</p>
		</form>
	);
};
