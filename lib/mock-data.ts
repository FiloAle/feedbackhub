import { User, PersonalFeedback, ProjectTask, WeeklyRecap } from "./types";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users: User[] = [
	{
		id: "u1",
		name: "Marco Rossi",
		role: "Product Designer",
		avatar: "MR",
		email: "marco@company.com",
	},
	{
		id: "u2",
		name: "Elena Bianchi",
		role: "Frontend Developer",
		avatar: "EB",
		email: "elena@company.com",
	},
	{
		id: "u3",
		name: "Luca Ferrari",
		role: "Backend Developer",
		avatar: "LF",
		email: "luca@company.com",
	},
	{
		id: "u4",
		name: "Giulia Conti",
		role: "Project Manager",
		avatar: "GC",
		email: "giulia@company.com",
	},
	{
		id: "u5",
		name: "Andrea Moretti",
		role: "UX Researcher",
		avatar: "AM",
		email: "andrea@company.com",
	},
	{
		id: "u6",
		name: "Sara Romano",
		role: "Data Analyst",
		avatar: "SR",
		email: "sara@company.com",
	},
];

export const currentUser = users[0]; // Marco Rossi

// ─── Personal Feedback ───────────────────────────────────────────────────────

export const personalFeedbacks: PersonalFeedback[] = [
	{
		id: "pf1",
		fromUserId: "u2",
		toUserId: "u1",
		date: "2026-02-19T09:30:00",
		reaction: "🔥",
		sliders: [
			{ label: "Collaboration", value: 9 },
			{ label: "Communication", value: 8 },
			{ label: "Proactivity", value: 9 },
		],
		message:
			"Marco is always available and brings positive energy to the team!",
		summary:
			"Your enthusiasm and helpfulness are contagious. Keep it up, the team really appreciates your collaborative spirit!",
		strengths: ["s1", "s2"],
		improvements: ["i3", "i6"],
	},
	{
		id: "pf2",
		fromUserId: "u4",
		toUserId: "u1",
		date: "2026-02-18T14:20:00",
		reaction: "🌟",
		sliders: [
			{ label: "Collaboration", value: 8 },
			{ label: "Communication", value: 9 },
			{ label: "Proactivity", value: 7 },
		],
		message:
			"Great job on yesterday's presentation, very clear and structured.",
		summary:
			"Your presentations are a benchmark for the team. Clarity is your superpower!",
		strengths: ["s3", "s6"],
		improvements: ["i4"],
	},
	{
		id: "pf3",
		fromUserId: "u1",
		toUserId: "u3",
		date: "2026-02-18T11:00:00",
		reaction: "💪",
		sliders: [
			{ label: "Collaboration", value: 8 },
			{ label: "Communication", value: 7 },
			{ label: "Proactivity", value: 9 },
		],
		message: "Luca solved a critical bug in record time, great dedication!",
		summary:
			"Your problem-solving ability under pressure is extraordinary. The team can always count on you!",
		strengths: ["s5", "s4"],
		improvements: ["i3"],
	},
	{
		id: "pf4",
		fromUserId: "u1",
		toUserId: "u5",
		date: "2026-02-17T16:45:00",
		reaction: "💡",
		sliders: [
			{ label: "Collaboration", value: 9 },
			{ label: "Communication", value: 8 },
			{ label: "Proactivity", value: 8 },
		],
		message: "Andrea always brings interesting insights from user testing.",
		summary:
			"Your insights from user research drive fundamental decisions. Keep exploring!",
		strengths: ["s7", "s2"],
		improvements: ["i2"],
	},
	{
		id: "pf5",
		fromUserId: "u3",
		toUserId: "u1",
		date: "2026-02-17T10:15:00",
		reaction: "🤝",
		sliders: [
			{ label: "Collaboration", value: 10 },
			{ label: "Communication", value: 8 },
			{ label: "Proactivity", value: 8 },
		],
		message:
			"Always a pleasure doing pair review with Marco, super constructive.",
		summary:
			"Your constructive approach in reviews helps the whole team grow. You are a talent multiplier!",
		strengths: ["s2", "s3"],
		improvements: ["i5"],
	},
	{
		id: "pf6",
		fromUserId: "u5",
		toUserId: "u1",
		date: "2026-02-16T15:00:00",
		reaction: "❤️",
		sliders: [
			{ label: "Collaboration", value: 9 },
			{ label: "Communication", value: 9 },
			{ label: "Proactivity", value: 7 },
		],
		message:
			"Marco has a natural talent for mediating and finding compromises.",
		summary:
			"Your attention to clean code and willingness to explain tech choices is an example for everyone!",
		strengths: ["s1", "s3"],
		improvements: ["i1"],
	},
	{
		id: "pf7",
		fromUserId: "u1",
		toUserId: "u2",
		date: "2026-02-16T09:30:00",
		reaction: "🔥",
		sliders: [
			{ label: "Collaboration", value: 8 },
			{ label: "Communication", value: 9 },
			{ label: "Proactivity", value: 10 },
		],
		message:
			"Elena proposed a brilliant component architecture for the new project.",
		summary:
			"Your technical vision and proactivity in proposing innovative solutions are fundamental for the team!",
		strengths: ["s4", "s7"],
		improvements: ["i6"],
	},
	{
		id: "pf8",
		fromUserId: "u6",
		toUserId: "u1",
		date: "2026-02-15T17:00:00",
		reaction: "🌟",
		sliders: [
			{ label: "Collaboration", value: 8 },
			{ label: "Communication", value: 8 },
			{ label: "Proactivity", value: 9 },
		],
		message:
			"Marco always manages to translate data into concrete design decisions.",
		summary:
			"Your ability to connect data and design creates real value. You are the perfect bridge between analytics and creativity!",
		strengths: ["s1", "s5"],
		improvements: ["i8"],
	},
	{
		id: "pf9",
		fromUserId: "u3",
		toUserId: "u1",
		date: "2026-02-14T10:00:00",
		reaction: "💡",
		sliders: [
			{ label: "Collaboration", value: 6 },
			{ label: "Communication", value: 5 },
			{ label: "Proactivity", value: 6 },
		],
		message:
			"The palette currently used does not respect color contrast guidelines on some secondary elements.",
		summary:
			"Great ideas, but attention to accessibility guidelines on color contrasts is needed. A small check can make a big difference!",
		strengths: ["s7"],
		improvements: ["i4", "i2"],
	},
	{
		id: "pf10",
		fromUserId: "u1",
		toUserId: "u4",
		date: "2026-02-13T14:30:00",
		reaction: "🤝",
		sliders: [
			{ label: "Collaboration", value: 5 },
			{ label: "Communication", value: 6 },
			{ label: "Proactivity", value: 5 },
		],
		message:
			"The project onboarding currently requires too many steps before accessing the app. We could optimize it.",
		summary:
			"Simplifying the user flow could greatly improve the experience. Let's try to focus on the essential information first.",
		strengths: ["s6"],
		improvements: ["i2", "i6"],
	},
];

