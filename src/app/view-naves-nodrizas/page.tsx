import { listarNavesNodrizas } from "@/backend";

export default async function Page() {
  const naves = await listarNavesNodrizas();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Naves Nodrizas</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-neutral-50">
            <th className="p-2 border">OID</th>
            <th className="p-2 border">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {naves.map((n) => (
            <tr key={n.oid}>
              <td className="p-2 border">{n.oid}</td>
              <td className="p-2 border">{n.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
