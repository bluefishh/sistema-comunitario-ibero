const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    primerNombre: { type: String, required: true },
    segundoNombre: String,
    primerApellido: { type: String, required: true },
    segundoApellido: String,
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    rol: { type: String, default: "residente" },
});

// Middleware para hashear la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
    if (!this.isModified("contrasena")) return next();
    this.contrasena = await bcrypt.hash(this.contrasena, 10);
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.contrasena);
};

const User = mongoose.model("User", userSchema);

class UserModel {
    // Buscar un usuario por correo
    static async buscarPorCorreo(correo) {
        return await User.findOne({ correo });
    }

    // Crear un nuevo usuario
    static async crearUsuario(datos) {
        const usuario = new User(datos);
        return await usuario.save();
    }

    // Buscar un usuario por ID
    static async buscarPorId(id) {
        return await User.findById(id);
    }

    // Buscar usuarios por IDs
    static async buscarPorIds(ids) {
        return await User.find({ _id: { $in: ids } });
    }

    // Actualizar un usuario
    static async actualizarUsuario(id, datos) {
        return await User.findByIdAndUpdate(id, datos);
    }

    // Eliminar un usuario
    static async eliminarUsuario(id) {
        return await User.findByIdAndDelete(id);
    }
}

module.exports = UserModel;