"use client";

import { IconPlus, IconSend, IconMessage } from "@/components/icons/Icons";

interface FABProps {
	isExpanded: boolean;
	onToggle: () => void;
	onSend: () => void;
	onRequest: () => void;
}

export default function FAB({
	isExpanded,
	onToggle,
	onSend,
	onRequest,
}: FABProps) {
	return (
		<div className="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-end gap-3">
			{/* Main FAB button */}
			<button
				onClick={onToggle}
				className={`flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-sky-900/20 hover:bg-sky-900 hover:shadow-xl hover:shadow-sky-900/30 active:scale-95 transition-all duration-200 ${
					isExpanded ? "rotate-45" : "rotate-0"
				}`}
				aria-label="Feedback menu"
			>
				<IconPlus className="w-6 h-6" />
			</button>

			{/* Expanded actions */}
			{isExpanded && (
				<div className="flex flex-col items-end gap-2 animate-fade-in-up">
					<button
						onClick={onSend}
						className="flex items-center gap-2.5 rounded-full bg-white pl-4 pr-5 py-2.5 shadow-lg border border-border hover:border-sky-200 hover:shadow-xl transition-all active:scale-95"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
							<IconSend className="w-4 h-4" />
						</div>
						<span className="text-sm font-medium text-foreground whitespace-nowrap">
							Invia feedback
						</span>
					</button>
					<button
						onClick={onRequest}
						className="flex items-center gap-2.5 rounded-full bg-white pl-4 pr-5 py-2.5 shadow-lg border border-border hover:border-sky-200 hover:shadow-xl transition-all active:scale-95"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white">
							<IconMessage className="w-4 h-4" />
						</div>
						<span className="text-sm font-medium text-foreground whitespace-nowrap">
							Richiedi feedback
						</span>
					</button>
				</div>
			)}
		</div>
	);
}
