import Link from "next/link";
import { listarAeronavesConCapacidad } from "@/backend";

export default async function Page() {
  const aeronaves = await listarAeronavesConCapacidad();
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Aeronaves</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-2 border">OID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Cap. Máx</th>
            <th className="p-2 border">Cap. Actual</th>
            <th className="p-2 border">Cap. Restante</th>
            <th className="p-2 border">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {aeronaves.map((a) => (
            <tr key={a.oid}>
              <td className="p-2 border">{a.oid}</td>
              <td className="p-2 border">{a.nombre}</td>
              <td className="p-2 border">{a.capacidadMaxima}</td>
              <td className="p-2 border">{a.capacidadActual}</td>
              <td className="p-2 border">{a.capacidadRestante}</td>
              <td className="p-2 border text-blue-600 underline">
                <Link href={`/aeronave-detail/${a.oid}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
