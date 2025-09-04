-- CreateTable
CREATE TABLE "nave_nodriza" (
    "oid" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "nave_nodriza_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "aeronave" (
    "oid" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "capacidadMaxima" INTEGER NOT NULL,
    "origenId" INTEGER NOT NULL,
    "destinoId" INTEGER NOT NULL,

    CONSTRAINT "aeronave_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "pasajero" (
    "oid" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "aeronaveId" INTEGER,

    CONSTRAINT "pasajero_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "revision" (
    "oid" SERIAL NOT NULL,
    "nombreRevisor" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "aeronaveId" INTEGER NOT NULL,

    CONSTRAINT "revision_pkey" PRIMARY KEY ("oid")
);

-- CreateTable
CREATE TABLE "revision_pasajero" (
    "revisionId" INTEGER NOT NULL,
    "pasajeroId" INTEGER NOT NULL,

    CONSTRAINT "revision_pasajero_pkey" PRIMARY KEY ("revisionId","pasajeroId")
);

-- CreateIndex
CREATE UNIQUE INDEX "revision_aeronaveId_fecha_key" ON "revision"("aeronaveId", "fecha");

-- AddForeignKey
ALTER TABLE "aeronave" ADD CONSTRAINT "aeronave_origenId_fkey" FOREIGN KEY ("origenId") REFERENCES "nave_nodriza"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aeronave" ADD CONSTRAINT "aeronave_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "nave_nodriza"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pasajero" ADD CONSTRAINT "pasajero_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "aeronave"("oid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision" ADD CONSTRAINT "revision_aeronaveId_fkey" FOREIGN KEY ("aeronaveId") REFERENCES "aeronave"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_pasajero" ADD CONSTRAINT "revision_pasajero_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "revision"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_pasajero" ADD CONSTRAINT "revision_pasajero_pasajeroId_fkey" FOREIGN KEY ("pasajeroId") REFERENCES "pasajero"("oid") ON DELETE RESTRICT ON UPDATE CASCADE;
