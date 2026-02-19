"use client";

import { IconBell } from "@/components/icons/Icons";
import { currentUser } from "@/lib/mock-data";

interface HeaderProps {
	title: string;
	subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
	return (
		<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-8">
			<div>
				<h2 className="text-lg font-semibold text-foreground tracking-tight">
					{title}
				</h2>
				{subtitle && <p className="text-sm text-muted">{subtitle}</p>}
			</div>

			<div className="flex items-center gap-4">
				{/* Notification bell */}
				<button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-muted hover:text-foreground transition-colors">
					<IconBell className="w-5 h-5" />
					<span className="absolute right-1.5 top-1.5 flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full rounded-full bg-accent-medium opacity-75 animate-ping" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-accent-medium" />
					</span>
				</button>

				{/* User avatar */}
				<div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white text-xs font-semibold cursor-pointer hover:opacity-90">
					{currentUser.avatar}
				</div>
			</div>
		</header>
	);
}
