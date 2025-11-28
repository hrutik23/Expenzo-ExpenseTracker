import "./globals.css";
import { ClientWrapper } from "./provider";

export const metadata = {
  title: "Expenzo",
  description: "Dashboard for Expense Tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap all children in client-side provider */}
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
