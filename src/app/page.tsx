import Link from "next/link";

export default function Home() {
  const links = [
    { href: "/create-nave-nodriza", label: "Crear Nave Nodriza" },
    { href: "/create-aeronave", label: "Crear Aeronave" },
    { href: "/create-pasajero", label: "Crear Pasajero" },
    { href: "/manage-pasajero", label: "Subir/Bajar Pasajero" },
    { href: "/create-revision", label: "Crear Revisión" },
    { href: "/view-naves-nodrizas", label: "Ver Naves Nodrizas" },
    { href: "/view-aeronaves", label: "Ver Aeronaves" },
    { href: "/view-pasajeros", label: "Ver Pasajeros" },
    { href: "/view-revisiones", label: "Ver Revisiones" },
  ];

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Sistema de Gestión</h1>
      <nav>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link className="block rounded border p-3 hover:bg-neutral-50" href={l.href}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
