import { listarPasajeros } from "@/backend";

export default async function Page() {
  const pasajeros = await listarPasajeros();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Pasajeros</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-neutral-50">
            <th className="p-2 border">OID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">AeronaveID</th>
          </tr>
        </thead>
        <tbody>
          {pasajeros.map((p) => (
            <tr key={p.oid}>
              <td className="p-2 border">{p.oid}</td>
              <td className="p-2 border">{p.nombre}</td>
              <td className="p-2 border">{p.aeronaveId ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
