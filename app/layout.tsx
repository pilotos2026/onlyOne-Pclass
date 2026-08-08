import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://live.personalclass.online"),
  title: {
    default: "PClass | Experience OnlyOne",
    template: "%s | PClass",
  },
  description:
    "Live, solucionario validado, recursos y orientación para el evento UNCP 2026-II.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "PClass",
    title: "PClass | Experience OnlyOne",
    description:
      "Vive el examen, revisa el solucionario y prepárate para tu siguiente reto.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PClass | Experience OnlyOne",
    description:
      "Live, solucionario validado, recursos y orientación en una sola experiencia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
