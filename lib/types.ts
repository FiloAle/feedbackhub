// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
	id: string;
	name: string;
	role: string;
	avatar: string; // initials-based for now
	email: string;
}

// ─── Personal Feedback (Instagram-story style) ──────────────────────────────

export type ReactionEmoji = "🔥" | "💪" | "🌟" | "🤝" | "💡" | "❤️";

export interface SliderRating {
	label: string;
	value: number; // 1–10
}

export interface PersonalFeedback {
	id: string;
	fromUserId: string;
	toUserId: string;
	date: string; // ISO
	reaction: ReactionEmoji;
	sliders: SliderRating[];
	message: string;
	summary: string; // AI-generated motivational summary shown to recipient
	markedUseful?: boolean; // thumbs up from receiver
	strengths?: string[]; // trait IDs from feedback-data.ts
	improvements?: string[]; // trait IDs from feedback-data.ts
}

// ─── Project Feedback (Figma-style comments) ─────────────────────────────────

export interface ProjectComment {
	id: string;
	projectTaskId: string;
	authorId: string;
	content: string;
	date: string;
	aiSuggestion?: string; // AI feedback on comment quality
	replies: ProjectCommentReply[];
}

export interface ProjectCommentReply {
	id: string;
	authorId: string;
	content: string;
	date: string;
}

// ─── Project Tasks / To-Do ───────────────────────────────────────────────────

export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export interface ProjectTask {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	assigneeId: string;
	projectName: string;
	dueDate: string;
	receivedDate: string;
	comments: ProjectComment[];
	completedByReceiver?: boolean;
	ignoredByReceiver?: boolean;
	markedUseful?: boolean; // was the feedback useful?
	fromUserId: string; // who sent this project feedback
}

// ─── Feedback Story Steps ────────────────────────────────────────────────────

export type StoryStepType = "reaction" | "traits" | "message";

export interface StoryStep {
	type: StoryStepType;
	title: string;
	subtitle: string;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export interface CompanyEvent {
	id: string;
	title: string;
	date: string;
	description: string;
	projectTag?: string; // e.g. "MedioBanca Website", "Internal", etc.
}

export interface EventFeedback {
	id: string;
	eventId: string;
	authorId: string;
	useful: boolean;
	notes: string;
	date: string;
}

// ─── Weekly Recap ────────────────────────────────────────────────────────────

export interface WeeklyRecap {
	userId: string;
	weekStart: string;
	phrase: string;
	feedbackCount: number;
	topReaction: ReactionEmoji;
}
