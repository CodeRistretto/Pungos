export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="section py-10 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Pungos — UGC Loyalty</p>
        <div className="flex gap-4">
          <a href="#faq" className="hover:underline">Ayuda</a>
          <a href="mailto:soporte@pungos.test" className="hover:underline">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
