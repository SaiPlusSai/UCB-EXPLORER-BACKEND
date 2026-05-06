const bcrypt = require("bcryptjs");
const adminModel = require("../models/administradorModel");
const { sign } = require("../../../config/jwt");
const HttpError = require("../../../shared/utils/httpError");

const isBcrypt = (s) => typeof s === "string" && /^\$2[aby]\$/.test(s);

const verificarPassword = async (plain, stored) => {
  if (!stored) return false;
  if (isBcrypt(stored)) return bcrypt.compare(plain, stored);
  return plain === stored;
};

const login = async ({ correo, password }) => {
  if (!correo || !password) throw new HttpError(400, "Correo y password requeridos");
  const admin = await adminModel.findByCorreo(correo);
  if (!admin || !admin.activo) throw new HttpError(401, "Credenciales invalidas");
  const ok = await verificarPassword(password, admin.password_hash);
  if (!ok) throw new HttpError(401, "Credenciales invalidas");
  const token = sign({ id: admin.id, correo: admin.correo, rol: admin.rol, tipo: "admin" });
  return {
    token,
    admin: { id: admin.id, correo: admin.correo, rol: admin.rol },
  };
};

const crearAdmin = async ({ correo, password, rol }) => {
  if (!correo || !password) throw new HttpError(400, "Correo y password requeridos");
  const existe = await adminModel.findByCorreo(correo);
  if (existe) throw new HttpError(409, "El correo ya esta registrado");
  const password_hash = await bcrypt.hash(password, 10);
  return adminModel.crear({ correo, password_hash, rol });
};

const listarAdmins = () => adminModel.listar();

const actualizarAdmin = (id, datos) => adminModel.actualizar(id, datos);

const cambiarPassword = async (id, nuevaPassword) => {
  if (!nuevaPassword || nuevaPassword.length < 4)
    throw new HttpError(400, "Password debe tener al menos 4 caracteres");
  const password_hash = await bcrypt.hash(nuevaPassword, 10);
  await adminModel.cambiarPassword(id, password_hash);
};

const obtenerPerfil = (id) => adminModel.findById(id);

const eliminarAdmin = (id) => adminModel.eliminar(id);

module.exports = {
  login,
  crearAdmin,
  listarAdmins,
  actualizarAdmin,
  cambiarPassword,
  obtenerPerfil,
  eliminarAdmin,
};
