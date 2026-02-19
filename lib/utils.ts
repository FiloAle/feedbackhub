import { User } from "./types";

/**
 * Pick a random person from the team, excluding the current user.
 */
export function getRandomPerson(users: User[], currentUserId: string): User {
	const others = users.filter((u) => u.id !== currentUserId);
	return others[Math.floor(Math.random() * others.length)];
}

/**
 * Format an ISO date to a human-readable string.
 */
export function formatDate(iso: string): string {
	const d = new Date(iso);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (d.toDateString() === today.toDateString()) {
		return "Today";
	} else if (d.toDateString() === yesterday.toDateString()) {
		return "Yesterday";
	} else {
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	}
}

/**
 * Format an ISO date to relative time (e.g., "2 ore fa").
 */
export function timeAgo(iso: string): string {
	const now = new Date();
	const date = new Date(iso);
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	const diffH = Math.floor(diffMin / 60);
	const diffD = Math.floor(diffH / 24);

	if (diffMin < 1) return "just now";
	if (diffMin < 60) return `${diffMin} mins ago`;
	if (diffH < 24) return `${diffH} hours ago`;
	if (diffD < 7) return `${diffD} days ago`;
	return formatDate(iso);
}

/**
 * Get initials from a full name.
 */
export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Get a color class for a task status chip.
 */
export function getStatusColor(status: string): string {
	switch (status) {
		case "done":
			return "bg-emerald-100 text-emerald-700";
		case "in-progress":
			return "bg-sky-100 text-sky-800";
		case "review":
			return "bg-amber-100 text-amber-700";
		case "todo":
			return "bg-gray-100 text-gray-600";
		default:
			return "bg-gray-100 text-gray-600";
	}
}

/**
 * Get label for a task status.
 */
export function getStatusLabel(status: string): string {
	switch (status) {
		case "done":
			return "Completed";
		case "in-progress":
			return "In Progress";
		case "review":
			return "In Review";
		case "todo":
			return "To Do";
		default:
			return status;
	}
}
