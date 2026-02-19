"use client";

import { ProjectComment as ProjectCommentType } from "@/lib/types";
import { users } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import AIAssistant from "./AIAssistant";

interface ProjectCommentProps {
	comment: ProjectCommentType;
}

export default function ProjectComment({ comment }: ProjectCommentProps) {
	const author = users.find((u) => u.id === comment.authorId);
	if (!author) return null;

	return (
		<div className="space-y-3">
			<div className="rounded-xl border border-border bg-white p-4 hover:border-sky-200 transition-colors">
				<div className="flex items-start gap-3">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
						{author.avatar}
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between">
							<p className="text-sm font-semibold text-foreground">
								{author.name}
							</p>
							<span className="text-xs text-muted">
								{timeAgo(comment.date)}
							</span>
						</div>
						<p className="text-sm text-foreground/80 mt-1 leading-relaxed">
							{comment.content}
						</p>
					</div>
				</div>

				{/* Replies */}
				{comment.replies.length > 0 && (
					<div className="mt-3 ml-11 space-y-3 border-l-2 border-sky-100 pl-4">
						{comment.replies.map((reply) => {
							const replyAuthor = users.find((u) => u.id === reply.authorId);
							if (!replyAuthor) return null;
							return (
								<div key={reply.id} className="flex items-start gap-2.5">
									<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold">
										{replyAuthor.avatar}
									</div>
									<div>
										<div className="flex items-center gap-2">
											<p className="text-xs font-semibold text-foreground">
												{replyAuthor.name}
											</p>
											<span className="text-[10px] text-muted">
												{timeAgo(reply.date)}
											</span>
										</div>
										<p className="text-xs text-foreground/70 mt-0.5">
											{reply.content}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* AI Suggestion */}
			{comment.aiSuggestion && (
				<AIAssistant suggestion={comment.aiSuggestion} />
			)}
		</div>
	);
}
