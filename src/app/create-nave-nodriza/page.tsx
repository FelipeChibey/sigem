import { crearNaveNodriza } from "@/backend";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default function Page() {
  async function action(formData: FormData) {
    "use server";
    const nombre = String(formData.get("nombre") || "").trim();
    await crearNaveNodriza({ nombre });
    revalidatePath("/");
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Crear Nave Nodriza</h1>
      <form action={action} className="space-y-3">
        <input name="nombre" placeholder="Nombre" className="w-full border rounded p-2" required />
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Crear</button>
      </form>
    </div>
  );
}
