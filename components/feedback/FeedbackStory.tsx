"use client";

import { useState } from "react";
import { User, ReactionEmoji } from "@/lib/types";
import { IoSendOutline, IoCheckmarkOutline } from "react-icons/io5";

interface FeedbackStoryProps {
	targetUser: User;
	onComplete: () => void;
}

const reactions: { emoji: ReactionEmoji; label: string }[] = [
	{ emoji: "🔥", label: "On Fire" },
	{ emoji: "💪", label: "Strong" },
	{ emoji: "🌟", label: "Stellar" },
	{ emoji: "🤝", label: "Team Player" },
	{ emoji: "💡", label: "Creative" },
	{ emoji: "❤️", label: "Empathetic" },
];

interface Trait {
	id: string;
	emoji: string;
	label: string;
	type: "strength" | "improvement";
}

const strengths: Trait[] = [
	{ id: "s1", emoji: "🎯", label: "Precision", type: "strength" },
	{ id: "s2", emoji: "🤝", label: "Collaboration", type: "strength" },
	{ id: "s3", emoji: "💬", label: "Communication", type: "strength" },
	{ id: "s4", emoji: "⚡", label: "Proactivity", type: "strength" },
	{ id: "s5", emoji: "🧠", label: "Problem Solving", type: "strength" },
	{ id: "s6", emoji: "📋", label: "Organization", type: "strength" },
	{ id: "s7", emoji: "🎨", label: "Creativity", type: "strength" },
	{ id: "s8", emoji: "🔥", label: "Motivation", type: "strength" },
];

