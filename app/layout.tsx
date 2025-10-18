import type { Metadata } from "next";
import "./globals.css";
import { Great_Vibes, Poiret_One } from "next/font/google";

const greatVibes = Great_Vibes({
    weight: '400',
    subsets: ['latin', 'cyrillic'],
    variable: '--font-great-vibes',
    display: 'swap',
});

const poiretOne = Poiret_One({
    weight: '400',
    subsets: ['latin', 'cyrillic'],
    variable: '--font-poiret_one',
    display: 'swap',
});

export const metadata: Metadata = {
  title: "Приглашение на свадьбу",
  description: "Приглашение на свадьбу от Егора и Нади",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${greatVibes.variable} ${poiretOne.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
