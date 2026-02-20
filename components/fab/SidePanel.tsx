"use client";

import { useState, useEffect } from "react";
import {
	IoCloseOutline,
	IoPersonOutline,
	IoClipboardOutline,
	IoArrowBackOutline,
	IoSendOutline,
	IoSparklesOutline,
	IoCheckmarkOutline,
	IoCalendarOutline,
} from "react-icons/io5";
import FeedbackStory from "@/components/feedback/FeedbackStory";
import { users, currentUser, projectTasks, mockEvents } from "@/lib/mock-data";
import { User } from "@/lib/types";

interface SidePanelProps {
	isOpen: boolean;
	onClose: () => void;
	lockedTarget?: User | null;
	onDailyComplete?: (completedUser?: User | null) => void;
	mode?: "send" | "request";
	weeklyTargets?: User[];
}

type PanelView =
	| "select"
	| "personal"
	| "pick-person"
	| "weekly-pick"
	| "project"
	| "req-type"
	| "req-pick-person"
	| "req-personal-area"
	| "req-project-task"
	| "req-details"
	| "req-sent"
	| "event";

const aiSuggestions: Record<string, string> = {
	vague:
		"Your feedback seems generic. Try to specify a concrete example to make it more useful.",
	negative:
		"The tone of the feedback might sound negative. Try to rephrase it constructively, suggesting an alternative.",
	short:
		"The feedback is very short. Adding context would help the recipient better understand your point of view.",
	good: "",
};

function analyzeComment(text: string): string {
	if (text.length < 20 && text.length > 0) return aiSuggestions.short;
	const negativeWords = [
		"bad",
		"wrong",
		"doesn't work",
		"ugly",
		"terrible",
		"horrible",
	];
	if (negativeWords.some((w) => text.toLowerCase().includes(w)))
		return aiSuggestions.negative;
	const vagueWords = ["ok", "good", "nice", "fine"];
	if (vagueWords.some((w) => text.toLowerCase().trim() === w))
		return aiSuggestions.vague;
	return aiSuggestions.good;
}

const personalAreas = [
	{ id: "partecipazione", emoji: "🙋", label: "Participation" },
	{ id: "comunicazione", emoji: "💬", label: "Communication" },
	{ id: "collaborazione", emoji: "🤝", label: "Collaboration" },
	{ id: "leadership", emoji: "🎯", label: "Leadership" },
	{ id: "proattivita", emoji: "⚡", label: "Proactivity" },
	{ id: "problem-solving", emoji: "🧠", label: "Problem Solving" },
];

