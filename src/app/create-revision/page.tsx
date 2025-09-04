import { crearRevision, listarAeronavesConCapacidad } from "@/backend";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const aeronaves = await listarAeronavesConCapacidad();

  async function action(formData: FormData) {
    "use server";
    const nombreRevisor = String(formData.get("nombreRevisor") || "").trim();
    const aeronaveId = Number(formData.get("aeronaveId"));
    const fechaStr = String(formData.get("fecha"));
    const fecha = new Date(fechaStr);
    await crearRevision({ nombreRevisor, aeronaveId, fecha });
    revalidatePath("/view-revisiones");
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Crear Revisión</h1>
      <form action={action} className="space-y-3">
        <input name="nombreRevisor" placeholder="Nombre del revisor" className="w-full border rounded p-2" required />
        <select name="aeronaveId" className="w-full border rounded p-2" required>
          <option value="">Aeronave</option>
          {aeronaves.map((a) => (
            <option key={a.oid} value={a.oid}>{a.nombre}</option>
          ))}
        </select>
        <input type="date" name="fecha" className="w-full border rounded p-2" required />
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Crear</button>
      </form>
    </div>
  );
}
