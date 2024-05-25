-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "contrasenia" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "TipoServicio" (
    "id_tipo_servicio" SERIAL NOT NULL,
    "nombre_servicio" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoServicio_pkey" PRIMARY KEY ("id_tipo_servicio")
);

-- CreateTable
CREATE TABLE "TipoCuenta" (
    "id_tipo_cuenta" SERIAL NOT NULL,
    "nombre_tipo_cuenta" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoCuenta_pkey" PRIMARY KEY ("id_tipo_cuenta")
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "id_cuenta" SERIAL NOT NULL,
    "numero_cuenta" TEXT NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_tipo_cuenta" INTEGER NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id_cuenta")
);

-- CreateTable
CREATE TABLE "RolUsuario" (
    "id_rol_usuario" SERIAL NOT NULL,
    "nombre_rol" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "RolUsuario_pkey" PRIMARY KEY ("id_rol_usuario")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "id_rol_usuario" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "PagoServicio" (
    "id_pago_servicio" SERIAL NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "monto_pago" DECIMAL(65,30) NOT NULL,
    "id_cuenta" INTEGER NOT NULL,
    "id_tipo_servicio" INTEGER NOT NULL,

    CONSTRAINT "PagoServicio_pkey" PRIMARY KEY ("id_pago_servicio")
);

-- CreateTable
CREATE TABLE "Transferencia" (
    "id_transferencia" SERIAL NOT NULL,
    "fecha_transferencia" TIMESTAMP(3) NOT NULL,
    "monto_transferencia" DECIMAL(65,30) NOT NULL,
    "cuenta_origen" INTEGER NOT NULL,
    "cuenta_destino" INTEGER NOT NULL,
    "id_usuario_autorizador" INTEGER NOT NULL,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("id_transferencia")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id_auditoria" SERIAL NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL,
    "accion" TEXT NOT NULL,
    "tabla_afectada" TEXT NOT NULL,
    "id_registro_afectado" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id_auditoria")
);

-- CreateTable
CREATE TABLE "TarjetaRfid" (
    "id_tarjeta" SERIAL NOT NULL,
    "numero_tarjeta" TEXT NOT NULL,
    "id_cuenta" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TarjetaRfid_pkey" PRIMARY KEY ("id_tarjeta")
);

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_id_tipo_cuenta_fkey" FOREIGN KEY ("id_tipo_cuenta") REFERENCES "TipoCuenta"("id_tipo_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_usuario_fkey" FOREIGN KEY ("id_rol_usuario") REFERENCES "RolUsuario"("id_rol_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoServicio" ADD CONSTRAINT "PagoServicio_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "Cuenta"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoServicio" ADD CONSTRAINT "PagoServicio_id_tipo_servicio_fkey" FOREIGN KEY ("id_tipo_servicio") REFERENCES "TipoServicio"("id_tipo_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_cuenta_origen_fkey" FOREIGN KEY ("cuenta_origen") REFERENCES "Cuenta"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_cuenta_destino_fkey" FOREIGN KEY ("cuenta_destino") REFERENCES "Cuenta"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencia" ADD CONSTRAINT "Transferencia_id_usuario_autorizador_fkey" FOREIGN KEY ("id_usuario_autorizador") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarjetaRfid" ADD CONSTRAINT "TarjetaRfid_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "Cuenta"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;
