import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "FeedbackHub — Gestione Feedback Interpersonali",
	description:
		"Software gestionale per aziende per la gestione dei feedback interpersonali e progettuali.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="it">
			<body className={`${inter.variable} antialiased font-sans`}>
				{children}
			</body>
		</html>
	);
}
