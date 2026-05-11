const QRCode = require("qrcode");

const qrModel = require("../models/qrModel");

const visitanteModel = require(
  "../../ticket-access-visitor/models/visitanteModel"
);

const HttpError = require(
  "../../../shared/utils/httpError"
);

const escanear = async (
  visitanteId,
  { contenido_qr }
) => {

  if (
    !contenido_qr ||
    !contenido_qr.trim()
  ) {

    throw new HttpError(
      400,
      "contenido_qr requerido"
    );
  }

  const yaExiste =
    await qrModel.yaEscaneado(
      visitanteId,
      contenido_qr
    );

  if (yaExiste) {

    throw new HttpError(
      409,
      "Este QR ya fue escaneado"
    );
  }

  let data;

  try {

    data = JSON.parse(
      contenido_qr
    );

  } catch {

    throw new HttpError(
      400,
      "QR inválido"
    );
  }

  if (data.tipo === "puntos") {

    const puntos =
      Number(data.puntos) || 0;

    await qrModel.registrarEscaneo({
      visitante_id: visitanteId,
      contenido_qr,
      puntos_otorgados: puntos,
    });

    const visitante =
      await visitanteModel.sumarPuntos(
        visitanteId,
        puntos
      );

    return {
      tipo: "puntos",
      puntos_otorgados: puntos,
      total_puntos:
        visitante.puntos_totales,
    };
  }

  if (
    data.tipo === "informacion"
  ) {

    await qrModel.registrarEscaneo({
      visitante_id:
            contenido_qr,
      puntos_otorgados: 0,
    });

    return {
      tipo: "informacion",
      titulo: data.titulo,
      descripcion:
        data.descripcion,
    };
  }

  throw new HttpError(
    400,
    "Tipo QR no soportado"
  );
};

const historialVisitante = (
  visitanteId
) =>
  qrModel.escaneosPorVisitante(
    visitanteId
  );

const todosEscaneosAdmin = () =>
  qrModel.todosEscaneos();

const generarQR = async (
  adminId,
  {
    tipo,
    puntos,
    titulo,
    descripcion,
  }
) => {

  let payload;

  if (tipo === "puntos") {

    payload = {
      tipo: "puntos",
      puntos:
        Number(puntos) || 0,
    };

  } else if (
    tipo === "informacion"
  ) {

    payload = {
      tipo: "informacion",
      titulo: titulo || "",
      descripcion:
        descripcion || "",
    };

  } else {

    throw new HttpError(
      400,
      "Tipo QR inválido"
    );
  }

  const contenido =
    JSON.stringify(payload);

  const qr =
    await QRCode.toDataURL(
      contenido
    );

  const guardado =
    await qrModel.guardarQRGenerado({
      tipo,
      contenido_json: payload,
      qr_base64: qr,
      admin_id: adminId,
    });

  return guardado;
};

const listarQRGenerados =
  () =>
    qrModel.listarQRGenerados();

module.exports = {
  escanear,
  historialVisitante,
  todosEscaneosAdmin,
  generarQR,
  listarQRGenerados,
};