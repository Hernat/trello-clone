import { Sidebar } from "../_components/sidebar";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="pt-20 md:pt-24 pr-4 pl-6 w-full max-w-6xl 2xl:max-w-screen-2xl  ">
			<div className="flex gap-x-7">
				<div className="w-64 shrink-0 hidden md:block">
					<Sidebar />
				</div>
				{children}
			</div>
		</main>
	);
};

export default OrganizationLayout;
