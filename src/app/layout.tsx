import { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css"

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Capchical",
  description: "Web site created using create-react-app",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={montserrat.className} suppressHydrationWarning>
    <body>
    <div id="root">{children}</div>
    {/*
     This HTML file is a template.
     If you open it directly in the browser, you will see an empty page.

     You can add webfonts, meta tags, or analytics to this file.
     The build step will place the bundled scripts into the <body> tag.

     To begin the development, run `npm start` or `yarn start`.
     To create a production bundle, use `npm run build` or `yarn build`.
     */}
    </body>
    </html>
  );
}
