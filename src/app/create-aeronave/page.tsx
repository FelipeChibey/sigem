import { crearAeronave, listarNavesNodrizas } from "@/backend";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const naves = await listarNavesNodrizas();

  async function action(formData: FormData) {
    "use server";
    const nombre = String(formData.get("nombre") || "").trim();
    const capacidadMaxima = Number(formData.get("capacidadMaxima"));
    const origenId = Number(formData.get("origenId"));
    const destinoId = Number(formData.get("destinoId"));
    await crearAeronave({ nombre, capacidadMaxima, origenId, destinoId });
    revalidatePath("/view-aeronaves");
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Crear Aeronave</h1>
      <form action={action} className="space-y-3">
        <input name="nombre" placeholder="Nombre" className="w-full border rounded p-2" required />
        <input type="number" name="capacidadMaxima" placeholder="Capacidad Máxima" className="w-full border rounded p-2" required />
        <select name="origenId" className="w-full border rounded p-2" required>
          <option value="">Origen</option>
          {naves.map((n) => (
            <option key={n.oid} value={n.oid}>{n.nombre}</option>
          ))}
        </select>
        <select name="destinoId" className="w-full border rounded p-2" required>
          <option value="">Destino</option>
          {naves.map((n) => (
            <option key={n.oid} value={n.oid}>{n.nombre}</option>
          ))}
        </select>
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Crear</button>
      </form>
    </div>
  );
}