// ─── Project Tasks ───────────────────────────────────────────────────────────

export const projectTasks: ProjectTask[] = [
	{
		id: "t1",
		title: "Check color contrasts of the color palette",
		description:
			"The palette used for the dashboard UI has insufficient contrast ratios on some secondary elements. Check the colors of the labels and borders with a tool like Contrast Checker to comply with WCAG AA.",
		status: "in-progress",
		assigneeId: "u1",
		fromUserId: "u4",
		projectName: "MedioBanca Website",
		dueDate: "2026-02-25",
		receivedDate: "2026-02-17T10:00:00",
		comments: [],
	},
	{
		id: "t2",
		title: "Improve visual hierarchy of the product card",
		description:
			"The title and price have the same visual weight. Try increasing the font-weight of the price and slightly reducing the size of the title to better guide the user's eye.",
		status: "todo",
		assigneeId: "u1",
		fromUserId: "u2",
		projectName: "AXA Mobile App",
		dueDate: "2026-02-28",
		receivedDate: "2026-02-19T09:00:00",
		comments: [],
	},
	{
		id: "t3",
		title: "Review onboarding flow: too many steps",
		description:
			"The onboarding currently requires 6 steps before accessing the app. Consider reducing them to 3-4 by grouping optional information and offering a 'complete later' option.",
		status: "review",
		assigneeId: "u1",
		fromUserId: "u3",
		projectName: "AXA Mobile App",
		dueDate: "2026-02-20",
		receivedDate: "2026-02-16T14:30:00",
		comments: [],
	},
	{
		id: "t4",
		title: "Great use of spacing on the landing page",
		description:
			"The vertical rhythm of the landing is very balanced and the hero section guides reading well. A suggestion: try adding a micro-animation to the main CTA to increase conversion.",
		status: "in-progress",
		assigneeId: "u5",
		fromUserId: "u1",
		projectName: "Eni Ad Campaign",
		dueDate: "2026-02-22",
		receivedDate: "2026-02-18T11:15:00",
		comments: [],
	},
	{
		id: "t5",
		title: "Icon consistency in the design system",
		description:
			"I noticed that some icons use stroke and others fill. For visual consistency, standardize to stroke-only with a thickness of 1.5px per the design system guidelines.",
		status: "done",
		assigneeId: "u6",
		fromUserId: "u1",
		projectName: "Eni Ad Campaign",
		dueDate: "2026-02-15",
		receivedDate: "2026-02-10T09:00:00",
		completedByReceiver: true,
		markedUseful: true,
		comments: [],
	},
	{
		id: "t6",
		title: "Align responsive breakpoints with new specs",
		description:
			"Current breakpoints don't match the updated design system specs. Update breakpoints to 640/768/1024/1280px and ensure the grid adapts correctly.",
		status: "todo",
		assigneeId: "u1",
		fromUserId: "u4",
		projectName: "MedioBanca Website",
		dueDate: "2026-03-01",
		receivedDate: "2026-02-19T08:30:00",
		comments: [],
	},
];

// ─── Weekly Recap ────────────────────────────────────────────────────────────

export const weeklyRecap: WeeklyRecap = {
	userId: "u1",
	weekStart: "2026-02-17",
	phrase:
		"Your constructive spirit in reviews and ability to mediate create a positive work environment. Remember to check out the accessibility guidelines on color contrasts for the dashboard redesign. Keep bringing this energy! 🌟",
	feedbackCount: 5,
	topReaction: "🔥",
};
