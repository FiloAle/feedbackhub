"use client";

import { useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import FAB from "@/components/fab/FAB";
import SidePanel from "@/components/fab/SidePanel";
import WrappedStories from "@/components/wrapped/WrappedStories";

import {
	IoFlashOutline,
	IoChevronForwardOutline,
	IoDownloadOutline,
	IoPaperPlaneOutline,
	IoCheckmarkOutline,
} from "react-icons/io5";
import {
	currentUser,
	users,
	personalFeedbacks,
	projectTasks as initialTasks,
	weeklyRecap,
} from "@/lib/mock-data";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { User, PersonalFeedback, ProjectTask, TaskStatus } from "@/lib/types";
import { getTraitById, reactionsData } from "@/lib/feedback-data";

type MainTab = "projects" | "events" | "personal";
type SubTab = "received" | "sent";

function getPositivePercent(feedbacks: PersonalFeedback[]): number {
	if (feedbacks.length === 0) return 0;
	const positive = feedbacks.filter((f) => {
		const avg = f.sliders.reduce((s, sl) => s + sl.value, 0) / f.sliders.length;
		return avg >= 7;
	}).length;
	return Math.round((positive / feedbacks.length) * 100);
}

export default function Home() {
	const [isPanelOpen, setIsPanelOpen] = useState(false);
	const [panelLockedTarget, setPanelLockedTarget] = useState<User | null>(null);
	const [panelMode, setPanelMode] = useState<"send" | "request">("send");
	const [panelWeeklyTargets, setPanelWeeklyTargets] = useState<
		User[] | undefined
	>(undefined);
	const [fabExpanded, setFabExpanded] = useState(false);

	// Weekly feedback targets (2 random colleagues)
	const weeklyTargets = useMemo(
		() => [
			users.find((u) => u.id === "u2")!,
			users.find((u) => u.id === "u4")!,
		],
		[],
	);
	const [weeklyFeedbackSent, setWeeklyFeedbackSent] = useState<Set<string>>(
		new Set(),
	);

	// Friday deadline helpers
	const getWeeklyDeadlineLabel = () => {
		const now = new Date();
		const dayOfWeek = now.getDay(); // 0=Sun, 5=Fri
		if (dayOfWeek === 5) {
			// It's Friday — show hours remaining until midnight
			const endOfDay = new Date(now);
			endOfDay.setHours(23, 59, 59, 999);
			const hoursLeft = Math.max(
				1,
				Math.ceil((endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60)),
			);
			return `${hoursLeft}h left`;
		}
		// Days until Friday
		const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
		return `${daysUntilFriday} day${daysUntilFriday !== 1 ? "s" : ""} left`;
	};

	const remainingTargets = weeklyTargets.filter(
		(t) => !weeklyFeedbackSent.has(t.id),
	);

	// Tabs
	const [mainTab, setMainTab] = useState<MainTab>("projects");
	const [subTab, setSubTab] = useState<SubTab>("received");

	// Selection
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		null,
	);
	const [projectFilter, setProjectFilter] = useState<string | null>(null);
	const [sortAsc, setSortAsc] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [selectedPersonalId, setSelectedPersonalId] = useState<string | null>(
		null,
	);

	// Project tasks state (local for toggling statuses)
	const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
	// Personal feedback state (for thumbs up)
	const [personalFbs, setPersonalFbs] =
		useState<PersonalFeedback[]>(personalFeedbacks);

	// Status dropdown & ignore confirmation
	const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
	const [ignoreConfirmId, setIgnoreConfirmId] = useState<string | null>(null);
	const [wrappedOpen, setWrappedOpen] = useState(false);

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
	const receivedPositive = getPositivePercent(receivedPersonal);
	const sentPositive = getPositivePercent(sentPersonal);

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
							status: !t.completedByReceiver
								? "done"
								: t.status === "done"
									? "in-progress"
									: t.status,
						}
					: t,
			),
		);
	};

	const confirmIgnoreProject = (id: string) => {
		setTasks((prev) => prev.filter((t) => t.id !== id));
		setIgnoreConfirmId(null);
		setSelectedProjectId(null);
	};

	const setProjectStatus = (id: string, status: TaskStatus) => {
		setTasks((prev) =>
			prev.map((t) =>
				t.id === id
					? {
							...t,
							status,
							completedByReceiver: status === "done",
						}
					: t,
			),
		);
		setStatusDropdownOpen(false);
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

	const handleWeeklyFeedbackComplete = (completedUser?: User | null) => {
		const targetUser = completedUser || panelLockedTarget;
		if (targetUser) {
			setWeeklyFeedbackSent((prev) => {
				const next = new Set(prev);
				next.add(targetUser.id);
				return next;
			});
		}
		setIsPanelOpen(false);
		setPanelLockedTarget(null);
		setPanelWeeklyTargets(undefined);
	};

	// ─── Current lists ───────────────────────────────────────────────────
	const baseProjectList =
		subTab === "received" ? receivedProjects : sentProjects;
	const currentProjectList = (
		projectFilter
			? baseProjectList.filter((t) => t.projectName === projectFilter)
			: baseProjectList
	).sort((a, b) => {
		const da = new Date(a.receivedDate).getTime();
		const db = new Date(b.receivedDate).getTime();
		return sortAsc ? da - db : db - da;
	});

	// Unique project names for filter
	const projectNames = useMemo(
		() => [...new Set(tasks.map((t) => t.projectName))].sort(),
		[tasks],
	);
	const currentPersonalList = (
		subTab === "received" ? receivedPersonal : sentPersonal
	).sort((a, b) => {
		const da = new Date(a.date).getTime();
		const db = new Date(b.date).getTime();
		return sortAsc ? da - db : db - da;
	});

	const handleWeeklyReminderOpen = () => {
		setPanelLockedTarget(null);
		setPanelMode("send");
		setPanelWeeklyTargets(remainingTargets);
		setFabExpanded(false);
		setIsPanelOpen(true);
	};

	return (
		<AppShell
			title={`Good morning, ${currentUser.name.split(" ")[0]} 👋`}
			subtitle={new Intl.DateTimeFormat("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
			}).format(new Date())}
			onWeeklyReminderClick={handleWeeklyReminderOpen}
		>
			<div className="max-w-5xl space-y-6 pb-24">
				{/* ─── Scopri il tuo recap annuale ─── */}
				<div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
					<div
						onClick={() => setWrappedOpen(true)}
						className="relative rounded-2xl border border-fuchsia-100 bg-fuchsia-50 p-5 flex items-center justify-between cursor-pointer hover:shadow-md hover:scale-[100.5%] transition-all duration-300 group overflow-hidden hover:border-fuchsia-400"
					>
						{/* Gradient overlay — fades in on hover */}
						<div className="absolute inset-0 -m-5 bg-gradient-to-r from-fuchsia-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<div className="relative z-10">
							<h3 className="text-3xl font-extrabold text-fuchsia-500 group-hover:text-white transition-colors duration-300">
								Wrapped 2026
							</h3>
							<p className="text-md font-medium text-fuchsia-400 group-hover:text-white/80 transition-colors duration-300">
								Your year in Hubby
							</p>
						</div>
						<div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-fuchsia-100 text-fuchsia-500 group-hover:bg-white/15 group-hover:text-white group-hover:scale-105 transition-all duration-300">
							<svg
								className="w-7 h-7"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* ─── Stats + Weekly Recap Row ─── */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-3 animate-fade-in-up">
					{/* Received card */}
					<div className="rounded-2xl border border-border bg-teal-50 p-5 flex flex-col justify-between border-teal-100">
						<div className="flex items-center gap-3 mb-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
								<IoDownloadOutline className="w-6 h-6 -mt-0.5" />
							</div>
							<div>
								<p className="text-sm font-semibold text-teal-600 mb-0.5">
									Received
								</p>
								<p className="text-2xl font-bold text-foreground leading-none">
									{totalReceived}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="flex-1 h-1.5 bg-black/15 rounded-full overflow-hidden">
								<div
									className="h-full bg-teal-600 rounded-full"
									style={{ width: `${receivedPositive}%` }}
								/>
							</div>
							<span className="text-xs font-medium text-teal-600">
								{receivedPositive}% positive
							</span>
						</div>
					</div>

					{/* Sent card */}
					<div className="rounded-2xl border border-border bg-lime-50 p-5 flex flex-col justify-between border-lime-200">
						<div className="flex items-center gap-3 mb-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime-600 text-white">
								<IoPaperPlaneOutline className="w-5.5 h-5.5 -ms-0.5" />
							</div>
							<div>
								<p className="text-sm font-semibold text-lime-600 mb-0.5">
									Sent
								</p>
								<p className="text-2xl font-bold text-foreground leading-none">
									{totalSent}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="flex-1 h-1.5 bg-black/15 rounded-full overflow-hidden">
								<div
									className="h-full bg-lime-600 rounded-full"
									style={{ width: `${sentPositive}%` }}
								/>
							</div>
							<span className="text-xs font-medium text-lime-600">
								{sentPositive}% positive
							</span>
						</div>
					</div>

					{/* Weekly Recap — spans 2 cols */}
					<div className="lg:col-span-2 rounded-2xl bg-sky-50 border border-sky-100 p-5 flex flex-col justify-center">
						<div className="flex items-start gap-4">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-800 text-white">
								<IoFlashOutline className="w-5.5 h-5.5" />
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1.5">
									<h3 className="text-sm font-semibold text-sky-800">
										Weekly Recap
									</h3>
								</div>
								<p className="text-sm text-foreground/80 leading-relaxed">
									{weeklyRecap.phrase}
								</p>
							</div>
						</div>
					</div>
				</div>

				<h2
					className="text-lg font-semibold text-foreground animate-fade-in-up mt-8"
					style={{ animationDelay: "0.07s" }}
				>
					Take a look at your feedback
				</h2>

				{/* ─── Navbar (3 tabs) ─── */}
				<div
					className="flex items-center gap-1 bg-sky-50 border border-sky-100 rounded-xl p-1 animate-fade-in-up"
					style={{ animationDelay: "0.1s" }}
				>
					{(["projects", "events", "personal"] as MainTab[]).map((tab) => (
						<button
							key={tab}
							onClick={() => {
								setMainTab(tab);
								setSelectedProjectId(null);
								setSelectedPersonalId(null);
							}}
							className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize ${
								mainTab === tab
									? "bg-sky-800 text-white shadow-sm"
									: "text-sky-800 hover:cursor-pointer"
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* ─── Sub-tab ─── */}
				<div
					className="flex items-center gap-4 animate-fade-in-up"
					style={{ animationDelay: "0.12s" }}
				>
					{(["received", "sent"] as SubTab[]).map((tab) => (
						<button
							key={tab}
							onClick={() => {
								setSubTab(tab);
								setSelectedProjectId(null);
								setSelectedPersonalId(null);
							}}
							className={`text-sm font-medium pb-1 border-b-2 transition-all capitalize ${
								subTab === tab
									? "border-sky-800 text-sky-800"
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
					{mainTab === "projects" && (
						<>
							{/* Filters + List */}
							<div className="lg:col-span-2 space-y-2">
								{/* Filters row */}
								<div className="flex items-center gap-2 mb-4">
									{/* Custom project dropdown filter */}
									<div className="relative">
										<button
											onClick={() => setDropdownOpen(!dropdownOpen)}
											className="flex items-center gap-2 text-xs font-medium rounded-lg border border-border bg-white px-3 py-1.5 text-foreground hover:bg-gray-50 transition-all"
										>
											<span>{projectFilter || "All projects"}</span>
											<svg
												className={`w-3 h-3 text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
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
										{dropdownOpen && (
											<>
												<div
													className="fixed inset-0 z-30"
													onClick={() => setDropdownOpen(false)}
												/>
												<div className="absolute left-0 top-full mt-1 z-40 bg-white rounded-xl border border-border shadow-lg py-1 min-w-[200px] animate-fade-in">
													<button
														onClick={() => {
															setProjectFilter(null);
															setDropdownOpen(false);
														}}
														className={`w-full text-left px-4 py-2 text-xs transition-colors ${!projectFilter ? "bg-sky-100 text-sky-800 font-medium" : "text-foreground hover:bg-gray-50"}`}
													>
														All projects
													</button>
													{projectNames.map((name) => (
														<button
															key={name}
															onClick={() => {
																setProjectFilter(name);
																setDropdownOpen(false);
															}}
															className={`w-full text-left px-4 py-2 text-xs transition-colors ${projectFilter === name ? "bg-sky-100 text-sky-800 font-medium" : "text-foreground hover:bg-gray-50"}`}
														>
															{name}
														</button>
													))}
												</div>
											</>
										)}
									</div>
									{/* Sort toggle — pushed to the right */}
									<button
										onClick={() => setSortAsc(!sortAsc)}
										className="ml-auto text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-white text-muted hover:text-foreground hover:bg-gray-50 transition-all"
									>
										{sortAsc ? "↑ Oldest" : "↓ Newest"}
									</button>
								</div>
								{/* List */}
								<div className="space-y-2 overflow-y-auto no-scrollbar max-h-[60vh] pr-1">
									{currentProjectList.length > 0 ? (
										currentProjectList.map((task) => {
											const isSelected = selectedProjectId === task.id;
											const sender = users.find(
												(u) => u.id === task.fromUserId,
											);
											const receiver = users.find(
												(u) => u.id === task.assigneeId,
											);
											const other = subTab === "received" ? sender : receiver;
											return (
												<div
													key={task.id}
													onClick={() => setSelectedProjectId(task.id)}
													className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
														isSelected
															? "border-sky-800 bg-sky-100/50"
															: "border-border bg-white hover:border-sky-200"
													}`}
												>
													<div className="flex items-center justify-between mb-1 gap-2">
														<div className="flex items-center gap-1.5 flex-1 min-w-0">
															{!projectFilter && (
																<span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 truncate max-w-[100px]">
																	{task.projectName}
																</span>
															)}
															<span
																className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${getStatusColor(task.status)}`}
															>
																{getStatusLabel(task.status)}
															</span>
														</div>
														<span className="text-[10px] text-muted shrink-0">
															{formatDate(task.receivedDate)}
														</span>
													</div>
													<p className="text-sm font-medium text-foreground truncate">
														{task.title}
													</p>
													{other && (
														<p className="text-xs text-muted mt-0.5">
															{subTab === "received" ? "From" : "To"}{" "}
															{other.name}
														</p>
													)}
												</div>
											);
										})
									) : (
										<p className="text-sm text-muted text-center py-12">
											No feedback.
										</p>
									)}
								</div>
							</div>

							{/* Detail */}
							<div className="lg:col-span-3 rounded-2xl border border-border bg-white p-6 overflow-y-auto no-scrollbar h-[60vh] self-start">
								{selectedProject ? (
									<div className="animate-fade-in">
										{/* Header */}
										<div className="flex items-start justify-between mb-4">
											<div>
												<h3 className="text-base font-semibold text-foreground mb-1">
													{selectedProject.title}
												</h3>
												<p className="text-xs text-muted">
													{subTab === "received" ? "From" : "To"}{" "}
													{
														users.find(
															(u) =>
																u.id ===
																(subTab === "received"
																	? selectedProject.fromUserId
																	: selectedProject.assigneeId),
														)?.name
													}{" "}
													· {formatDate(selectedProject.receivedDate)}
												</p>
											</div>
											<div className="relative">
												<button
													onClick={() =>
														setStatusDropdownOpen(!statusDropdownOpen)
													}
													className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition-all hover:opacity-80 ${getStatusColor(selectedProject.status)}`}
												>
													{getStatusLabel(selectedProject.status)}
													<svg
														className={`w-3 h-3 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`}
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={2.5}
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M19.5 8.25l-7.5 7.5-7.5-7.5"
														/>
													</svg>
												</button>
												{statusDropdownOpen && (
													<>
														<div
															className="fixed inset-0 z-30"
															onClick={() => setStatusDropdownOpen(false)}
														/>
														<div className="absolute right-0 top-full mt-1 z-40 bg-white rounded-xl border border-border shadow-lg py-1 min-w-[160px] animate-fade-in">
															{(
																[
																	"todo",
																	"in-progress",
																	"review",
																	"done",
																] as TaskStatus[]
															).map((s) => (
																<button
																	key={s}
																	onClick={() =>
																		setProjectStatus(selectedProject.id, s)
																	}
																	className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center gap-2 ${selectedProject.status === s ? "font-medium" : "text-foreground hover:bg-gray-50"}`}
																>
																	<span
																		className={`inline-block w-2 h-2 rounded-full ${getStatusColor(s).split(" ")[0]}`}
																	/>
																	{getStatusLabel(s)}
																	{selectedProject.status === s && (
																		<span className="ml-auto text-sky-800">
																			✓
																		</span>
																	)}
																</button>
															))}
														</div>
													</>
												)}
											</div>
										</div>

										{/* Description */}
										<p className="text-sm text-foreground/80 leading-relaxed mb-5 pb-5 border-b border-border">
											{selectedProject.description}
										</p>

										{/* Actions — received */}
										{subTab === "received" && (
											<div className="space-y-3">
												<div className="flex items-center gap-2">
													<button
														onClick={() =>
															toggleProjectCompleted(selectedProject.id)
														}
														className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all ${
															selectedProject.completedByReceiver
																? "bg-emerald-100 text-emerald-700"
																: "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
														}`}
													>
														<IoCheckmarkOutline className="w-3.5 h-3.5" />
														{selectedProject.completedByReceiver
															? "Completed"
															: "Mark as completed"}
													</button>
													{!selectedProject.completedByReceiver && (
														<button
															onClick={() =>
																setIgnoreConfirmId(selectedProject.id)
															}
															className="text-xs font-medium px-3 py-2 rounded-lg transition-all bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600"
														>
															Ignore
														</button>
													)}
												</div>

												{/* useful prompt after completion */}
												{selectedProject.completedByReceiver && (
													<div className="flex items-center gap-2 p-3 rounded-lg bg-sky-50 border border-sky-100 animate-fade-in">
														<p className="text-xs text-foreground flex-1">
															Was this feedback useful?
														</p>
														<button
															onClick={() =>
																toggleProjectUseful(selectedProject.id)
															}
															className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
																selectedProject.markedUseful
																	? "bg-sky-800 text-white"
																	: "bg-white text-sky-800 border border-sky-800 hover:bg-sky-800/10"
															}`}
														>
															{selectedProject.markedUseful
																? "👍 Useful!"
																: "👍 Yes"}
														</button>
													</div>
												)}
											</div>
										)}

										{/* Actions — sent: show receiver status */}
										{subTab === "sent" && (
											<div className="p-3 rounded-lg bg-gray-50 border border-border">
												<p className="text-xs text-muted">
													Status:{" "}
													{selectedProject.completedByReceiver ? (
														<span className="text-emerald-600 font-medium">
															✓ Completed
															{selectedProject.markedUseful
																? " · 👍 Useful"
																: ""}
														</span>
													) : selectedProject.ignoredByReceiver ? (
														<span className="text-gray-500 font-medium">
															Ignored
														</span>
													) : (
														<span className="text-amber-600 font-medium">
															Pending
														</span>
													)}
												</p>
											</div>
										)}
									</div>
								) : (
									<div className="flex flex-1 items-center justify-center h-full text-sm text-muted">
										Select a feedback to see its details
									</div>
								)}
							</div>
						</>
					)}

					{/* ═══════ EVENTI TAB ═══════ */}
					{mainTab === "events" && (
						<div className="lg:col-span-5 flex items-center justify-center rounded-2xl border border-dashed border-border bg-gray-50 min-h-[300px]">
							<div className="text-center">
								<p className="text-3xl mb-2">📅</p>
								<p className="text-sm font-medium text-foreground mb-1">
									Coming soon
								</p>
								<p className="text-xs text-muted">
									The events section will be available soon
								</p>
							</div>
						</div>
					)}

					{/* ═══════ PERSONALI TAB ═══════ */}
					{mainTab === "personal" && (
						<>
							{/* List */}
							<div className="lg:col-span-2 space-y-2 overflow-y-auto no-scrollbar max-h-[60vh] pr-1">
								{currentPersonalList.length > 0 ? (
									currentPersonalList.map((fb) => {
										const isSelected = selectedPersonalId === fb.id;
										const other = users.find(
											(u) =>
												u.id ===
												(subTab === "received" ? fb.fromUserId : fb.toUserId),
										);
										return (
											<div
												key={fb.id}
												onClick={() => setSelectedPersonalId(fb.id)}
												className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
													isSelected
														? "border-sky-800 bg-sky-100/50"
														: "border-border bg-white hover:border-sky-200"
												}`}
											>
												<div className="flex items-start gap-3">
													<div
														className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
															reactionsData[fb.reaction]?.colorClass ||
															"bg-gray-100"
														}`}
													>
														<span className="text-lg">{fb.reaction}</span>
													</div>
													<div className="flex-1 min-w-0 pr-4">
														<p className="text-sm font-medium text-foreground truncate">
															{reactionsData[fb.reaction]?.title || "Feedback"}
														</p>
														<p className="text-xs text-foreground/80 truncate mt-0.5">
															{subTab === "received" ? fb.summary : fb.message}
														</p>
														{subTab === "sent" && other && (
															<p className="text-xs text-muted mt-0.5">
																To {other.name}
															</p>
														)}
														{fb.markedUseful && (
															<span className="text-[10px] text-sky-800 mt-1 inline-block">
																👍 Useful
															</span>
														)}
													</div>
													<span className="text-[10px] text-muted shrink-0 pt-0.5">
														{formatDate(fb.date)}
													</span>
												</div>
											</div>
										);
									})
								) : (
									<p className="text-sm text-muted text-center py-12">
										No feedback.
									</p>
								)}
							</div>

							{/* Detail */}
							<div className="lg:col-span-3 rounded-2xl border border-border bg-white p-6 overflow-y-auto no-scrollbar max-h-[60vh]">
								{selectedPersonal ? (
									(() => {
										const other = users.find(
											(u) =>
												u.id ===
												(subTab === "received"
													? selectedPersonal.fromUserId
													: selectedPersonal.toUserId),
										);
										return (
											<div className="animate-fade-in">
												<div className="flex items-start justify-between mb-4">
													{subTab === "received" ? (
														<div className="flex items-center gap-3">
															<div
																className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
																	reactionsData[selectedPersonal.reaction]
																		?.colorClass || "bg-gray-100"
																}`}
															>
																<span className="text-2xl">
																	{selectedPersonal.reaction}
																</span>
															</div>
															<div>
																<h3 className="text-base font-semibold text-foreground">
																	{reactionsData[selectedPersonal.reaction]
																		?.title || "Feedback"}
																</h3>
																<p className="text-sm text-muted">
																	Personal feedback
																</p>
															</div>
														</div>
													) : (
														<div className="flex items-center gap-3">
															<div
																className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
																	reactionsData[selectedPersonal.reaction]
																		?.colorClass || "bg-gray-100"
																}`}
															>
																<span className="text-2xl">
																	{selectedPersonal.reaction}
																</span>
															</div>
															<div>
																<h3 className="text-base font-semibold text-foreground">
																	{reactionsData[selectedPersonal.reaction]
																		?.title || "Feedback"}
																</h3>
																<p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
																	Sent to{" "}
																	{other && (
																		<span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[8px] font-semibold text-sky-800">
																			{other.avatar}
																		</span>
																	)}
																	{other?.name || ""}
																	{other?.role ? ` · ${other.role}` : ""}
																</p>
															</div>
														</div>
													)}
												</div>

												<div className="mb-5 pb-5 border-b border-border">
													{subTab === "sent" && (
														<p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
															Message
														</p>
													)}
													<p className="text-sm text-foreground/80 leading-relaxed">
														{subTab === "received"
															? selectedPersonal.summary
															: selectedPersonal.message}
													</p>
												</div>

												{/* Strengths & Improvements */}
												{((selectedPersonal.strengths &&
													selectedPersonal.strengths.length > 0) ||
													(selectedPersonal.improvements &&
														selectedPersonal.improvements.length > 0)) && (
													<div className="mb-5 pb-5 border-b border-border">
														{selectedPersonal.strengths &&
															selectedPersonal.strengths.length > 0 && (
																<div className="mb-3">
																	<p className="text-xs font-medium text-emerald-600 mb-2">
																		Strengths
																	</p>
																	<div className="flex flex-wrap gap-1.5">
																		{selectedPersonal.strengths.map((id) => {
																			const trait = getTraitById(id);
																			if (!trait) return null;
																			return (
																				<span
																					key={id}
																					className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg"
																				>
																					{trait.emoji} {trait.label}
																				</span>
																			);
																		})}
																	</div>
																</div>
															)}
														{selectedPersonal.improvements &&
															selectedPersonal.improvements.length > 0 && (
																<div>
																	<p className="text-xs font-medium text-amber-600 mb-2">
																		Areas for improvement
																	</p>
																	<div className="flex flex-wrap gap-1.5">
																		{selectedPersonal.improvements.map((id) => {
																			const trait = getTraitById(id);
																			if (!trait) return null;
																			return (
																				<span
																					key={id}
																					className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-lg"
																				>
																					{trait.emoji} {trait.label}
																				</span>
																			);
																		})}
																	</div>
																</div>
															)}
													</div>
												)}

												{/* Thumbs up — only for received */}
												{subTab === "received" && (
													<button
														onClick={() =>
															togglePersonalUseful(selectedPersonal.id)
														}
														className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all ${
															selectedPersonal.markedUseful
																? "bg-sky-800 text-white"
																: "bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-800"
														}`}
													>
														👍{" "}
														{selectedPersonal.markedUseful
															? "Useful feedback!"
															: "Mark as useful"}
													</button>
												)}

												{/* Sent view — show if marked useful */}
												{subTab === "sent" && selectedPersonal.markedUseful && (
													<div className="p-3 rounded-lg bg-sky-50 border border-sky-100">
														<p className="text-xs text-sky-800 font-medium">
															👍 The recipient found this feedback useful
														</p>
													</div>
												)}
											</div>
										);
									})()
								) : (
									<div className="flex items-center justify-center h-full text-sm text-muted">
										Select a feedback to see its details
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>

			{/* ─── Floating Weekly Feedback Banner ─── */}
			{remainingTargets.length > 0 && (
				<div className="fixed bottom-8 left-64 right-0 z-40 flex justify-center pointer-events-none animate-fade-in-up">
					<div className="flex items-center gap-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-2xl p-4 shadow-lg pointer-events-auto w-[620px]">
						{/* Avatars stack */}
						<div className="flex -space-x-2 shrink-0">
							{remainingTargets.map((t) => (
								<div
									key={t.id}
									className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-xs text-sky-600 font-bold border-2 border-sky-600"
								>
									{t.avatar}
								</div>
							))}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<p className="text-[10px] font-medium text-sky-200 uppercase tracking-wider">
									Weekly feedback
								</p>
								<span className="text-[10px] font-medium bg-white/15 px-1.5 py-0.5 rounded-full">
									{getWeeklyDeadlineLabel()}
								</span>
							</div>
							<p className="text-sm">
								{remainingTargets.length === 2 ? (
									<>
										Send your feedback to{" "}
										<span className="font-semibold">
											{remainingTargets[0].name}
										</span>{" "}
										and{" "}
										<span className="font-semibold">
											{remainingTargets[1].name}
										</span>
									</>
								) : (
									<>
										You only need to send feedback to{" "}
										<span className="font-semibold">
											{remainingTargets[0].name}
										</span>
									</>
								)}
							</p>
						</div>
						<button
							onClick={() => {
								setPanelLockedTarget(null);
								setPanelMode("send");
								setPanelWeeklyTargets(remainingTargets);
								setFabExpanded(false);
								setIsPanelOpen(true);
							}}
							className="shrink-0 flex items-center gap-1.5 rounded-lg bg-white text-sky-700 px-4 py-2 text-sm font-semibold hover:bg-sky-50 transition-all active:scale-95 cursor-pointer"
						>
							Send
							<IoChevronForwardOutline className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			)}

			{/* ─── Ignore Confirmation Dialog ─── */}
			{ignoreConfirmId && (
				<>
					<div
						className="fixed inset-0 z-50 bg-black/30 animate-fade-in"
						onClick={() => setIgnoreConfirmId(null)}
					/>
					<div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
						<div className="bg-white rounded-2xl shadow-xl p-6 w-[360px] pointer-events-auto animate-scale-in">
							<h3 className="text-base font-semibold text-foreground mb-2">
								Ignore this feedback?
							</h3>
							<p className="text-sm text-muted mb-5">
								The feedback will be removed from your list. This action cannot
								be undone.
							</p>
							<div className="flex items-center gap-2 justify-end">
								<button
									onClick={() => setIgnoreConfirmId(null)}
									className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
								>
									Cancel
								</button>
								<button
									onClick={() => confirmIgnoreProject(ignoreConfirmId)}
									className="text-sm font-medium px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
								>
									Confirm
								</button>
							</div>
						</div>
					</div>
				</>
			)}

			{/* FAB + SidePanel */}
			<FAB
				isExpanded={fabExpanded}
				onToggle={() => setFabExpanded(!fabExpanded)}
				onSend={() => {
					setFabExpanded(false);
					setPanelLockedTarget(null);
					setPanelMode("send");
					setPanelWeeklyTargets(undefined);
					setIsPanelOpen(true);
				}}
				onRequest={() => {
					setFabExpanded(false);
					setPanelLockedTarget(null);
					setPanelMode("request");
					setPanelWeeklyTargets(undefined);
					setIsPanelOpen(true);
				}}
			/>
			<SidePanel
				isOpen={isPanelOpen}
				onClose={() => {
					setIsPanelOpen(false);
					setPanelLockedTarget(null);
					setPanelWeeklyTargets(undefined);
				}}
				lockedTarget={panelLockedTarget}
				onDailyComplete={handleWeeklyFeedbackComplete}
				mode={panelMode}
				weeklyTargets={panelWeeklyTargets}
			/>
			<WrappedStories
				isOpen={wrappedOpen}
				onClose={() => setWrappedOpen(false)}
			/>
		</AppShell>
	);
}
