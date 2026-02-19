"use client";

import { PersonalFeedback } from "@/lib/types";
import { users } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

interface FeedbackCardProps {
	feedback: PersonalFeedback;
	type: "sent" | "received";
	compact?: boolean;
}

export default function FeedbackCard({
	feedback,
	type,
	compact = false,
}: FeedbackCardProps) {
	const otherUser = users.find(
		(u) =>
			u.id === (type === "received" ? feedback.fromUserId : feedback.toUserId),
	);

	if (!otherUser) return null;

	// Received feedback: anonymous (no name/avatar, no sliders, just emoji + message + date)
	if (type === "received" && compact) {
		return (
			<div className="group rounded-2xl border border-border bg-white p-4 hover:border-sky-200 hover:shadow-sm transition-all animate-fade-in-up">
				<div className="flex items-start justify-between gap-3 mb-2">
					<span className="text-2xl">{feedback.reaction}</span>
					<span className="text-xs text-muted whitespace-nowrap">
						{formatDate(feedback.date)}
					</span>
				</div>
				<p className="text-sm text-foreground/80 leading-relaxed">
					{feedback.summary}
				</p>
			</div>
		);
	}

	// Sent feedback or dashboard received: full card with name + avatar
	return (
		<div className="group rounded-2xl border border-border bg-white p-5 hover:border-sky-200 hover:shadow-sm transition-all animate-fade-in-up">
			<div className="flex items-start gap-4">
				{/* Avatar */}
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent text-sm font-semibold">
					{otherUser.avatar}
				</div>

				<div className="flex-1 min-w-0">
					{/* Header */}
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<p className="text-sm font-semibold text-foreground">
								{otherUser.name}
							</p>
							<span className="text-lg" title="Reazione">
								{feedback.reaction}
							</span>
						</div>
						<span className="text-xs text-muted whitespace-nowrap">
							{formatDate(feedback.date)}
						</span>
					</div>

					<p className="text-xs text-muted mb-2">{otherUser.role}</p>

					{/* Message or Summary */}
					<p className="text-sm text-foreground/80 leading-relaxed">
						{type === "received" ? feedback.summary : feedback.message}
					</p>
				</div>
			</div>
		</div>
	);
}
