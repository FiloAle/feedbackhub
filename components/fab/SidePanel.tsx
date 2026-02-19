"use client";

import { useState, useEffect } from "react";
import {
	IconX,
	IconUser,
	IconClipboard,
	IconArrowLeft,
	IconSend,
	IconSparkles,
	IconCheck,
} from "@/components/icons/Icons";
import FeedbackStory from "@/components/feedback/FeedbackStory";
import { users, currentUser, projectTasks } from "@/lib/mock-data";
import { User } from "@/lib/types";

interface SidePanelProps {
	isOpen: boolean;
	onClose: () => void;
	lockedTarget?: User | null;
	onDailyComplete?: () => void;
	mode?: "send" | "request";
}

type PanelView =
	| "select"
	| "personal"
	| "pick-person"
	| "project"
	| "req-type"
	| "req-pick-person"
	| "req-personal-area"
	| "req-project-task"
	| "req-details"
	| "req-sent";

const aiSuggestions: Record<string, string> = {
	vague:
		"Il tuo feedback sembra generico. Prova a specificare un esempio concreto per renderlo più utile.",
	negative:
		"Il tono del feedback potrebbe risultare negativo. Prova a riformularlo in chiave costruttiva, suggerendo un'alternativa.",
	short:
		"Il feedback è molto breve. Aggiungere contesto aiuterebbe il destinatario a capire meglio il tuo punto di vista.",
	good: "",
};

function analyzeComment(text: string): string {
	if (text.length < 20 && text.length > 0) return aiSuggestions.short;
	const negativeWords = [
		"male",
		"sbagliato",
		"non funziona",
		"brutto",
		"pessimo",
		"orribile",
	];
	if (negativeWords.some((w) => text.toLowerCase().includes(w)))
		return aiSuggestions.negative;
	const vagueWords = ["ok", "bene", "carino", "nice", "va bene"];
	if (vagueWords.some((w) => text.toLowerCase().trim() === w))
		return aiSuggestions.vague;
	return aiSuggestions.good;
}

const personalAreas = [
	{ id: "partecipazione", emoji: "🙋", label: "Partecipazione" },
	{ id: "comunicazione", emoji: "💬", label: "Comunicazione" },
	{ id: "collaborazione", emoji: "🤝", label: "Collaborazione" },
	{ id: "leadership", emoji: "🎯", label: "Leadership" },
	{ id: "proattivita", emoji: "⚡", label: "Proattività" },
	{ id: "problem-solving", emoji: "🧠", label: "Problem Solving" },
];

