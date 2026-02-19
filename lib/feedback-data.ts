// Shared trait and reaction data used across components

export interface Trait {
	id: string;
	emoji: string;
	label: string;
	type: "strength" | "improvement";
}

export const strengths: Trait[] = [
	{ id: "s1", emoji: "🎯", label: "Precision", type: "strength" },
	{ id: "s2", emoji: "🤝", label: "Collaboration", type: "strength" },
	{ id: "s3", emoji: "💬", label: "Communication", type: "strength" },
	{ id: "s4", emoji: "⚡", label: "Proactivity", type: "strength" },
	{ id: "s5", emoji: "🧠", label: "Problem Solving", type: "strength" },
	{ id: "s6", emoji: "📋", label: "Organization", type: "strength" },
	{ id: "s7", emoji: "🎨", label: "Creativity", type: "strength" },
	{ id: "s8", emoji: "🔥", label: "Motivation", type: "strength" },
];

export const improvements: Trait[] = [
	{ id: "i1", emoji: "⏰", label: "Punctuality", type: "improvement" },
	{ id: "i2", emoji: "📢", label: "Communication", type: "improvement" },
	{ id: "i3", emoji: "📝", label: "Documentation", type: "improvement" },
	{
		id: "i4",
		emoji: "🔍",
		label: "Attention to Detail",
		type: "improvement",
	},
	{ id: "i5", emoji: "🤲", label: "Delegation", type: "improvement" },
	{ id: "i6", emoji: "🎯", label: "Prioritization", type: "improvement" },
	{ id: "i7", emoji: "🧘", label: "Stress Management", type: "improvement" },
	{ id: "i8", emoji: "👂", label: "Active Listening", type: "improvement" },
];

export const allTraits = [...strengths, ...improvements];

export function getTraitById(id: string): Trait | undefined {
	return allTraits.find((t) => t.id === id);
}

export interface ReactionData {
	label: string;
	title: string;
	colorClass: string;
}

export const reactionsData: Record<string, ReactionData> = {
	"🔥": {
		label: "On Fire",
		title: "You're on fire! Keep it up",
		colorClass: "bg-orange-200 text-orange-700",
	},
	"💪": {
		label: "Strong",
		title: "Great job! Stay strong",
		colorClass: "bg-blue-200 text-blue-700",
	},
	"🌟": {
		label: "Stellar",
		title: "Stellar performance!",
		colorClass: "bg-yellow-200 text-yellow-700",
	},
	"🤝": {
		label: "Team Player",
		title: "A true team player",
		colorClass: "bg-emerald-200 text-emerald-700",
	},
	"💡": {
		label: "Creative",
		title: "Brilliant and creative!",
		colorClass: "bg-amber-200 text-amber-700",
	},
	"❤️": {
		label: "Empathetic",
		title: "So empathetic and kind",
		colorClass: "bg-rose-200 text-rose-700",
	},
};
