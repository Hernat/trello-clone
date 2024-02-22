import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";
import Link from "next/link";

export async function generateMetadata({
	params,
}: {
	params: { boardId: string };
}) {
	const { orgId } = auth();

	if (!orgId) {
		return {
			title: "Board",
		};
	}

	const board = await db.board.findUnique({
		where: {
			id: params.boardId,
			orgId,
		},
	});

	return {
		title: board?.title || "Board",
	};
}

const BoardIdLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { boardId: string };
}) => {
	const { orgId } = auth();

	if (!orgId) {
		return redirect("/select-org");
	}

	const board = await db.board.findUnique({
		where: {
			id: params.boardId,
			orgId,
		},
	});

	if (!board) {
		notFound();
	}

	return (
		<div
			className="relative h-full bg-no-repeat bg-cover bg-center"
			style={{ backgroundImage: `url(${board?.imageFullUrl})` }}
		>
			<BoardNavbar data={board} />
			<div className="absolute inset-0 bg-black bg-opacity-50" />
			<main className="relative pt-28 h-full">{children}</main>

			<Link
				href={board?.imageLinkHTML}
				className="fixed bottom-0 right-0 p-4 text-slate-200"
				target="_blank"
			>
				<p className="text-sm font-normal hover:underline">
					{board?.imageUserName} on Pixels
				</p>
			</Link>
		</div>
	);
};

export default BoardIdLayout;

{
	/* <div className="relative h-full">
	<div
		className="absolute inset-0 bg-no-repeat bg-cover bg-center filter blur-sm"
		style={{ backgroundImage: `url(${board?.imageFullUrl})` }}
	></div>
	<div className="absolute inset-0 bg-black bg-opacity-50 filter  blur-sm"></div>
	<BoardNavbar />
	<main className="relative pt-28 h-full text-white">{children}</main>
</div>; */
}