const improvements: Trait[] = [
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

export default function FeedbackStory({
	targetUser,
	onComplete,
}: FeedbackStoryProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedReaction, setSelectedReaction] =
		useState<ReactionEmoji | null>(null);
	const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
	const [selectedImprovements, setSelectedImprovements] = useState<string[]>(
		[],
	);
	const [message, setMessage] = useState("");
	const [sent, setSent] = useState(false);
	const totalSteps = 3;

	const toggleTrait = (
		id: string,
		list: string[],
		setList: (v: string[]) => void,
	) => {
		if (list.includes(id)) {
			setList(list.filter((x) => x !== id));
		} else {
			setList([...list, id]);
		}
	};

	const handleSend = () => {
		setSent(true);
		setTimeout(() => {
			onComplete();
		}, 1500);
	};

	const canProceed = () => {
		if (currentStep === 0) return selectedReaction !== null;
		if (currentStep === 1)
			return selectedStrengths.length > 0 || selectedImprovements.length > 0;
		if (currentStep === 2) return true; // message is optional
		return false;
	};

	if (sent) {
		return (
			<div className="flex flex-col items-center justify-center py-16 animate-scale-in">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-100 text-lime-600 mb-4">
					<IoCheckmarkOutline className="w-8 h-8" />
				</div>
				<h3 className="text-lg font-semibold text-foreground mb-1">
					Feedback Sent!
				</h3>
				<p className="text-sm text-muted">
					Your feedback for {targetUser.name} has been sent
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			{/* Target user header */}
			<div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-100 text-lime-800 text-sm font-bold">
					{targetUser.avatar}
				</div>
				<div>
					<p className="text-sm font-semibold text-foreground">
						{targetUser.name}
					</p>
					<p className="text-xs text-muted">{targetUser.role}</p>
				</div>
			</div>

			{/* Progress dots */}
			<div className="flex items-center justify-center gap-2 mb-8">
				{Array.from({ length: totalSteps }).map((_, i) => (
					<div
						key={i}
						className={`h-1.5 rounded-full transition-all duration-300 ${
							i === currentStep
								? "w-8 bg-lime-800"
								: i < currentStep
									? "w-4 bg-lime-800/40"
									: "w-4 bg-gray-200"
						}`}
					/>
				))}
			</div>

			{/* Step content */}
			<div className="flex-1 animate-fade-in-up" key={currentStep}>
				{/* Step 1: Reaction */}
				{currentStep === 0 && (
					<div>
						<h3 className="text-base font-semibold text-foreground mb-1">
							How would you describe {targetUser.name}&apos;s attitude?
						</h3>
						<p className="text-sm text-muted mb-6">
							Choose the reaction that best represents your impression
						</p>

						<div className="grid grid-cols-3 gap-3">
							{reactions.map((r) => (
								<button
									key={r.emoji}
									onClick={() => setSelectedReaction(r.emoji)}
									className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all hover:border-lime-200 hover:bg-lime-50 ${
										selectedReaction === r.emoji
											? "border-lime-800 bg-lime-100 shadow-sm"
											: "border-border bg-white"
									}`}
								>
									<span className="text-3xl">{r.emoji}</span>
									<span className="text-xs font-medium text-muted">
										{r.label}
									</span>
								</button>
							))}
						</div>
					</div>
				)}

				{/* Step 2: Strengths & Improvements */}
				{currentStep === 1 && (
					<div>
						<h3 className="text-base font-semibold text-foreground mb-1">
							Strengths
						</h3>
						<p className="text-sm text-muted mb-4">
							What do they excel at? Select one or more
						</p>

						<div className="grid grid-cols-2 gap-2 mb-6">
							{strengths.map((t) => (
								<button
									key={t.id}
									onClick={() =>
										toggleTrait(t.id, selectedStrengths, setSelectedStrengths)
									}
									className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
										selectedStrengths.includes(t.id)
											? "border-lime-400 bg-lime-50"
											: "border-border bg-white hover:border-lime-200 hover:bg-lime-50/50"
									}`}
								>
									<span className="text-lg">{t.emoji}</span>
									<span className="text-xs font-medium text-foreground">
										{t.label}
									</span>
								</button>
							))}
						</div>

						<h3 className="text-base font-semibold text-foreground mb-1">
							Areas for improvement
						</h3>
						<p className="text-sm text-muted mb-4">
							Where could they grow? (optional)
						</p>

						<div className="grid grid-cols-2 gap-2">
							{improvements.map((t) => (
								<button
									key={t.id}
									onClick={() =>
										toggleTrait(
											t.id,
											selectedImprovements,
											setSelectedImprovements,
										)
									}
									className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
										selectedImprovements.includes(t.id)
											? "border-amber-400 bg-amber-50"
											: "border-border bg-white hover:border-amber-200 hover:bg-amber-50/50"
									}`}
								>
									<span className="text-lg">{t.emoji}</span>
									<span className="text-xs font-medium text-foreground">
										{t.label}
									</span>
								</button>
							))}
						</div>
					</div>
				)}

				{/* Step 3: Motivation */}
				{currentStep === 2 && (
					<div>
						<h3 className="text-base font-semibold text-foreground mb-1">
							Do you want to add a motivation?
						</h3>
						<p className="text-sm text-muted mb-6">
							Explain the reason for your choices (optional)
						</p>

						{/* Summary of selections */}
						<div className="mb-4 space-y-2">
							{selectedStrengths.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{selectedStrengths.map((id) => {
										const t = strengths.find((s) => s.id === id);
										return t ? (
											<span
												key={id}
												className="inline-flex items-center gap-1 text-xs font-medium bg-lime-50 text-lime-700 px-2 py-1 rounded-lg border border-lime-200"
											>
												{t.emoji} {t.label}
											</span>
										) : null;
									})}
								</div>
							)}
							{selectedImprovements.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{selectedImprovements.map((id) => {
										const t = improvements.find((s) => s.id === id);
										return t ? (
											<span
												key={id}
												className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-200"
											>
												{t.emoji} {t.label}
											</span>
										) : null;
									})}
								</div>
							)}
						</div>

						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="E.g.: I noticed that during standups they always communicate clearly and concisely..."
							rows={4}
							className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-gray-400 focus:border-lime-800 focus:outline-none focus:ring-2 focus:ring-lime-800/10 resize-none"
						/>
						<p className="text-[11px] text-muted mt-2">
							{message.length}/300 characters
						</p>
					</div>
				)}
			</div>

			{/* Navigation buttons */}
			<div className="flex items-center justify-between pt-6 mt-4 border-t border-border">
				<button
					onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
					className={`text-sm font-medium text-muted hover:text-foreground transition-colors ${
						currentStep === 0 ? "invisible" : ""
					}`}
				>
					Back
				</button>

				{currentStep < totalSteps - 1 ? (
					<button
						onClick={() => setCurrentStep(currentStep + 1)}
						disabled={!canProceed()}
						className="flex items-center gap-2 rounded-xl bg-lime-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-lime-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
					>
						Next
					</button>
				) : (
					<button
						onClick={handleSend}
						disabled={!canProceed()}
						className="flex items-center gap-2 rounded-xl bg-lime-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-lime-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
					>
						<IoSendOutline className="w-4 h-4" />
						Send Feedback
					</button>
				)}
			</div>
		</div>
	);
}
