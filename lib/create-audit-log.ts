import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

interface Props {
	action: ACTION;
	entityType: ENTITY_TYPE;
	entityId: string;
	entityTitle: string;
}

export const createAuditLog = async (props: Props) => {
	try {
		const { orgId } = auth();
		const user = await currentUser();

		if (!user || !orgId) {
			throw new Error("User not found");
		}

		const { entityId, entityType, entityTitle, action } = props;

		await db.auditLog.create({
			data: {
				orgId,
				userId: user.id,
				userImage: user?.imageUrl,
				userName: user?.firstName + " " + user?.lastName,
				action,
				entityType,
				entityId,
				entityTitle,
			},
		});
	} catch (error) {
		console.log("🚀 ~ error:", error);
	}
};
