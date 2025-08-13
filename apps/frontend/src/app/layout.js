import './globals.css';

export const metadata = {
  title: 'Pungos',
  description: 'Recompensas por contenido de usuarios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
