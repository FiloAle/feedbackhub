"use client";

import { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { currentUser } from "@/lib/mock-data";

interface HeaderProps {
	title: string;
	subtitle?: string;
	onWeeklyReminderClick?: () => void;
}

interface Notification {
	id: string;
	type: "request" | "reminder" | "info";
	message: string;
	time: string;
	read: boolean;
}

const mockNotifications: Notification[] = [
	{
		id: "n1",
		type: "request",
		message: "Giulia Conti requested feedback on AXA Mobile App (1 attachment)",
		time: "10 mins ago",
		read: false,
	},
	{
		id: "n2",
		type: "request",
		message: "Luca Ferrari requested feedback on Eni Ad Campaign",
		time: "1 hour ago",
		read: false,
	},
	{
		id: "n3",
		type: "reminder",
		message: "Complete mandatory weekly feedback before Friday",
		time: "2 hours ago",
		read: false,
	},
	{
		id: "n4",
		type: "info",
		message: "Elena Bianchi marked your feedback as useful",
		time: "Yesterday",
		read: true,
	},
	{
		id: "n5",
		type: "request",
		message: "Andrea Moretti requested feedback on MedioBanca Website",
		time: "Yesterday",
		read: true,
	},
];

export default function Header({
	title,
	subtitle,
	onWeeklyReminderClick,
}: HeaderProps) {
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const [notifications, setNotifications] = useState(mockNotifications);
	const panelRef = useRef<HTMLDivElement>(null);

	const unreadCount = notifications.filter((n) => !n.read).length;

	// Close on click outside
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setIsNotifOpen(false);
			}
		};
		if (isNotifOpen) document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [isNotifOpen]);

	const markAllRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	};

	const getIcon = (type: Notification["type"]) => {
		switch (type) {
			case "request":
				return "📩";
			case "reminder":
				return "⏰";
			case "info":
				return "💡";
		}
	};

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
				<div className="relative" ref={panelRef}>
					<button
						onClick={() => setIsNotifOpen(!isNotifOpen)}
						className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-muted hover:text-foreground transition-colors cursor-pointer"
					>
						<IoNotificationsOutline className="w-5 h-5" />
						{unreadCount > 0 && (
							<span className="absolute right-1.5 top-1.5 flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75 animate-ping" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
							</span>
						)}
					</button>

					{/* Notification panel */}
					{isNotifOpen && (
						<div className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-2xl border border-border shadow-xl animate-fade-in overflow-hidden">
							<div className="flex items-center justify-between px-5 py-3 border-b border-border">
								<h3 className="text-sm font-semibold text-foreground">
									Notifications
								</h3>
								{unreadCount > 0 && (
									<button
										onClick={markAllRead}
										className="text-xs text-sky-800 hover:text-sky-900 font-medium transition-colors"
									>
										Mark all as read
									</button>
								)}
							</div>
							<div className="max-h-[360px] overflow-y-auto custom-scrollbar">
								{notifications.map((notif) => (
									<button
										key={notif.id}
										onClick={() => {
											// Mark as read
											setNotifications((prev) =>
												prev.map((n) =>
													n.id === notif.id ? { ...n, read: true } : n,
												),
											);
											if (notif.type === "reminder" && onWeeklyReminderClick) {
												onWeeklyReminderClick();
												setIsNotifOpen(false);
											}
										}}
										className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50 ${
											!notif.read ? "bg-sky-50/50" : ""
										}`}
									>
										<span className="text-lg mt-0.5 shrink-0">
											{getIcon(notif.type)}
										</span>
										<div className="flex-1 min-w-0">
											<p
												className={`text-sm leading-snug ${
													!notif.read
														? "text-foreground font-medium"
														: "text-foreground/70"
												}`}
											>
												{notif.message}
											</p>
											<p className="text-xs text-muted mt-1">{notif.time}</p>
										</div>
										{!notif.read && (
											<span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-800" />
										)}
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* User avatar */}
				<div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-800 text-white text-xs font-semibold cursor-pointer hover:opacity-90">
					{currentUser.avatar}
				</div>
			</div>
		</header>
	);
}
