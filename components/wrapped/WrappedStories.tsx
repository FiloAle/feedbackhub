"use client";

import { useState, useEffect, useCallback } from "react";

interface WrappedStoriesProps {
	isOpen: boolean;
	onClose: () => void;
}

interface Story {
	gradient: string;
	emoji: string;
	title: string;
	subtitle: string;
	highlight?: string;
	extra?: string;
	cta?: { primary: string; secondary: string };
}

const stories: Story[] = [
	{
		gradient: "from-violet-600 via-fuchsia-500 to-pink-500",
		emoji: "✨",
		title: "Your Wrapped 2026",
		subtitle: "A year of growth and collaboration",
		extra: "Let's look back at your journey together",
	},
	{
		gradient: "from-sky-600 via-cyan-500 to-teal-400",
		emoji: "📬",
		title: "You received",
		highlight: "9 feedbacks",
		subtitle: "This shows how much the team values your work!",
	},
	{
		gradient: "from-emerald-600 via-green-500 to-lime-400",
		emoji: "🚀",
		title: "And you sent",
		highlight: "5 feedbacks",
		subtitle: "Thanks for contributing to the team's growth!",
	},
	{
		gradient: "from-amber-500 via-orange-500 to-red-400",
		emoji: "👍",
		title: "People loved your feedback",
		highlight: "4 marked as useful",
		subtitle: "80% of your feedbacks were found helpful by your colleagues!",
	},
	{
		gradient: "from-pink-600 via-rose-500 to-red-400",
		emoji: "🤝",
		title: "Your top strength",
		highlight: "Excellent Collaboration",
		subtitle: "Mentioned in 87% of feedback",
	},
	{
		gradient: "from-indigo-600 via-blue-500 to-cyan-400",
		emoji: "🏆",
		title: "Your best month",
		highlight: "October",
		subtitle: "The most positive feedback of the year!",
	},
	{
		gradient: "from-teal-600 via-emerald-500 to-green-400",
		emoji: "🔥",
		title: "Your longest streak",
		highlight: "6 weeks in a row",
		subtitle: "You never missed a weekly feedback for 6 weeks straight!",
	},
	{
		gradient: "from-purple-600 via-violet-500 to-fuchsia-400",
		emoji: "🎯",
		title: "Fun Fact!",
		highlight: "2×",
		subtitle: "You gave twice as much feedback as the company average!",
	},
	{
		gradient: "from-fuchsia-600 via-pink-500 to-rose-400",
		emoji: "🎉",
		title: "Create a Group Wrapped!",
		subtitle: "Want to see how your team performed this year?",
		cta: { primary: "Create a Co-op Recap", secondary: "Share" },
	},
];

const STORY_DURATION = 10000; // 10 seconds

