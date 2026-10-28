import "./globals.css";

export const metadata = {
  title: "Khushali CRM",
  description: "Calling CRM Panel for Khushali Chemicals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
