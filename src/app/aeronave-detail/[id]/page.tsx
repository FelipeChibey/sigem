import { obtenerDetalleAeronave } from "@/backend";
import { notFound } from "next/navigation";

interface Props { params: { id: string } }

export default async function Page({ params }: Props) {
  const id = Number(params.id);
  const aeronave = await obtenerDetalleAeronave(id);
  if (!aeronave) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="rounded border p-4">
        <h1 className="text-2xl font-semibold">{aeronave.nombre}</h1>
        <p className="text-sm text-neutral-600">OID: {aeronave.oid}</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div><span className="font-medium">Origen:</span> {aeronave.origen?.nombre} (#{aeronave.origenId})</div>
          <div><span className="font-medium">Destino:</span> {aeronave.destino?.nombre} (#{aeronave.destinoId})</div>
          <div><span className="font-medium">Cap. Máxima:</span> {aeronave.capacidadMaxima}</div>
          <div><span className="font-medium">Cap. Actual:</span> {aeronave.capacidadActual}</div>
          <div><span className="font-medium">Cap. Restante:</span> {aeronave.capacidadRestante}</div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Pasajeros a bordo</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-neutral-50">
              <th className="p-2 border">OID</th>
              <th className="p-2 border">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {aeronave.pasajeros?.map((p) => (
              <tr key={p.oid}>
                <td className="p-2 border">{p.oid}</td>
                <td className="p-2 border">{p.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