export default function WrappedStories({
	isOpen,
	onClose,
}: WrappedStoriesProps) {
	const [current, setCurrent] = useState(0);
	const [progress, setProgress] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const goNext = useCallback(() => {
		if (current < stories.length - 1) {
			setCurrent((c) => c + 1);
			setProgress(0);
		} else {
			onClose();
		}
	}, [current, onClose]);

	const goPrev = useCallback(() => {
		if (current > 0) {
			setCurrent((c) => c - 1);
			setProgress(0);
		}
	}, [current]);

	// Auto-advance timer
	useEffect(() => {
		if (!isOpen || isPaused) return;

		const interval = setInterval(() => {
			setProgress((prev) => {
				const next = prev + 100 / (STORY_DURATION / 50);
				return next >= 100 ? 100 : next;
			});
		}, 50);

		return () => clearInterval(interval);
	}, [isOpen, isPaused]);

	// Watch progress for auto-advance
	useEffect(() => {
		if (progress >= 100) {
			goNext();
		}
	}, [progress, goNext]);

	// Reset on open
	useEffect(() => {
		if (isOpen) {
			setCurrent(0);
			setProgress(0);
		}
	}, [isOpen]);

	// Keyboard navigation
	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") goNext();
			else if (e.key === "ArrowLeft") goPrev();
			else if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [isOpen, goNext, goPrev, onClose]);

	if (!isOpen) return null;

	const story = stories[current];

	return (
		<div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
			{/* Close button */}
			<button
				onClick={onClose}
				className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
			>
				<svg
					className="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			{/* Story container */}
			<div className="relative w-full max-w-md h-[90vh] max-h-[800px] rounded-3xl overflow-hidden shadow-2xl">
				{/* Background gradient */}
				<div
					className={`absolute inset-0 bg-gradient-to-br ${story.gradient} transition-all duration-500`}
				/>

				{/* Noise/texture overlay */}
				<div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage:
							"radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
						backgroundSize: "60px 60px",
					}}
				/>

				{/* Progress bars */}
				<div className="absolute top-4 left-4 right-4 z-10 flex gap-1.5">
					{stories.map((_, i) => (
						<div
							key={i}
							className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden"
						>
							<div
								className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
								style={{
									width:
										i < current
											? "100%"
											: i === current
												? `${progress}%`
												: "0%",
								}}
							/>
						</div>
					))}
				</div>

				{/* Left/Right tap zones */}
				<div
					className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
					onClick={goPrev}
					onMouseDown={() => setIsPaused(true)}
					onMouseUp={() => setIsPaused(false)}
					onTouchStart={() => setIsPaused(true)}
					onTouchEnd={() => setIsPaused(false)}
				/>
				<div
					className="absolute right-0 top-0 w-2/3 h-full z-10 cursor-pointer"
					onClick={goNext}
					onMouseDown={() => setIsPaused(true)}
					onMouseUp={() => setIsPaused(false)}
					onTouchStart={() => setIsPaused(true)}
					onTouchEnd={() => setIsPaused(false)}
				/>

				{/* Story counter */}
				<div className="absolute top-10 left-4 z-10">
					<p className="text-[11px] font-medium text-white/60 tracking-wider uppercase">
						Hubby Wrapped &apos;26
					</p>
				</div>

				{/* Content */}
				<div className="relative z-[5] flex flex-col items-center justify-center h-full px-8 text-center pointer-events-none">
					{/* Emoji */}
					<div className="text-6xl mb-6 animate-scale-in">{story.emoji}</div>

					{/* Title */}
					<h2 className="text-2xl font-bold text-white leading-tight mb-3 animate-fade-in-up">
						{story.title}
					</h2>

					{/* Highlight number/stat */}
					{story.highlight && (
						<p
							className="text-5xl font-black text-white mb-4 animate-fade-in-up"
							style={{ animationDelay: "0.1s" }}
						>
							{story.highlight}
						</p>
					)}

					{/* Subtitle */}
					<p
						className="text-base text-white/80 leading-relaxed max-w-xs animate-fade-in-up"
						style={{ animationDelay: "0.15s" }}
					>
						{story.subtitle}
					</p>

					{/* Extra text */}
					{story.extra && (
						<p
							className="text-sm text-white/50 mt-4 animate-fade-in-up"
							style={{ animationDelay: "0.2s" }}
						>
							{story.extra}
						</p>
					)}

					{/* CTA buttons */}
					{story.cta && (
						<div
							className="flex flex-col gap-3 mt-8 w-full max-w-xs pointer-events-auto animate-fade-in-up"
							style={{ animationDelay: "0.2s" }}
						>
							<button
								onClick={(e) => e.stopPropagation()}
								className="w-full py-3 px-6 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-white/90 transition-all active:scale-95"
							>
								{story.cta.primary}
							</button>
							<button
								onClick={(e) => e.stopPropagation()}
								className="w-full py-3 px-6 rounded-xl bg-white/15 text-white font-semibold text-sm hover:bg-white/25 transition-all backdrop-blur-sm active:scale-95"
							>
								{story.cta.secondary}
							</button>
						</div>
					)}
				</div>

				{/* Bottom indicator */}
				<div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">
					<p className="text-xs text-white/40">
						{current + 1} / {stories.length}
					</p>
				</div>
			</div>
		</div>
	);
}
