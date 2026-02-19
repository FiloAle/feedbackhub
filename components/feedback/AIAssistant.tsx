"use client";

import { IconSparkles } from "@/components/icons/Icons";

interface AIAssistantProps {
	suggestion: string;
}

export default function AIAssistant({ suggestion }: AIAssistantProps) {
	return (
		<div className="flex gap-3 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 p-4 animate-fade-in-up">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
				<IconSparkles className="w-4 h-4" />
			</div>
			<div>
				<p className="text-xs font-semibold text-accent mb-1">
					Suggerimento AI
				</p>
				<p className="text-sm text-foreground/80 leading-relaxed">
					{suggestion}
				</p>
			</div>
		</div>
	);
}
