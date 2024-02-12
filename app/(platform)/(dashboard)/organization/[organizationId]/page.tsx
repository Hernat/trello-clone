import { db } from "@/lib/db";

import { Form } from "./form";
import { Board } from "./board";

const OrganizationIdPage = async () => {
	const boards = await db.board.findMany();
	return (
		<div>
			<Form /> 

			<div className="space-y-2">
				{boards.map((board) => {
					return (
						<Board
							key={board.id}
							title={board.title}
							id={board.id}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default OrganizationIdPage;
