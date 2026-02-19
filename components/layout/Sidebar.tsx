"use client";

import { usePathname } from "next/navigation";
import {
	IoHomeOutline,
	IoChatbubbleOutline,
	IoCalendarOutline,
	IoClipboardOutline,
} from "react-icons/io5";

const mainNavItems = [
	{ href: "#", label: "Home", icon: IoHomeOutline },
	{ href: "/", label: "Feedbacks", icon: IoChatbubbleOutline },
	{ href: "#calendario", label: "Calendar", icon: IoCalendarOutline },
	{ href: "#progetti", label: "Projects", icon: IoClipboardOutline },
];

function IconSettings({ className = "w-5 h-5" }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
}

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-white">
			{/* Logo */}
			<div className="flex h-16 items-center gap-3 border-b border-border px-6">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-800 text-white font-bold text-sm">
					HB
				</div>
				<div>
					<h1 className="text-base font-semibold text-foreground tracking-tight">
						Hubby
					</h1>
					<p className="text-[11px] text-muted leading-none">TeamSystem</p>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-3 py-4">
				<ul className="space-y-1">
					{mainNavItems.map((item) => {
						const isActive = item.href === "/" && pathname === "/";
						const isPlaceholder = item.href.startsWith("#");
						return (
							<li key={item.label}>
								{isPlaceholder ? (
									<span className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-gray-50 hover:text-foreground transition-all cursor-default">
										<item.icon className="w-5 h-5" />
										{item.label}
									</span>
								) : (
									<a
										href={item.href}
										className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
											isActive
												? "bg-sky-100 text-sky-800"
												: "text-muted hover:bg-gray-50 hover:text-foreground"
										}`}
									>
										<item.icon
											className={`w-5 h-5 ${isActive ? "text-sky-800" : ""}`}
										/>
										{item.label}
									</a>
								)}
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Settings */}
			<div className="border-t border-border px-3 py-3">
				<span className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-gray-50 hover:text-foreground transition-all cursor-default">
					<IconSettings className="w-5 h-5" />
					Settings
				</span>
			</div>
		</aside>
	);
}
