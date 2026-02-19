"use client";

import {
	IoAddOutline,
	IoPaperPlaneOutline,
	IoDownloadOutline,
} from "react-icons/io5";

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
				className={`flex h-14 w-14 items-center justify-center rounded-full bg-sky-800 text-white shadow-lg shadow-sky-900/20 hover:bg-sky-900 hover:shadow-xl hover:shadow-sky-900/30 active:scale-95 transition-all duration-200 ${
					isExpanded ? "rotate-45" : "rotate-0"
				}`}
				aria-label="New action"
			>
				<IoAddOutline className="w-6 h-6" />
			</button>

			{/* Expanded actions */}
			{isExpanded && (
				<div className="flex flex-col items-end gap-2 animate-fade-in-up">
					<button
						onClick={onSend}
						className="flex items-center gap-2.5 rounded-full bg-white pl-2.5 pr-4 py-2.5 shadow-lg border border-border hover:border-sky-200 hover:shadow-xl transition-all active:scale-95"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-600 text-white">
							<IoPaperPlaneOutline className="w-4 h-4 -ms-0.5 mt-0.5" />
						</div>
						<span className="text-sm font-medium text-foreground whitespace-nowrap">
							Send
						</span>
					</button>
					<button
						onClick={onRequest}
						className="flex items-center gap-2.5 rounded-full bg-white pl-2.5 pr-4 py-2.5 shadow-lg border border-border hover:border-sky-200 hover:shadow-xl transition-all active:scale-95"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
							<IoDownloadOutline className="w-4.5 h-4.5 -mt-0.5" />
						</div>
						<span className="text-sm font-medium text-foreground whitespace-nowrap">
							Request
						</span>
					</button>
				</div>
			)}
		</div>
	);
}
