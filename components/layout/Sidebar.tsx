"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome } from "@/components/icons/Icons";
import { currentUser } from "@/lib/mock-data";

const navItems = [{ href: "/", label: "Home", icon: IconHome }];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-white">
			{/* Logo */}
			<div className="flex h-16 items-center gap-3 border-b border-border px-6">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">
					Fh
				</div>
				<div>
					<h1 className="text-base font-semibold text-foreground tracking-tight">
						FeedbackHub
					</h1>
					<p className="text-[11px] text-muted leading-none">
						Team Feedback Platform
					</p>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-3 py-4">
				<ul className="space-y-1">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
										isActive
											? "bg-accent-light text-accent"
											: "text-muted hover:bg-gray-50 hover:text-foreground"
									}`}
								>
									<item.icon
										className={`w-5 h-5 ${isActive ? "text-accent" : ""}`}
									/>
									{item.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Current user */}
			<div className="border-t border-border px-4 py-4">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-light text-accent text-xs font-semibold">
						{currentUser.avatar}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-foreground truncate">
							{currentUser.name}
						</p>
						<p className="text-xs text-muted truncate">{currentUser.role}</p>
					</div>
				</div>
			</div>
		</aside>
	);
}