export default function SidePanel({
	isOpen,
	onClose,
	lockedTarget,
	onDailyComplete,
	mode = "send",
}: SidePanelProps) {
	const [view, setView] = useState<PanelView>("select");

	useEffect(() => {
		if (isOpen && lockedTarget) {
			setView("personal");
		} else if (isOpen && mode === "request") {
			setView("req-type");
		} else if (isOpen) {
			setView("select");
		}
	}, [isOpen, lockedTarget, mode]);

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
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const handleFeedbackCompleted = () => {
		resetState();
		if (lockedTarget && onDailyComplete) {
			onDailyComplete();
		} else {
			onClose();
		}
	};

	const handleBack = () => {
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

	const handleSendRequest = () => {
		setView("req-sent");
		setTimeout(() => handleClose(), 1500);
	};

	if (!isOpen) return null;

	// Dynamic title
	const getTitle = () => {
		switch (view) {
			case "select":
				return "Invia Feedback";
			case "pick-person":
				return "Scegli Destinatario";
			case "personal":
				return "Feedback Personale";
			case "project":
				return "Feedback Progettuale";
			case "req-type":
				return "Richiedi Feedback";
			case "req-pick-person":
				return "Scegli Persona";
			case "req-personal-area":
				return "Area di Feedback";
			case "req-project-task":
				return "Seleziona Task";
			case "req-sent":
				return "Richiesta Inviata";
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
						{view !== "select" && view !== "req-type" && (
							<button
								onClick={handleBack}
								className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 text-muted transition-colors"
							>
								<IconArrowLeft className="w-4 h-4" />
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
						<IconX className="w-4 h-4" />
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto px-6 py-6">
					{/* ═══ SEND: Type selection ═══ */}
					{view === "select" && (
						<div className="space-y-3 animate-fade-in-up">
							<p className="text-sm text-muted mb-4">
								Che tipo di feedback vuoi inviare?
							</p>
							<button
								onClick={() => {
									if (lockedTarget) setView("personal");
									else setView("pick-person");
								}}
								className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-white p-5 text-left hover:border-sky-200 hover:bg-sky-50/50 transition-all group"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-accent group-hover:bg-accent group-hover:text-white transition-colors">
									<IconUser className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Feedback Personale
									</p>
									<p className="text-xs text-muted mt-0.5">
										Invia una valutazione personale a un collega
									</p>
								</div>
							</button>
							<button
								onClick={() => setView("project")}
								className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-white p-5 text-left hover:border-sky-200 hover:bg-sky-50/50 transition-all group"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-accent group-hover:bg-accent group-hover:text-white transition-colors">
									<IconClipboard className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Feedback Progettuale
									</p>
									<p className="text-xs text-muted mt-0.5">
										Lascia un commento su un task del progetto
									</p>
								</div>
							</button>
						</div>
					)}

					{/* ═══ SEND: Person picker ═══ */}
					{view === "pick-person" && (
						<div className="space-y-3 animate-fade-in-up">
							<p className="text-sm text-muted mb-2">
								A chi vuoi inviare il feedback?
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
										className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:border-sky-200 hover:bg-sky-50/50 transition-all"
									>
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent text-sm font-semibold">
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
								<select
									value={selectedTaskId}
									onChange={(e) => setSelectedTaskId(e.target.value)}
									className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
								>
									{projectTasks.map((t) => (
										<option key={t.id} value={t.id}>
											{t.title}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="text-sm font-medium text-foreground mb-1.5 block">
									Il tuo feedback
								</label>
								<textarea
									value={projectComment}
									onChange={(e) => setProjectComment(e.target.value)}
									placeholder="Scrivi il tuo feedback sul task... Sii specifico e costruttivo."
									rows={5}
									className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 resize-none"
								/>
							</div>
							{aiHint && (
								<div className="flex gap-3 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 p-4 animate-fade-in-up">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
										<IconSparkles className="w-4 h-4" />
									</div>
									<div>
										<p className="text-xs font-semibold text-accent mb-1">
											Suggerimento AI
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
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
							>
								<IconSend className="w-4 h-4" />
								Invia Commento
							</button>
						</div>
					)}

					{/* ═══ SEND: Project sent confirmation ═══ */}
					{view === "project" && commentSent && (
						<div className="flex flex-col items-center justify-center py-16 animate-scale-in">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
								<IconCheck className="w-8 h-8" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-1">
								Commento Inviato!
							</h3>
							<p className="text-sm text-muted">
								Il tuo feedback è stato aggiunto al task
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
								Che tipo di feedback vuoi richiedere?
							</p>
							<button
								onClick={() => {
									setReqType("personal");
									setView("req-pick-person");
								}}
								className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-white p-5 text-left hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
									<IconUser className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Feedback Personale
									</p>
									<p className="text-xs text-muted mt-0.5">
										Chiedi un feedback su un tuo aspetto personale
									</p>
								</div>
							</button>
							<button
								onClick={() => {
									setReqType("project");
									setView("req-pick-person");
								}}
								className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-white p-5 text-left hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
									<IconClipboard className="w-6 h-6" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										Feedback Progettuale
									</p>
									<p className="text-xs text-muted mt-0.5">
										Chiedi un feedback su un task specifico
									</p>
								</div>
							</button>
						</div>
					)}

					{/* ═══ REQUEST: Person picker ═══ */}
					{view === "req-pick-person" && (
						<div className="space-y-3 animate-fade-in-up">
							<p className="text-sm text-muted mb-2">
								Da chi vuoi ricevere il feedback?
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
										className="flex w-full items-center gap-3 rounded-xl border border-border bg-white p-4 text-left hover:border-violet-200 hover:bg-violet-50/50 transition-all"
									>
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-sm font-semibold">
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
								Su quale area vuoi ricevere feedback da{" "}
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
										className={`flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-left transition-all ${
											reqSelectedArea === area.id
												? "border-violet-400 bg-violet-50"
												: "border-border bg-white hover:border-violet-200 hover:bg-violet-50/50"
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
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-4"
							>
								Avanti
							</button>
						</div>
					)}

					{/* ═══ REQUEST: Project task selection ═══ */}
					{view === "req-project-task" && (
						<div className="space-y-4 animate-fade-in-up">
							<p className="text-sm text-muted mb-2">
								Su quale task vuoi ricevere feedback da{" "}
								<span className="font-medium text-foreground">
									{selectedPerson?.name}
								</span>
								?
							</p>
							<div className="space-y-2">
								{projectTasks.map((task) => (
									<button
										key={task.id}
										onClick={() => setReqSelectedTask(task.id)}
										className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
											reqSelectedTask === task.id
												? "border-violet-400 bg-violet-50"
												: "border-border bg-white hover:border-violet-200 hover:bg-violet-50/50"
										}`}
									>
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
											<IconClipboard className="w-4 h-4" />
										</div>
										<div>
											<p className="text-sm font-medium text-foreground">
												{task.title}
											</p>
											<p className="text-xs text-muted mt-0.5">
												{task.projectName}
											</p>
										</div>
									</button>
								))}
							</div>
							<button
								onClick={() => setView("req-details")}
								disabled={!reqSelectedTask}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2"
							>
								Avanti
							</button>
						</div>
					)}

					{/* ═══ REQUEST: Details — notes, attachments, integrations ═══ */}
					{view === "req-details" && (
						<div className="space-y-5 animate-fade-in-up">
							{/* Notes */}
							<div>
								<label className="text-sm font-medium text-foreground mb-1.5 block">
									Note aggiuntive{" "}
									<span className="text-muted font-normal">(opzionale)</span>
								</label>
								<textarea
									value={reqNotes}
									onChange={(e) => setReqNotes(e.target.value)}
									placeholder="Es: Mi piacerebbe avere un parere sull'usabilità del flusso di checkout..."
									rows={3}
									className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/10 resize-none"
								/>
							</div>

							{/* Attachments */}
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">
									Allegati
								</label>
								{reqAttachments.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-3">
										{reqAttachments.map((name) => (
											<div
												key={name}
												className="flex items-center gap-1.5 bg-violet-50 text-violet-700 rounded-lg px-2.5 py-1.5 text-xs font-medium"
											>
												📎 {name}
												<button
													onClick={() =>
														setReqAttachments(
															reqAttachments.filter((a) => a !== name),
														)
													}
													className="text-violet-400 hover:text-violet-700 ml-0.5"
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
										className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border bg-white px-4 py-3 text-sm text-muted hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50 transition-all flex-1"
									>
										<span className="text-lg">📷</span>
										Immagini
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
										className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border bg-white px-4 py-3 text-sm text-muted hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50 transition-all flex-1"
									>
										<span className="text-lg">📄</span>
										Documenti
									</button>
								</div>
							</div>

							{/* Integrations */}
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">
									Integrazioni
								</label>
								<button
									onClick={() => setReqFigmaLinked(!reqFigmaLinked)}
									className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
										reqFigmaLinked
											? "border-violet-400 bg-violet-50"
											: "border-border bg-white hover:border-violet-200"
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
												? "Progetto collegato ✓"
												: "Collega un file Figma alla richiesta"}
										</p>
									</div>
									{reqFigmaLinked && (
										<span className="text-xs font-medium text-violet-600 bg-violet-100 px-2 py-1 rounded-lg">
											Collegato
										</span>
									)}
								</button>
							</div>

							{/* Send */}
							<button
								onClick={handleSendRequest}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700 transition-all mt-2"
							>
								<IconSend className="w-4 h-4" />
								Invia Richiesta
							</button>
						</div>
					)}

					{/* ═══ REQUEST: Sent confirmation ═══ */}
					{view === "req-sent" && (
						<div className="flex flex-col items-center justify-center py-16 animate-scale-in">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-4">
								<IconCheck className="w-8 h-8" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-1">
								Richiesta Inviata!
							</h3>
							<p className="text-sm text-muted text-center">
								{selectedPerson?.name} riceverà la tua richiesta di feedback
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
