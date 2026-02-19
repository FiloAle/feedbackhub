"use client";

import { useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import FAB from "@/components/fab/FAB";
import SidePanel from "@/components/fab/SidePanel";
import ProjectComment from "@/components/feedback/ProjectComment";
import {
	IconSparkles,
	IconChevronRight,
	IconStar,
	IconSend,
	IconTrendingUp,
	IconMessage,
	IconCheck,
} from "@/components/icons/Icons";
import {
	currentUser,
	users,
	personalFeedbacks,
	projectTasks as initialTasks,
	weeklyRecap,
} from "@/lib/mock-data";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { User, PersonalFeedback, ProjectTask } from "@/lib/types";

type MainTab = "progettuali" | "eventi" | "personali";
type SubTab = "ricevuti" | "inviati";

function getRatingLabel(feedbacks: PersonalFeedback[]): string {
	if (feedbacks.length === 0) return "–";
	const avg =
		feedbacks.reduce(
			(sum, f) =>
				sum + f.sliders.reduce((s, sl) => s + sl.value, 0) / f.sliders.length,
			0,
		) / feedbacks.length;
	if (avg >= 9) return "Eccellente";
	if (avg >= 7) return "Ottima";
	if (avg >= 5) return "Buona";
	return "Scarsa";
}

export default function Home() {
	const [isPanelOpen, setIsPanelOpen] = useState(false);
	const [panelLockedTarget, setPanelLockedTarget] = useState<User | null>(null);
	const [panelMode, setPanelMode] = useState<"send" | "request">("send");
	const [fabExpanded, setFabExpanded] = useState(false);
	const dailyTarget = users.find((u) => u.id === "u2")!;
	const [dailyFeedbackSent, setDailyFeedbackSent] = useState(false);

	// Tabs
	const [mainTab, setMainTab] = useState<MainTab>("progettuali");
	const [subTab, setSubTab] = useState<SubTab>("ricevuti");

	// Selection
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [projectFilter, setProjectFilter] = useState<string | null>(null);
	const [selectedPersonalId, setSelectedPersonalId] = useState<string | null>(
		null,
	);

	// Project tasks state (local for toggling statuses)
	const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
	// Personal feedback state (for thumbs up)
	const [personalFbs, setPersonalFbs] =
		useState<PersonalFeedback[]>(personalFeedbacks);

	// ─── Computed ─────────────────────────────────────────────────────────
	const receivedPersonal = useMemo(
		() =>
			personalFbs
				.filter((f) => f.toUserId === currentUser.id)
				.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
				),
		[personalFbs],
	);
	const sentPersonal = useMemo(
		() =>
			personalFbs
				.filter((f) => f.fromUserId === currentUser.id)
				.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
				),
		[personalFbs],
	);

	const receivedProjects = useMemo(
		() =>
			tasks
				.filter((t) => t.assigneeId === currentUser.id)
				.sort(
					(a, b) =>
						new Date(b.receivedDate).getTime() -
						new Date(a.receivedDate).getTime(),
				),
		[tasks],
	);
	const sentProjects = useMemo(
		() =>
			tasks
				.filter((t) => t.fromUserId === currentUser.id)
				.sort(
					(a, b) =>
						new Date(b.receivedDate).getTime() -
						new Date(a.receivedDate).getTime(),
				),
		[tasks],
	);

	// Stats
	const totalReceived = receivedPersonal.length + receivedProjects.length;
	const totalSent = sentPersonal.length + sentProjects.length;
	const ratingLabel = getRatingLabel(receivedPersonal);
	const totalAll = totalReceived + totalSent;

	const stats = [
		{
			label: "Ricevuti",
			value: totalReceived,
			icon: IconStar,
			color: "bg-sky-50 text-accent",
		},
		{
			label: "Inviati",
			value: totalSent,
			icon: IconSend,
			color: "bg-emerald-50 text-emerald-600",
		},
		{
			label: "Valutazione",
			value: ratingLabel,
			icon: IconTrendingUp,
			color: "bg-amber-50 text-amber-600",
		},
		{
			label: "Totale",
			value: totalAll,
			icon: IconMessage,
			color: "bg-violet-50 text-violet-600",
		},
	];

	// Selected items
	const selectedProject = tasks.find((t) => t.id === selectedProjectId) || null;
	const selectedPersonal =
		personalFbs.find((f) => f.id === selectedPersonalId) || null;

	// ─── Actions ──────────────────────────────────────────────────────────
	const toggleProjectCompleted = (id: string) => {
		setTasks((prev) =>
			prev.map((t) =>
				t.id === id
					? {
						...t,
						completedByReceiver: !t.completedByReceiver,
						ignoredByReceiver: false,
					}
					: t,
			),
		);
	};

	const toggleProjectIgnored = (id: string) => {
		setTasks((prev) =>
			prev.map((t) =>
				t.id === id
					? {
						...t,
						ignoredByReceiver: !t.ignoredByReceiver,
						completedByReceiver: false,
					}
					: t,
			),
		);
	};

	const toggleProjectUseful = (id: string) => {
		setTasks((prev) =>
			prev.map((t) =>
				t.id === id ? { ...t, markedUseful: !t.markedUseful } : t,
			),
		);
	};

	const togglePersonalUseful = (id: string) => {
		setPersonalFbs((prev) =>
			prev.map((f) =>
				f.id === id ? { ...f, markedUseful: !f.markedUseful } : f,
			),
		);
	};

	const handleDailyFeedbackComplete = () => {
		setDailyFeedbackSent(true);
		setIsPanelOpen(false);
		setPanelLockedTarget(null);
	};

	// ─── Current lists ───────────────────────────────────────────────────
	const baseProjectList =
		subTab === "ricevuti" ? receivedProjects : sentProjects;
	const currentProjectList = projectFilter
		? baseProjectList.filter((t) => t.projectName === projectFilter)
		: baseProjectList;

	// Unique project names for filter
	const projectNames = useMemo(
		() => [...new Set(tasks.map((t) => t.projectName))].sort(),
		[tasks],
	);
	const currentPersonalList =
		subTab === "ricevuti" ? receivedPersonal : sentPersonal;

	return (
		<AppShell
			title="Buongiorno, Marco 👋"
			subtitle="Mercoledì 19 Febbraio 2026"
		>
			<div className="max-w-5xl space-y-6 pb-24">
				{/* ─── Stats Recap ─── */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in-up">
					{stats.map((s) => (
						<div
							key={s.label}
							className="rounded-2xl border border-border bg-white p-4 flex items-center gap-3"
						>
							<div
								className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}
							>
								<s.icon className="w-5 h-5" />
							</div>
							<div>
								<p className="text-xs text-muted">{s.label}</p>
								<p className="text-lg font-bold text-foreground">{s.value}</p>
							</div>
						</div>
					))}
				</div>

				{/* ─── Weekly Recap ─── */}
				<section
					className="animate-fade-in-up"
					style={{ animationDelay: "0.05s" }}
				>
					<div className="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-indigo-50 border border-sky-100 p-5">
						<div className="flex items-start gap-4">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
								<IconSparkles className="w-5 h-5" />
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1.5">
									<h3 className="text-sm font-semibold text-accent">
										Recap settimanale
									</h3>
									<span className="text-xs text-muted bg-white/80 px-2 py-0.5 rounded-full border border-sky-100">
										{weeklyRecap.feedbackCount} feedback
									</span>
								</div>
								<p className="text-sm text-foreground/80 leading-relaxed">
									{weeklyRecap.phrase}
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* ─── Section Title ─── */}
				<h2
					className="text-lg font-semibold text-foreground animate-fade-in-up"
					style={{ animationDelay: "0.07s" }}
				>
					Dai un&apos;occhiata ai tuoi feedback
				</h2>

				{/* ─── Navbar (3 tabs) ─── */}
				<div
					className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 animate-fade-in-up"
					style={{ animationDelay: "0.1s" }}
				>
					{(["progettuali", "eventi", "personali"] as MainTab[]).map((tab) => (
						<button
							key={tab}
							onClick={() => {
								setMainTab(tab);
								setSelectedProjectId(null);
								setSelectedPersonalId(null);
							}}
							className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize ${mainTab === tab
								? "bg-white text-foreground shadow-sm"
								: "text-muted hover:text-foreground"
								}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* ─── Sub-tab: Ricevuti / Inviati ─── */}
				<div
					className="flex items-center gap-4 animate-fade-in-up"
					style={{ animationDelay: "0.12s" }}
				>
					{(["ricevuti", "inviati"] as SubTab[]).map((tab) => (
						<button
							key={tab}
							onClick={() => {
								setSubTab(tab);
								setSelectedProjectId(null);
								setSelectedPersonalId(null);
							}}
							className={`text-sm font-medium pb-1 border-b-2 transition-all capitalize ${subTab === tab
								? "border-accent text-accent"
								: "border-transparent text-muted hover:text-foreground"
								}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* ─── Content: List + Detail ─── */}
				<div
					className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[400px] animate-fade-in-up"
					style={{ animationDelay: "0.14s" }}
				>
					{/* ═══════ PROGETTUALI TAB ═══════ */}
					{mainTab === "progettuali" && (
						<>
							{/* List */}
							<div className="lg:col-span-2 space-y-2 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
								{/* Project filter chips */}
								<div className="flex items-center gap-2 flex-wrap pb-1">
									<button
										onClick={() => setProjectFilter(null)}
										className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${projectFilter === null
											? "bg-accent text-white"
											: "bg-gray-100 text-muted hover:bg-gray-200"
											}`}
									>
										Tutti
									</button>
									{projectNames.map((name) => (
										<button
											key={name}
											onClick={() =>
												setProjectFilter(projectFilter === name ? null : name)
											}
											className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${projectFilter === name
												? "bg-accent text-white"
												: "bg-gray-100 text-muted hover:bg-gray-200"
												}`}
										>
											{name}
										</button>
									))}
								</div>
								{currentProjectList.length > 0 ? (
									currentProjectList.map((task) => {
										const isSelected = selectedProjectId === task.id;
										const sender = users.find((u) => u.id === task.fromUserId);
										const receiver = users.find(
											(u) => u.id === task.assigneeId,
										);
										const other = subTab === "ricevuti" ? sender : receiver;
										return (
											<div
												key={task.id}
												onClick={() => setSelectedProjectId(task.id)}
												className={`rounded-xl border p-3.5 cursor-pointer transition-all ${isSelected
													? "border-accent bg-accent-light/50"
													: "border-border bg-white hover:border-sky-200"
													}`}
											>
												<div className="flex items-center justify-between mb-1">
													<div className="flex items-center gap-2">
														<span
															className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}
														>
															{getStatusLabel(task.status)}
														</span>
														{task.completedByReceiver && (
															<span className="text-[10px] text-emerald-600">
																✓ completato
															</span>
														)}
													</div>
													<span className="text-[10px] text-muted">
														{formatDate(task.receivedDate)}
													</span>
												</div>
												<p className="text-sm font-medium text-foreground truncate">
													{task.title}
												</p>
												{other && (
													<p className="text-xs text-muted mt-0.5">
														{subTab === "ricevuti" ? "Da" : "A"} {other.name}
													</p>
												)}
											</div>
										);
									})
								) : (
									<p className="text-sm text-muted text-center py-12">
										Nessun feedback.
									</p>
								)}
							</div>

							{/* Detail */}
							<div className="lg:col-span-3 rounded-2xl border border-border bg-white p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
								{selectedProject ? (
									<div className="animate-fade-in">
										{/* Header */}
										<div className="flex items-start justify-between mb-4">
											<div>
												<h3 className="text-base font-semibold text-foreground mb-1">
													{selectedProject.title}
												</h3>
												<p className="text-xs text-muted">
													{subTab === "ricevuti" ? "Da" : "A"}{" "}
													{
														users.find(
															(u) =>
																u.id ===
																(subTab === "ricevuti"
																	? selectedProject.fromUserId
																	: selectedProject.assigneeId),
														)?.name
													}{" "}
													· {formatDate(selectedProject.receivedDate)}
												</p>
											</div>
											<span
												className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${getStatusColor(selectedProject.status)}`}
											>
												{getStatusLabel(selectedProject.status)}
											</span>
										</div>

										{/* Description */}
										<p className="text-sm text-foreground/80 leading-relaxed mb-5 pb-5 border-b border-border">
											{selectedProject.description}
										</p>

										{/* Comments */}
										{selectedProject.comments.length > 0 && (
											<div className="space-y-3 mb-5 pb-5 border-b border-border">
												<p className="text-xs font-medium text-muted uppercase tracking-wider">
													Commenti
												</p>
												{selectedProject.comments.map((c) => (
													<ProjectComment key={c.id} comment={c} />
												))}
											</div>
										)}

										{/* Actions — ricevuti */}
										{subTab === "ricevuti" && (
											<div className="space-y-3">
												<div className="flex items-center gap-2">
													<button
														onClick={() =>
															toggleProjectCompleted(selectedProject.id)
														}
														className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all ${selectedProject.completedByReceiver
															? "bg-emerald-100 text-emerald-700"
															: "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
															}`}
													>
														<IconCheck className="w-3.5 h-3.5" />
														{selectedProject.completedByReceiver
															? "Completato"
															: "Segna come completato"}
													</button>
													{!selectedProject.completedByReceiver && (
														<button
															onClick={() =>
																toggleProjectIgnored(selectedProject.id)
															}
															className={`text-xs font-medium px-3 py-2 rounded-lg transition-all ${selectedProject.ignoredByReceiver
																? "bg-gray-200 text-gray-700"
																: "bg-gray-100 text-gray-500 hover:bg-gray-200"
																}`}
														>
															{selectedProject.ignoredByReceiver
																? "Ignorato"
																: "Ignora"}
														</button>
													)}
												</div>

												{/* useful prompt after completion */}
												{selectedProject.completedByReceiver && (
													<div className="flex items-center gap-2 p-3 rounded-lg bg-sky-50 border border-sky-100 animate-fade-in">
														<p className="text-xs text-foreground flex-1">
															Questo feedback è stato utile?
														</p>
														<button
															onClick={() =>
																toggleProjectUseful(selectedProject.id)
															}
															className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${selectedProject.markedUseful
																? "bg-accent text-white"
																: "bg-white text-accent border border-accent hover:bg-accent/10"
																}`}
														>
															{selectedProject.markedUseful
																? "👍 Utile!"
																: "👍 Sì"}
														</button>
													</div>
												)}
											</div>
										)}

										{/* Actions — inviati: show receiver status */}
										{subTab === "inviati" && (
											<div className="p-3 rounded-lg bg-gray-50 border border-border">
												<p className="text-xs text-muted">
													Stato:{" "}
													{selectedProject.completedByReceiver ? (
														<span className="text-emerald-600 font-medium">
															✓ Completato
															{selectedProject.markedUseful
																? " · 👍 Utile"
																: ""}
														</span>
													) : selectedProject.ignoredByReceiver ? (
														<span className="text-gray-500 font-medium">
															Ignorato
														</span>
													) : (
														<span className="text-amber-600 font-medium">
															In attesa
														</span>
													)}
												</p>
											</div>
										)}
									</div>
								) : (
									<div className="flex items-center justify-center h-full text-sm text-muted">
										Seleziona un feedback per vederne i dettagli
									</div>
								)}
							</div>
						</>
					)}

					{/* ═══════ EVENTI TAB ═══════ */}
					{mainTab === "eventi" && (
						<div className="lg:col-span-5 flex items-center justify-center rounded-2xl border border-dashed border-border bg-gray-50 min-h-[300px]">
							<div className="text-center">
								<p className="text-3xl mb-2">📅</p>
								<p className="text-sm font-medium text-foreground mb-1">
									Prossimamente
								</p>
								<p className="text-xs text-muted">
									La sezione eventi sarà disponibile a breve
								</p>
							</div>
						</div>
					)}

					{/* ═══════ PERSONALI TAB ═══════ */}
					{mainTab === "personali" && (
						<>
							{/* List */}
							<div className="lg:col-span-2 space-y-2 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
								{currentPersonalList.length > 0 ? (
									currentPersonalList.map((fb) => {
										const isSelected = selectedPersonalId === fb.id;
										const other = users.find(
											(u) =>
												u.id ===
												(subTab === "ricevuti" ? fb.fromUserId : fb.toUserId),
										);
										return (
											<div
												key={fb.id}
												onClick={() => setSelectedPersonalId(fb.id)}
												className={`rounded-xl border p-3.5 cursor-pointer transition-all ${isSelected
													? "border-accent bg-accent-light/50"
													: "border-border bg-white hover:border-sky-200"
													}`}
											>
												<div className="flex items-center justify-between mb-1">
													<span className="text-xl">{fb.reaction}</span>
													<span className="text-[10px] text-muted">
														{formatDate(fb.date)}
													</span>
												</div>
												<p className="text-sm text-foreground/80 truncate">
													{subTab === "ricevuti" ? fb.summary : fb.message}
												</p>
												{subTab === "inviati" && other && (
													<p className="text-xs text-muted mt-0.5">
														A {other.name}
													</p>
												)}
												{fb.markedUseful && (
													<span className="text-[10px] text-accent mt-1 inline-block">
														👍 Utile
													</span>
												)}
											</div>
										);
									})
								) : (
									<p className="text-sm text-muted text-center py-12">
										Nessun feedback.
									</p>
								)}
							</div>

							{/* Detail */}
							<div className="lg:col-span-3 rounded-2xl border border-border bg-white p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
								{selectedPersonal ? (
									(() => {
										const other = users.find(
											(u) =>
												u.id ===
												(subTab === "ricevuti"
													? selectedPersonal.fromUserId
													: selectedPersonal.toUserId),
										);
										return (
											<div className="animate-fade-in">
												<div className="flex items-start justify-between mb-4">
													{subTab === "ricevuti" ? (
														<>
															<p className="text-xs text-muted">
																{formatDate(selectedPersonal.date)}
															</p>
															<span className="text-3xl">
																{selectedPersonal.reaction}
															</span>
														</>
													) : (
														<>
															<div className="flex items-center gap-3">
																{other && (
																	<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent text-sm font-semibold">
																		{other.avatar}
																	</div>
																)}
																<div>
																	<p className="text-sm font-semibold text-foreground">
																		A {other?.name || ""}
																	</p>
																	<p className="text-xs text-muted">
																		{other?.role} ·{" "}
																		{formatDate(selectedPersonal.date)}
																	</p>
																</div>
															</div>
															<span className="text-3xl">
																{selectedPersonal.reaction}
															</span>
														</>
													)}
												</div>

												<div className="mb-5 pb-5 border-b border-border">
													{subTab === "inviati" && (
														<p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
															Messaggio
														</p>
													)}
													<p className="text-sm text-foreground/80 leading-relaxed">
														{subTab === "ricevuti"
															? selectedPersonal.summary
															: selectedPersonal.message}
													</p>
												</div>

												{/* Thumbs up — only for received */}
												{subTab === "ricevuti" && (
													<button
														onClick={() =>
															togglePersonalUseful(selectedPersonal.id)
														}
														className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all ${selectedPersonal.markedUseful
															? "bg-accent text-white"
															: "bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-accent"
															}`}
													>
														👍{" "}
														{selectedPersonal.markedUseful
															? "Feedback utile!"
															: "Segna come utile"}
													</button>
												)}

												{/* Sent view — show if marked useful */}
												{subTab === "inviati" &&
													selectedPersonal.markedUseful && (
														<div className="p-3 rounded-lg bg-sky-50 border border-sky-100">
															<p className="text-xs text-accent font-medium">
																👍 Il destinatario ha trovato utile questo
																feedback
															</p>
														</div>
													)}
											</div>
										);
									})()
								) : (
									<div className="flex items-center justify-center h-full text-sm text-muted">
										Seleziona un feedback per vederne i dettagli
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>

			{/* ─── Floating Daily Feedback Banner ─── */}
			{!dailyFeedbackSent && (
				<div className="fixed bottom-8 left-64 right-0 z-40 flex justify-center pointer-events-none animate-fade-in-up">
					<div className="flex items-center gap-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-2xl p-4 shadow-lg pointer-events-auto w-[560px]">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
							{dailyTarget.avatar}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-[10px] font-medium text-sky-200 uppercase tracking-wider">
								Feedback giornaliero
							</p>
							<p className="text-sm">
								Invia il tuo feedback personale a{" "}
								<span className="font-semibold">{dailyTarget.name}</span>
							</p>
						</div>
						<button
							onClick={() => {
								setPanelLockedTarget(dailyTarget);
								setPanelMode("send");
								setFabExpanded(false);
								setIsPanelOpen(true);
							}}
							className="shrink-0 flex items-center gap-1.5 rounded-lg bg-white text-sky-700 px-4 py-2 text-sm font-semibold hover:bg-sky-50 transition-all active:scale-95"
						>
							Invia
							<IconChevronRight className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			)}

			{/* FAB + SidePanel */}
			<FAB
				isExpanded={fabExpanded}
				onToggle={() => setFabExpanded(!fabExpanded)}
				onSend={() => {
					setFabExpanded(false);
					setPanelLockedTarget(null);
					setPanelMode("send");
					setIsPanelOpen(true);
				}}
				onRequest={() => {
					setFabExpanded(false);
					setPanelLockedTarget(null);
					setPanelMode("request");
					setIsPanelOpen(true);
				}}
			/>
			<SidePanel
				isOpen={isPanelOpen}
				onClose={() => {
					setIsPanelOpen(false);
					setPanelLockedTarget(null);
				}}
				lockedTarget={panelLockedTarget}
				onDailyComplete={handleDailyFeedbackComplete}
				mode={panelMode}
			/>
		</AppShell>
	);
}