export default function SidePanel({
	isOpen,
	onClose,
	lockedTarget,
	onDailyComplete,
	mode = "send",
	weeklyTargets,
}: SidePanelProps) {
	const [view, setView] = useState<PanelView>("select");

	useEffect(() => {
		if (isOpen && lockedTarget) {
			setView("personal");
		} else if (isOpen && weeklyTargets && weeklyTargets.length > 0) {
			setView("weekly-pick");
		} else if (isOpen && mode === "request") {
			setView("req-type");
		} else if (isOpen) {
			setView("select");
		}
	}, [isOpen, lockedTarget, mode, weeklyTargets]);

	const [projectComment, setProjectComment] = useState("");
	const [selectedTaskId, setSelectedTaskId] = useState(
		projectTasks[0]?.id || "",
	);
	const [commentSent, setCommentSent] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState<User | null>(null);

	// Request flow state
	const [reqType, setReqType] = useState<"personal" | "project" | null>(null);
	const [reqSelectedArea, setReqSelectedArea] = useState<string | null>(null);
	const [reqSelectedTask, setReqSelectedTask] = useState<string | null>(null);
	const [reqNotes, setReqNotes] = useState("");
	const [reqAttachments, setReqAttachments] = useState<string[]>([]);
	const [reqFigmaLinked, setReqFigmaLinked] = useState(false);

	// Custom Dropdown Open States
	const [sendTaskDropdownOpen, setSendTaskDropdownOpen] = useState(false);
	const [reqTaskDropdownOpen, setReqTaskDropdownOpen] = useState(false);

	// Event Feedback state
	const [eventSelectedId, setEventSelectedId] = useState(
		mockEvents[0]?.id || "",
	);
	const [eventUseful, setEventUseful] = useState<boolean | null>(null);
	const [eventNotes, setEventNotes] = useState("");
	const [sendEventDropdownOpen, setSendEventDropdownOpen] = useState(false);

	const feedbackTarget = lockedTarget || selectedPerson;
	const aiHint = analyzeComment(projectComment);

	const resetState = () => {
		setView("select");
		setProjectComment("");
		setCommentSent(false);
		setSelectedPerson(null);
		setReqType(null);
		setReqSelectedArea(null);
		setReqSelectedTask(null);
		setReqNotes("");
		setReqAttachments([]);
		setReqFigmaLinked(false);
		setSendTaskDropdownOpen(false);
		setReqTaskDropdownOpen(false);
		setSendEventDropdownOpen(false);
		setEventUseful(null);
		setEventNotes("");
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const handleFeedbackCompleted = () => {
		const completedPerson = selectedPerson;
		resetState();
		if (lockedTarget && onDailyComplete) {
			onDailyComplete(lockedTarget);
		} else if (
			weeklyTargets &&
			weeklyTargets.length > 0 &&
			completedPerson &&
			onDailyComplete
		) {
			onDailyComplete(completedPerson);
		} else {
			onClose();
		}
	};

	const handleBack = () => {
		// Weekly flow back navigation
		if (
			view === "personal" &&
			weeklyTargets &&
			weeklyTargets.length > 0 &&
			!lockedTarget
		) {
			setView("weekly-pick");
			return;
		}
		// Send flow back navigation
		if (view === "personal" && !lockedTarget) {
			setView("pick-person");
			return;
		}
		// Request flow back navigation
		if (view === "req-pick-person") {
			setView("req-type");
			setReqType(null);
			return;
		}
		if (view === "req-personal-area") {
			setView("req-pick-person");
			return;
		}
		if (view === "req-project-task") {
			setView("req-pick-person");
			return;
		}
		if (view === "req-details") {
			if (reqType === "personal") setView("req-personal-area");
			else setView("req-project-task");
			return;
		}
		resetState();
		onClose();
	};

	const handleSendProjectComment = () => {
		setCommentSent(true);
		setTimeout(() => handleClose(), 1500);
	};

	const handleSendEventFeedback = () => {
		setCommentSent(true);
		setTimeout(() => handleClose(), 1500);
	};

	const handleSendRequest = () => {
		setView("req-sent");
		setTimeout(() => handleClose(), 1500);
	};

	if (!isOpen) return null;

	// Dynamic title
	const getTitle = () => {
		switch (view) {
			case "select":
				return "Send Feedback";
			case "pick-person":
				return "Choose Recipient";
			case "weekly-pick":
				return "Weekly Feedback";
			case "personal":
				return "Personal Feedback";
			case "project":
				return "Project Feedback";
			case "event":
				return "Event Feedback";
			case "req-type":
				return "Request Feedback";
			case "req-pick-person":
				return "Choose Person";
			case "req-personal-area":
				return "Feedback Area";
			case "req-project-task":
				return "Select Task";
			case "req-sent":
				return "Request Sent";
			default:
				return "";
		}
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-50 bg-black/20 animate-fade-in"
				onClick={handleClose}
			/>

			{/* Panel */}
			<div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-border px-6 py-4">
					<div className="flex items-center gap-3">
						{view !== "select" &&
							view !== "req-type" &&
							view !== "weekly-pick" && (
								<button
									onClick={handleBack}
									className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 text-muted transition-colors"
								>
									<IoArrowBackOutline className="w-5 h-5 text-sky-800" />
								</button>
							)}
						<h3 className="text-base font-semibold text-foreground">
							{getTitle()}
						</h3>
					</div>
					<button
						onClick={handleClose}
						className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 text-muted transition-colors"
					>
						<IoCloseOutline className="w-5 h-5 text-lime-800" />
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
					{/* ═══ SEND: Type selection ═══ */}
					{view === "select" && (
						<div className="space-y-3 animate-fade-in-up">
							<p className="text-sm text-muted mb-4">
								What kind of feedback do you want to send?
							</p>
							<button
								onClick={() => {
									if (lockedTarget) setView("personal");
									else setView("pick-person");
								}}
								className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left hover:border-lime-200 hover:bg-lime-50/50 transition-all group"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100 text-lime-800 group-hover:bg-lime-800 group-hover:text-white transition-colors">
									<IoPersonOutline className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Personal Feedback
									</p>
									<p className="text-xs text-muted mt-0.5">
										Send a personal evaluation to a colleague
									</p>
								</div>
							</button>
							<button
								onClick={() => setView("project")}
								className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left hover:border-lime-200 hover:bg-lime-50/50 transition-all group"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100 text-lime-800 group-hover:bg-lime-800 group-hover:text-white transition-colors">
									<IoClipboardOutline className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Project Feedback
									</p>
									<p className="text-xs text-muted mt-0.5">
										Leave a comment on a project task
									</p>
								</div>
							</button>
							{mode === "send" && (
								<button
									onClick={() => setView("event")}
									className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left hover:border-lime-200 hover:bg-lime-50/50 transition-all group animate-fade-in-up"
									style={{ animationDelay: "100ms" }}
								>
									<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100 text-lime-800 group-hover:bg-lime-800 group-hover:text-white transition-colors">
										<IoCalendarOutline className="w-6 h-6" />
									</div>
									<div>
										<p className="text-sm font-semibold text-foreground">
											Event Feedback
										</p>
										<p className="text-xs text-muted mt-0.5">
											Evaluate recent company events or syncs
										</p>
									</div>
								</button>
							)}
						</div>
					)}

					{/* ═══ WEEKLY: Pick from assigned targets ═══ */}
					{view === "weekly-pick" && weeklyTargets && (
						<div className="space-y-3 animate-fade-in-up">
							<p className="text-sm text-muted mb-2">
								Who do you want to send the weekly feedback to?
							</p>
							{weeklyTargets.map((user) => (
								<button
									key={user.id}
									onClick={() => {
										setSelectedPerson(user);
										setView("personal");
									}}
									className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:border-lime-200 hover:bg-lime-50/50 transition-all"
								>
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-100 text-lime-800 text-sm font-semibold">
										{user.avatar}
									</div>
									<div>
										<p className="text-sm font-semibold text-foreground">
											{user.name}
										</p>
										<p className="text-xs text-muted">{user.role}</p>
									</div>
								</button>
							))}
						</div>
					)}

					{/* ═══ SEND: Person picker ═══ */}
					{view === "pick-person" && (
						<div className="space-y-3 animate-fade-in-up">
							<p className="text-sm text-muted mb-2">
								Who do you want to send the feedback to?
							</p>
							{users
								.filter((u) => u.id !== currentUser.id)
								.map((user) => (
									<button
										key={user.id}
										onClick={() => {
											setSelectedPerson(user);
											setView("personal");
										}}
										className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:border-lime-200 hover:bg-lime-50/50 transition-all"
									>
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-100 text-lime-800 text-sm font-semibold">
											{user.avatar}
										</div>
										<div>
											<p className="text-sm font-semibold text-foreground">
												{user.name}
											</p>
											<p className="text-xs text-muted">{user.role}</p>
										</div>
									</button>
								))}
						</div>
					)}

					{/* ═══ SEND: Personal feedback story ═══ */}
					{view === "personal" && feedbackTarget && (
						<FeedbackStory
							targetUser={feedbackTarget}
							onComplete={handleFeedbackCompleted}
						/>
					)}

					{/* ═══ SEND: Project feedback ═══ */}
					{view === "project" && !commentSent && (
						<div className="space-y-5 animate-fade-in-up">
							<div>
								<label className="text-sm font-medium text-foreground mb-1.5 block">
									Task
								</label>
								<div className="relative">
									<button
										onClick={() =>
											setSendTaskDropdownOpen(!sendTaskDropdownOpen)
										}
										className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-lime-800 focus:outline-none focus:ring-2 focus:ring-lime-800/10 hover:bg-gray-50 transition-all text-left"
									>
										<span className="truncate pr-4">
											{projectTasks.find((t) => t.id === selectedTaskId)
												?.title || "Select a task..."}
										</span>
										<svg
											className={`w-4 h-4 text-muted shrink-0 transition-transform ${sendTaskDropdownOpen ? "rotate-180" : ""}`}
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19.5 8.25l-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</button>
									{sendTaskDropdownOpen && (
										<>
											<div
												className="fixed inset-0 z-30"
												onClick={() => setSendTaskDropdownOpen(false)}
											/>
											<div className="absolute left-0 top-full mt-1 z-40 w-full bg-white rounded-xl border border-border shadow-lg py-1 max-h-[250px] overflow-y-auto no-scrollbar animate-fade-in">
												{projectTasks.map((task) => (
													<button
														key={task.id}
														onClick={() => {
															setSelectedTaskId(task.id);
															setSendTaskDropdownOpen(false);
														}}
														className={`flex flex-col w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${selectedTaskId === task.id ? "bg-lime-50 text-lime-800" : ""}`}
													>
														<span className="text-sm font-medium truncate w-full">
															{task.title}
														</span>
														<span className="text-[10px] text-muted truncate w-full">
															{task.projectName}
														</span>
													</button>
												))}
											</div>
										</>
									)}
								</div>
							</div>
							<div>
								<label className="text-sm font-medium text-foreground mb-1.5 block">
									Your feedback
								</label>
								<textarea
									value={projectComment}
									onChange={(e) => setProjectComment(e.target.value)}
									placeholder="Write your feedback on the task... Be specific and constructive."
									rows={5}
									className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-gray-400 focus:border-lime-800 focus:outline-none focus:ring-2 focus:ring-lime-800/10 resize-none"
								/>
							</div>
							{aiHint && (
								<div className="flex gap-3 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 p-4 animate-fade-in-up">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-800/10 text-sky-800">
										<IoSparklesOutline className="w-5 h-5 animate-scale-in" />
									</div>
									<div>
										<p className="text-xs font-semibold text-sky-800 mb-1">
											AI Suggestion
										</p>
										<p className="text-sm text-foreground/80 leading-relaxed">
											{aiHint}
										</p>
									</div>
								</div>
							)}
							<button
								onClick={handleSendProjectComment}
								disabled={projectComment.trim().length < 5}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-800 px-5 py-3 text-sm font-medium text-white hover:bg-lime-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
							>
								<IoSendOutline className="w-4 h-4" />
								Send Comment
							</button>
						</div>
					)}

					{/* ═══ SEND: Project sent confirmation ═══ */}
					{view === "project" && commentSent && (
						<div className="flex flex-col items-center justify-center py-16 animate-scale-in">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-100 text-lime-600 mb-4">
								<IoCheckmarkOutline className="w-8 h-8" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-1">
								Comment Sent!
							</h3>
							<p className="text-sm text-muted">
								Your feedback has been added to the task
							</p>
						</div>
					)}

					{/* ═══ SEND: Event feedback ═══ */}
					{view === "event" && !commentSent && (
						<div className="space-y-5 animate-fade-in-up">
							<div>
								<label className="text-sm font-medium text-foreground mb-1.5 block">
									Event
								</label>
								<div className="relative">
									<button
										onClick={() =>
											setSendEventDropdownOpen(!sendEventDropdownOpen)
										}
										className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground focus:border-lime-800 focus:outline-none focus:ring-2 focus:ring-lime-800/10 hover:bg-gray-50 transition-all text-left"
									>
										<span className="truncate pr-4">
											{mockEvents.find((evt) => evt.id === eventSelectedId)
												?.title || "Select an event..."}
										</span>
										<svg
											className={`w-4 h-4 text-muted shrink-0 transition-transform ${sendEventDropdownOpen ? "rotate-180" : ""}`}
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={2}
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19.5 8.25l-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</button>
									{sendEventDropdownOpen && (
										<>
											<div
												className="fixed inset-0 z-30"
												onClick={() => setSendEventDropdownOpen(false)}
											/>
											<div className="absolute left-0 top-full mt-1 z-40 w-full bg-white rounded-xl border border-border shadow-lg py-1 max-h-[250px] overflow-y-auto no-scrollbar animate-fade-in">
												{mockEvents.map((evt) => (
													<button
														key={evt.id}
														onClick={() => {
															setEventSelectedId(evt.id);
															setSendEventDropdownOpen(false);
														}}
														className={`flex flex-col w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${eventSelectedId === evt.id ? "bg-lime-50 text-lime-800" : ""}`}
													>
														<span className="text-sm font-medium truncate w-full">
															{evt.title}
														</span>
														<span className="text-[10px] text-muted truncate w-full">
															{new Date(evt.date).toLocaleDateString("en-US", {
																month: "short",
																day: "numeric",
															})}
														</span>
													</button>
												))}
											</div>
										</>
									)}
								</div>
							</div>

							<div>
								<label className="text-sm font-medium text-foreground mb-3 block">
									Was this event useful to you?
								</label>
								<div className="grid grid-cols-2 gap-3">
									<button
										onClick={() => setEventUseful(true)}
										className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 transition-all ${
											eventUseful === true
												? "border-lime-500 bg-lime-50 text-lime-800"
												: "border-border bg-white text-muted hover:border-lime-200 hover:bg-lime-50"
										}`}
									>
										<span className="text-xl">👍</span>
										<span className="text-sm font-medium">Useful</span>
									</button>
									<button
										onClick={() => setEventUseful(false)}
										className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 transition-all ${
											eventUseful === false
												? "border-amber-500 bg-amber-50 text-amber-800"
												: "border-border bg-white text-muted hover:border-amber-200 hover:bg-amber-50"
										}`}
									>
										<span className="text-xl">👎</span>
										<span className="text-sm font-medium">Not Useful</span>
									</button>
								</div>
							</div>

							<div>
								<label className="text-sm font-medium text-foreground mb-1.5 block">
									Additional notes{" "}
									<span className="text-muted font-normal">(optional)</span>
								</label>
								<textarea
									value={eventNotes}
									onChange={(e) => setEventNotes(e.target.value)}
									placeholder="Any personal thoughts on what could be improved?"
									rows={4}
									className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-gray-400 focus:border-lime-800 focus:outline-none focus:ring-2 focus:ring-lime-800/10 resize-none"
								/>
							</div>

							<button
								onClick={handleSendEventFeedback}
								disabled={eventUseful === null}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-800 px-5 py-3 text-sm font-medium text-white hover:bg-lime-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
							>
								<IoSendOutline className="w-4 h-4" />
								Send Feedback
							</button>
						</div>
					)}

					{/* ═══ SEND: Event sent confirmation ═══ */}
					{view === "event" && commentSent && (
						<div className="flex flex-col items-center justify-center py-16 animate-scale-in">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-100 text-lime-600 mb-4">
								<IoCheckmarkOutline className="w-8 h-8" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-1">
								Feedback Sent!
							</h3>
							<p className="text-sm text-muted">
								Thank you, your feedback helps us improve company events
							</p>
						</div>
					)}

					{/* ═══════════════════════════════════════════ */}
					{/* ═══ REQUEST FLOW ═══ */}
					{/* ═══════════════════════════════════════════ */}

					{/* ═══ REQUEST: Type selection ═══ */}
					{view === "req-type" && (
						<div className="space-y-3 animate-fade-in-up">
							<p className="text-sm text-muted mb-4">
								What kind of feedback do you want to request?
							</p>
							<button
								onClick={() => {
									setReqType("personal");
									setView("req-pick-person");
								}}
								className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left hover:border-teal-600 hover:bg-teal-50 transition-all group"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
									<IoPersonOutline className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Personal Feedback
									</p>
									<p className="text-xs text-muted mt-0.5">
										Ask for feedback on a personal aspect
									</p>
								</div>
							</button>
							<button
								onClick={() => {
									setReqType("project");
									setView("req-pick-person");
								}}
								className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left hover:border-teal-600 hover:bg-teal-50 transition-all group"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
									<IoClipboardOutline className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Project Feedback
									</p>
									<p className="text-xs text-muted mt-0.5">
										Ask for feedback on a specific task
									</p>
								</div>
							</button>
						</div>
					)}

					{/* ═══ REQUEST: Person picker ═══ */}
					{view === "req-pick-person" && (
						<div className="space-y-3 animate-fade-in-up">
							<p className="text-sm text-muted mb-2">
								Who do you want to receive feedback from?
							</p>
							{users
								.filter((u) => u.id !== currentUser.id)
								.map((user) => (
									<button
										key={user.id}
										onClick={() => {
											setSelectedPerson(user);
											if (reqType === "personal") {
												setView("req-personal-area");
											} else {
												setView("req-project-task");
											}
										}}
										className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:border-teal-600 hover:bg-teal-50 transition-all"
									>
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 text-sm font-semibold">
											{user.avatar}
										</div>
										<div>
											<p className="text-sm font-semibold text-foreground">
												{user.name}
											</p>
											<p className="text-xs text-muted">{user.role}</p>
										</div>
									</button>
								))}
						</div>
					)}

					{/* ═══ REQUEST: Personal area selection ═══ */}
					{view === "req-personal-area" && (
						<div className="space-y-4 animate-fade-in-up">
							<p className="text-sm text-muted mb-2">
								What area do you want to receive feedback on from{" "}
								<span className="font-medium text-foreground">
									{selectedPerson?.name}
								</span>
								?
							</p>
							<div className="grid grid-cols-2 gap-2">
								{personalAreas.map((area) => (
									<button
										key={area.id}
										onClick={() => setReqSelectedArea(area.id)}
										className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left transition-all ${
											reqSelectedArea === area.id
												? "border-teal-600 bg-teal-50"
												: "border-border bg-white hover:border-teal-200 hover:bg-teal-50"
										}`}
									>
										<span className="text-lg">{area.emoji}</span>
										<span className="text-xs font-medium text-foreground">
											{area.label}
										</span>
									</button>
								))}
							</div>
							<button
								onClick={() => setView("req-details")}
								disabled={!reqSelectedArea}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-4"
							>
								Next
							</button>
						</div>
					)}

					{/* ═══ REQUEST: Project task selection ═══ */}
					{view === "req-project-task" && (
						<div className="space-y-4 animate-fade-in-up">
							<p className="text-sm text-muted mb-2">
								What task do you want to receive feedback on from{" "}
								<span className="font-medium text-foreground">
									{selectedPerson?.name}
								</span>
								?
							</p>
							<div className="relative">
								<button
									onClick={() => setReqTaskDropdownOpen(!reqTaskDropdownOpen)}
									className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/10 hover:bg-gray-50 transition-all text-left"
								>
									<span className="truncate pr-4">
										{reqSelectedTask
											? projectTasks.find((t) => t.id === reqSelectedTask)
													?.title
											: "Select a task..."}
									</span>
									<svg
										className={`w-4 h-4 text-muted shrink-0 transition-transform ${reqTaskDropdownOpen ? "rotate-180" : ""}`}
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</button>
								{reqTaskDropdownOpen && (
									<>
										<div
											className="fixed inset-0 z-30"
											onClick={() => setReqTaskDropdownOpen(false)}
										/>
										<div className="absolute left-0 top-full mt-1 z-40 w-full bg-white rounded-xl border border-border shadow-lg py-1 max-h-[250px] overflow-y-auto no-scrollbar animate-fade-in">
											{projectTasks.map((task) => (
												<button
													key={task.id}
													onClick={() => {
														setReqSelectedTask(task.id);
														setReqTaskDropdownOpen(false);
													}}
													className={`flex flex-col w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${reqSelectedTask === task.id ? "bg-teal-50 text-teal-800" : ""}`}
												>
													<span className="text-sm font-medium truncate w-full">
														{task.title}
													</span>
													<span className="text-[10px] text-muted truncate w-full">
														{task.projectName}
													</span>
												</button>
											))}
										</div>
									</>
								)}
							</div>
							<button
								onClick={() => setView("req-details")}
								disabled={!reqSelectedTask}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2"
							>
								Next
							</button>
						</div>
					)}

					{/* ═══ REQUEST: Details — notes, attachments, integrations ═══ */}
					{view === "req-details" && (
						<div className="space-y-5 animate-fade-in-up">
							{/* Notes */}
							<div>
								<label className="text-sm font-medium text-foreground mb-1.5 block">
									Additional notes{" "}
									<span className="text-muted font-normal">(optional)</span>
								</label>
								<textarea
									value={reqNotes}
									onChange={(e) => setReqNotes(e.target.value)}
									placeholder="E.g.: I would like to get an opinion on the usability of the checkout flow..."
									rows={3}
									className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/10 resize-none"
								/>
							</div>

							{/* Attachments */}
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">
									Attachments
								</label>
								{reqAttachments.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-3">
										{reqAttachments.map((name) => (
											<div
												key={name}
												className="flex items-center gap-1.5 bg-teal-50 text-teal-700 rounded-lg px-2.5 py-1.5 text-xs font-medium"
											>
												📎 {name}
												<button
													onClick={() =>
														setReqAttachments(
															reqAttachments.filter((a) => a !== name),
														)
													}
													className="text-teal-400 hover:text-teal-700 ml-0.5"
												>
													×
												</button>
											</div>
										))}
									</div>
								)}
								<div className="flex gap-2">
									<button
										onClick={() => {
											const fakeFiles = [
												"screenshot.png",
												"mockup-v2.png",
												"annotazioni.pdf",
												"spec-design.docx",
											];
											const available = fakeFiles.filter(
												(f) => !reqAttachments.includes(f),
											);
											if (available.length > 0)
												setReqAttachments([...reqAttachments, available[0]]);
										}}
										className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-white px-4 py-3 text-sm text-muted hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/50 transition-all flex-1"
									>
										<span className="text-lg">📷</span>
										Images
									</button>
									<button
										onClick={() => {
											const fakeFiles = [
												"brief.pdf",
												"requisiti.docx",
												"report-UX.pdf",
											];
											const available = fakeFiles.filter(
												(f) => !reqAttachments.includes(f),
											);
											if (available.length > 0)
												setReqAttachments([...reqAttachments, available[0]]);
										}}
										className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-white px-4 py-3 text-sm text-muted hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/50 transition-all flex-1"
									>
										<span className="text-lg">📄</span>
										Documents
									</button>
								</div>
							</div>

							{/* Integrations */}
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">
									Integrations
								</label>
								<button
									onClick={() => setReqFigmaLinked(!reqFigmaLinked)}
									className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
										reqFigmaLinked
											? "border-teal-600 bg-teal-50"
											: "border-border bg-white hover:border-teal-200 hover:bg-teal-50"
									}`}
								>
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e1e1e]">
										<svg viewBox="0 0 38 57" className="w-5 h-5" fill="none">
											<path
												d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"
												fill="#1ABCFE"
											/>
											<path
												d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"
												fill="#0ACF83"
											/>
											<path
												d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"
												fill="#FF7262"
											/>
											<path
												d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"
												fill="#F24E1E"
											/>
											<path
												d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"
												fill="#A259FF"
											/>
										</svg>
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium text-foreground">Figma</p>
										<p className="text-xs text-muted">
											{reqFigmaLinked
												? "The project has been linked"
												: "Link a Figma file to the request"}
										</p>
									</div>
									{reqFigmaLinked && (
										<span className="text-xs font-medium text-teal-50 bg-teal-600 px-2 py-1 rounded-lg">
											Linked
										</span>
									)}
								</button>
							</div>

							{/* Send */}
							<button
								onClick={handleSendRequest}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700 transition-all mt-2"
							>
								<IoSendOutline className="w-4 h-4" />
								Send Request
							</button>
						</div>
					)}

					{/* ═══ REQUEST: Sent confirmation ═══ */}
					{view === "req-sent" && (
						<div className="flex flex-col items-center justify-center py-16 animate-scale-in">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-4">
								<IoCheckmarkOutline className="w-8 h-8" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-1">
								Request Sent!
							</h3>
							<p className="text-sm text-muted text-center">
								{selectedPerson?.name} will receive your feedback request
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
