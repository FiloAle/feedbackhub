"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppShellProps {
	children: React.ReactNode;
	title: string;
	subtitle?: string;
	onWeeklyReminderClick?: () => void;
}

export default function AppShell({
	children,
	title,
	subtitle,
	onWeeklyReminderClick,
}: AppShellProps) {
	return (
		<div className="flex min-h-screen bg-white">
			<Sidebar />
			<div className="flex flex-1 flex-col pl-64">
				<Header
					title={title}
					subtitle={subtitle}
					onWeeklyReminderClick={onWeeklyReminderClick}
				/>
				<main className="flex-1 p-8">{children}</main>
			</div>
		</div>
	);
}
