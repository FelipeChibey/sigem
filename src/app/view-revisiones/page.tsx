import { listarRevisiones } from "@/backend";

export default async function Page() {
  const revisiones = await listarRevisiones();
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Revisiones</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-neutral-50">
            <th className="p-2 border">OID</th>
            <th className="p-2 border">Revisor</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Aeronave</th>
          </tr>
        </thead>
        <tbody>
          {revisiones.map((r) => (
            <tr key={r.oid}>
              <td className="p-2 border">{r.oid}</td>
              <td className="p-2 border">{r.nombreRevisor}</td>
              <td className="p-2 border">{new Date(r.fecha).toLocaleDateString()}</td>
              <td className="p-2 border">{r.aeronave?.nombre ?? r.aeronaveId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
