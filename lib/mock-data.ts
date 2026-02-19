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
			{ label: "Collaborazione", value: 9 },
			{ label: "Comunicazione", value: 8 },
			{ label: "Proattività", value: 9 },
		],
		message: "Marco è sempre disponibile e porta energia positiva al team!",
		summary:
			"Il tuo entusiasmo e la tua disponibilità sono contagiosi. Continua così, il team apprezza molto il tuo spirito collaborativo!",
	},
	{
		id: "pf2",
		fromUserId: "u4",
		toUserId: "u1",
		date: "2026-02-18T14:20:00",
		reaction: "🌟",
		sliders: [
			{ label: "Collaborazione", value: 8 },
			{ label: "Comunicazione", value: 9 },
			{ label: "Proattività", value: 7 },
		],
		message:
			"Ottimo lavoro sulla presentazione di ieri, molto chiaro e strutturato.",
		summary:
			"Le tue presentazioni sono un punto di riferimento per il team. La chiarezza espositiva è il tuo superpotere!",
	},
	{
		id: "pf3",
		fromUserId: "u1",
		toUserId: "u3",
		date: "2026-02-18T11:00:00",
		reaction: "💪",
		sliders: [
			{ label: "Collaborazione", value: 8 },
			{ label: "Comunicazione", value: 7 },
			{ label: "Proattività", value: 9 },
		],
		message:
			"Luca ha risolto un bug critico in tempi record, grande dedizione!",
		summary:
			"La tua capacità di problem-solving sotto pressione è straordinaria. Il team può sempre contare su di te!",
	},
	{
		id: "pf4",
		fromUserId: "u1",
		toUserId: "u5",
		date: "2026-02-17T16:45:00",
		reaction: "💡",
		sliders: [
			{ label: "Collaborazione", value: 9 },
			{ label: "Comunicazione", value: 8 },
			{ label: "Proattività", value: 8 },
		],
		message:
			"Andrea porta sempre insights interessanti dai test con gli utenti.",
		summary:
			"I tuoi insights dalla ricerca utente guidano decisioni fondamentali. Continua ad esplorare!",
	},
	{
		id: "pf5",
		fromUserId: "u3",
		toUserId: "u1",
		date: "2026-02-17T10:15:00",
		reaction: "🤝",
		sliders: [
			{ label: "Collaborazione", value: 10 },
			{ label: "Comunicazione", value: 8 },
			{ label: "Proattività", value: 8 },
		],
		message: "Sempre un piacere fare pair review con Marco, super costruttivo.",
		summary:
			"Il tuo approccio costruttivo nelle review fa crescere tutto il team. Sei un moltiplicatore di talenti!",
	},
	{
		id: "pf6",
		fromUserId: "u5",
		toUserId: "u1",
		date: "2026-02-16T15:00:00",
		reaction: "❤️",
		sliders: [
			{ label: "Collaborazione", value: 9 },
			{ label: "Comunicazione", value: 9 },
			{ label: "Proattività", value: 7 },
		],
		message: "Marco ha un talento naturale per mediare e trovare compromessi.",
		summary:
			"La tua empatia e capacità di mediazione creano armonia nel team. Un dono prezioso!",
	},
	{
		id: "pf7",
		fromUserId: "u1",
		toUserId: "u2",
		date: "2026-02-16T09:30:00",
		reaction: "🔥",
		sliders: [
			{ label: "Collaborazione", value: 8 },
			{ label: "Comunicazione", value: 9 },
			{ label: "Proattività", value: 10 },
		],
		message:
			"Elena ha proposto un'architettura componenti brillante per il nuovo progetto.",
		summary:
			"La tua visione tecnica e proattività nel proporre soluzioni innovative sono fondamentali per il team!",
	},
	{
		id: "pf8",
		fromUserId: "u6",
		toUserId: "u1",
		date: "2026-02-15T17:00:00",
		reaction: "🌟",
		sliders: [
			{ label: "Collaborazione", value: 8 },
			{ label: "Comunicazione", value: 8 },
			{ label: "Proattività", value: 9 },
		],
		message:
			"Marco riesce sempre a tradurre i dati in design decisions concrete.",
		summary:
			"La tua capacità di connettere dati e design crea valore reale. Sei il ponte perfetto tra analytics e creatività!",
	},
];

