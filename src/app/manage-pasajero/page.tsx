import { bajarPasajero, listarAeronavesConCapacidad, listarPasajeros, subirPasajero } from "@/backend";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const [pasajeros, aeronaves] = await Promise.all([
    listarPasajeros(),
    listarAeronavesConCapacidad(),
  ]);

  async function actionSubir(formData: FormData) {
    "use server";
    const pasajeroId = Number(formData.get("pasajeroId"));
    const aeronaveId = Number(formData.get("aeronaveId"));
    await subirPasajero({ pasajeroId, aeronaveId });
    revalidatePath("/view-aeronaves");
  }

  async function actionBajar(formData: FormData) {
    "use server";
    const pasajeroId = Number(formData.get("pasajeroId"));
    await bajarPasajero({ pasajeroId });
    revalidatePath("/view-aeronaves");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Gestionar Pasajero</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Subir Pasajero</h2>
        <form action={actionSubir} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select name="pasajeroId" className="border rounded p-2" required>
            <option value="">Pasajero</option>
            {pasajeros.map((p) => (
              <option key={p.oid} value={p.oid}>{p.nombre}</option>
            ))}
          </select>
          <select name="aeronaveId" className="border rounded p-2" required>
            <option value="">Aeronave</option>
            {aeronaves.map((a) => (
              <option key={a.oid} value={a.oid}>{a.nombre}</option>
            ))}
          </select>
          <button className="px-4 py-2 rounded bg-black text-white" type="submit">Subir</button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Bajar Pasajero</h2>
        <form action={actionBajar} className="flex gap-3">
          <select name="pasajeroId" className="border rounded p-2" required>
            <option value="">Pasajero</option>
            {pasajeros.map((p) => (
              <option key={p.oid} value={p.oid}>{p.nombre}</option>
            ))}
          </select>
          <button className="px-4 py-2 rounded bg-black text-white" type="submit">Bajar</button>
        </form>
      </section>
    </div>
  );
}
