// Option A: Next.js 13+ (App Router) — app/privacidad/page.jsx
// Drop-in working example with Tailwind, OG/Twitter, JSON-LD and no client-only APIs.

export const metadata = {
  title: 'Política de Privacidad | Pungos',
  description:
    'Cómo Pungos recopila, utiliza y protege tu información personal. Derechos ARCO (México), RGPD (UE), cookies, Meta Pixel y más.',
  metadataBase: new URL('https://www.tu-dominio.com'), // ← Cambia por tu dominio real
  alternates: { canonical: '/privacidad' },
  openGraph: {
    title: 'Política de Privacidad | Pungos',
    description:
      'Tratamiento de datos personales: finalidades, transferencias, seguridad, cookies y derechos.',
    type: 'website',
    url: '/privacidad',
    siteName: 'Pungos',
    images: [{ url: '/og/pungos-privacy.jpg', width: 1200, height: 630, alt: 'Pungos – Política de Privacidad' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Política de Privacidad | Pungos',
    description: 'ARCO, RGPD, cookies y tecnologías de medición.',
    images: ['/og/pungos-privacy.jpg'],
  },
  robots: { index: true, follow: true },
};

const COMPANY = {
  name: 'Pungos',
  legalName: 'Pungos SA de CV', // ← Ajusta si aplica
  email: 'privacidad@pungos.com', // ← Cambia
  phone: '+52 871 466 5657', // ← Cambia
  address: 'Vicente Gil 4098, Residencial El Fresno, Torreón, Coahuila, México', // ← Cambia
  website: 'https://pungos.com', // ← Cambia
  dpo: 'Andrés Leite Casielles', // ← Cambia o elimina si no aplica
  lastUpdated: '2025-08-14', // ← Actualiza la fecha
};

const toc = [
  { id: 'intro', label: 'Introducción' },
  { id: 'datos', label: 'Información que Recopilamos' },
  { id: 'usos', label: 'Cómo Usamos tus Datos' },
  { id: 'terceros', label: 'Divulgación y Terceros' },
  { id: 'seguridad', label: 'Seguridad de la Información' },
  { id: 'cookies', label: 'Cookies y Tecnologías Similares' },
  { id: 'derechos', label: 'Tus Derechos (ARCO y RGPD)' },
  { id: 'publicidad', label: 'Publicidad y Remarketing (Meta y otros)' },
  { id: 'transferencias', label: 'Transferencias Internacionales' },
  { id: 'menores', label: 'Menores de Edad' },
  { id: 'cambios', label: 'Cambios a esta Política' },
  { id: 'contacto', label: 'Contacto' },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      {/* JSON-LD (SSR-safe) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Política de Privacidad | Pungos',
            url: `${COMPANY.website}/privacidad`,
            dateModified: COMPANY.lastUpdated,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Pungos',
              url: COMPANY.website,
              publisher: { '@type': 'Organization', name: COMPANY.legalName, url: COMPANY.website },
            },
          }),
        }}
      />

      <header className="mb-10">
        <p className="text-sm text-gray-500">Última actualización: {COMPANY.lastUpdated}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Política de Privacidad</h1>
        <p className="mt-3 text-gray-600">
          En {COMPANY.name} valoramos tu privacidad. Este documento explica cómo recopilamos, usamos, almacenamos y
          protegemos tu información personal cuando utilizas nuestros servicios, aplicaciones y sitio web.
        </p>
      </header>

      <nav aria-label="Tabla de contenidos" className="mb-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm print:hidden">
        <h2 className="mb-3 text-lg font-semibold">Contenido</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {toc.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-gray-700 underline-offset-2 hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="intro" className="prose prose-neutral max-w-none">
        <p>
          Esta política aplica a todos los productos y servicios ofrecidos por {COMPANY.name}. Si no estás de acuerdo
          con sus términos, te recomendamos no utilizar nuestros servicios.
        </p>
      </section>

      <hr className="my-8" />

      <section id="datos" className="prose prose-neutral max-w-none">
        <h2>1. Información que Recopilamos</h2>
        <ul>
          <li>
            <strong>Datos que nos proporcionas:</strong> nombre, apellidos, correo electrónico, teléfono, direcciones de
            envío/facturación; datos de pago procesados por pasarelas externas.
          </li>
          <li>
            <strong>Datos recogidos automáticamente:</strong> IP, identificadores de dispositivo, idioma, navegador,
            sistema operativo, páginas visitadas, acciones realizadas, tiempos de respuesta, errores.
          </li>
          <li>
            <strong>Datos de terceros (cuando aplique):</strong> inicio de sesión con redes sociales, proveedores de
            pagos, aliados comerciales.
          </li>
        </ul>
      </section>

      <section id="usos" className="prose prose-neutral mt-10 max-w-none">
        <h2>2. Cómo Usamos tus Datos</h2>
        <ul>
          <li>Proveer, mantener y mejorar nuestros servicios.</li>
          <li>Procesar pedidos, pagos, altas/bajas de cuentas y soporte.</li>
          <li>Personalizar contenido y recordar preferencias.</li>
          <li>Comunicaciones transaccionales y de servicio; marketing cuando exista base legal o consentimiento.</li>
          <li>Cumplir obligaciones legales, fiscales, de seguridad y prevención de fraude.</li>
        </ul>
      </section>

      <section id="terceros" className="prose prose-neutral mt-10 max-w-none">
        <h2>3. Divulgación y Terceros</h2>
        <p>
          No vendemos tus datos. Podemos compartir información con proveedores que actúan en nuestro nombre (por ejemplo,
          procesadores de pago, hosting, mensajerías), con autoridades cuando la ley lo requiera y en casos de fusión o
          adquisición.
        </p>
      </section>

      <section id="seguridad" className="prose prose-neutral mt-10 max-w-none">
        <h2>4. Seguridad de la Información</h2>
        <p>
          Implementamos medidas técnicas y organizativas razonables para proteger tus datos. Aunque ningún sistema es
          100% seguro, trabajamos continuamente para fortalecer nuestra seguridad.
        </p>
      </section>

      <section id="cookies" className="prose prose-neutral mt-10 max-w-none">
        <h2>5. Cookies y Tecnologías Similares</h2>
        <p>
          Utilizamos cookies, almacenamiento local y tecnologías de medición (por ejemplo, Pixel de Meta y Google
          Analytics) para recordar preferencias, analizar el uso y mejorar el rendimiento. Puedes administrar tus
          preferencias desde el navegador o mediante nuestro banner de consentimiento (si está habilitado).
        </p>
        <ul>
          <li>
            <strong>Esenciales:</strong> necesarias para el funcionamiento del sitio.
          </li>
          <li>
            <strong>Analíticas:</strong> nos ayudan a comprender el uso para mejorar la experiencia.
          </li>
          <li>
            <strong>Publicidad/remarketing:</strong> permiten mostrar anuncios relevantes en plataformas como Meta y
            Google.
          </li>
        </ul>
      </section>

      <section id="derechos" className="prose prose-neutral mt-10 max-w-none">
        <h2>6. Tus Derechos (ARCO y RGPD)</h2>
        <h3 className="mt-4">México (ARCO)</h3>
        <p>
          Puedes ejercer tus derechos de <em>Acceso</em>, <em>Rectificación</em>, <em>Cancelación</em> y
          <em> Oposición</em> enviando una solicitud a {COMPANY.email}. Adjunta identificación y describe claramente tu
          petición. Responderemos dentro de los plazos legales.
        </p>
        <h3 className="mt-4">Unión Europea (RGPD)</h3>
        <p>
          Si te encuentras en la UE, también puedes solicitar la portabilidad de datos y limitar u oponerte a ciertos
          tratamientos. Cuando dependamos del consentimiento, podrás retirarlo en cualquier momento sin afectar la
          licitud previa.
        </p>
      </section>

      <section id="publicidad" className="prose prose-neutral mt-10 max-w-none">
        <h2>7. Publicidad y Remarketing (Meta y otros)</h2>
        <p>
          Podemos usar identificadores y eventos (p. ej., vistas, compras) para medición, segmentación y anuncios en
          plataformas como Meta (Facebook/Instagram) y Google. Esto puede implicar el uso de cookies o tecnologías
          similares en tu navegador y, en su caso, la <strong>Comparación Avanzada</strong> del Pixel de Meta o
          integraciones equivalentes. Donde la ley lo requiera, sólo activaremos estas tecnologías con tu consentimiento.
        </p>
      </section>

      <section id="transferencias" className="prose prose-neutral mt-10 max-w-none">
        <h2>8. Transferencias Internacionales</h2>
        <p>
          Si transferimos datos fuera de tu país, aplicaremos salvaguardas adecuadas (por ejemplo, cláusulas
          contractuales tipo de la UE u otros mecanismos permitidos) para proteger tu información.
        </p>
      </section>

      <section id="menores" className="prose prose-neutral mt-10 max-w-none">
        <h2>9. Menores de Edad</h2>
        <p>
          Nuestros servicios no están dirigidos a menores sin consentimiento de sus padres o tutores. Si detectamos
          tratamiento no autorizado de datos de menores, tomaremos medidas para eliminarlos.
        </p>
      </section>

      <section id="cambios" className="prose prose-neutral mt-10 max-w-none">
        <h2>10. Cambios a esta Política</h2>
        <p>
          Podemos actualizar esta política. Publicaremos la versión vigente en esta página indicando la fecha de
          actualización. Los cambios sustanciales pueden notificarse por correo o aviso en el sitio.
        </p>
      </section>

      <section id="contacto" className="prose prose-neutral mt-10 max-w-none">
        <h2>11. Contacto</h2>
        <p>Para dudas o solicitudes sobre privacidad, contáctanos:</p>
        <address className="not-italic">
          <div className="mt-2">{COMPANY.legalName}</div>
          <div>{COMPANY.address}</div>
          <div className="mt-2">
            <a href={`mailto:${COMPANY.email}`} className="underline">{COMPANY.email}</a>
            {' · '}
            <a href={`tel:${COMPANY.phone}`} className="underline">{COMPANY.phone}</a>
          </div>
          <div className="mt-1">Responsable: {COMPANY.dpo}</div>
        </address>
      </section>

      <div className="mt-12 print:hidden">
        <a href="#intro" className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">Volver al inicio</a>
      </div>
    </main>
  );
}