// ─── Project Tasks ───────────────────────────────────────────────────────────

export const projectTasks: ProjectTask[] = [
	{
		id: "t1",
		title: "Redesign dashboard analytics",
		description:
			"Riprogettare la sezione analytics della dashboard per migliorare la leggibilità dei dati.",
		status: "in-progress",
		assigneeId: "u1",
		fromUserId: "u4",
		projectName: "FeedbackHub v2",
		dueDate: "2026-02-25",
		receivedDate: "2026-02-17T10:00:00",
		comments: [
			{
				id: "c1",
				projectTaskId: "t1",
				authorId: "u4",
				content:
					"Ottimo inizio! Potresti aggiungere un grafico a barre per il confronto settimanale?",
				date: "2026-02-18T10:00:00",
				replies: [
					{
						id: "r1",
						authorId: "u1",
						content:
							"Buona idea, lo aggiungo nella prossima iterazione. Uso recharts.",
						date: "2026-02-18T10:30:00",
					},
				],
			},
		],
	},
	{
		id: "t2",
		title: "Implementare notifiche push",
		description:
			"Aggiungere il sistema di notifiche push per i feedback ricevuti.",
		status: "todo",
		assigneeId: "u2",
		fromUserId: "u1",
		projectName: "Mobile App",
		dueDate: "2026-02-28",
		receivedDate: "2026-02-19T09:00:00",
		comments: [],
	},
	{
		id: "t3",
		title: "Ottimizzare query database feedback",
		description:
			"Le query per lo storico feedback sono lente con dataset grandi. Aggiungere indici e paginazione.",
		status: "review",
		assigneeId: "u3",
		fromUserId: "u1",
		projectName: "Mobile App",
		dueDate: "2026-02-20",
		receivedDate: "2026-02-16T14:30:00",
		comments: [
			{
				id: "c2",
				projectTaskId: "t3",
				authorId: "u3",
				content:
					"Ho aggiunto indici compositi e paginazione cursor-based. Tempo di risposta sceso da 2s a 80ms.",
				date: "2026-02-19T08:00:00",
				aiSuggestion:
					"Ottimo feedback tecnico! Potresti aggiungere i benchmark specifici per rendere il confronto più quantificabile.",
				replies: [],
			},
		],
	},
	{
		id: "t4",
		title: "Creare onboarding flow nuovi utenti",
		description:
			"Progettare e implementare il flusso di onboarding per i nuovi membri del team.",
		status: "in-progress",
		assigneeId: "u5",
		fromUserId: "u4",
		projectName: "Website Redesign",
		dueDate: "2026-02-22",
		receivedDate: "2026-02-18T11:15:00",
		comments: [],
	},
	{
		id: "t5",
		title: "Report mensile automatico",
		description:
			"Generare automaticamente un report mensile con le metriche di feedback del team.",
		status: "done",
		assigneeId: "u6",
		fromUserId: "u1",
		projectName: "Website Redesign",
		dueDate: "2026-02-15",
		receivedDate: "2026-02-10T09:00:00",
		completedByReceiver: true,
		markedUseful: true,
		comments: [
			{
				id: "c3",
				projectTaskId: "t5",
				authorId: "u4",
				content:
					"Perfetto, il report è completo e ben strutturato. Ottimo lavoro Sara!",
				date: "2026-02-15T16:00:00",
				replies: [],
			},
		],
	},
	{
		id: "t6",
		title: "Integrazione Slack per reminder feedback",
		description:
			"Inviare un reminder giornaliero su Slack per ricordare di inviare il feedback.",
		status: "todo",
		assigneeId: "u2",
		fromUserId: "u1",
		projectName: "Mobile App",
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
		"Il tuo spirito costruttivo nelle review e la capacità di mediare creano un ambiente di lavoro positivo. Ricordati di consultare le guide di accessibilità sui contrasti colore per il redesign della dashboard. Continua a portare questa energia! 🌟",
	feedbackCount: 5,
	topReaction: "🔥",
};
