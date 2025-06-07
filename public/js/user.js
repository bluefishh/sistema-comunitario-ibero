document.addEventListener('DOMContentLoaded', function() {   
    // Crear nuevo usuario 
    document.querySelector('#crear-usuario').addEventListener('click', function() {
        Swal.fire({
            title: 'Nuevo usuario',
            customClass: {
                popup: 'swal-nunito',
                title: 'swal-title-custom'
            },
            showCloseButton: true,
            html:
                `<form id="usuarioForm">
                    <div class="mb-3">
                        <label for="primerNombre" class="form-label">Primer nombre</label>
                        <input type="text" id="primerNombre" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="segundoNombre" class="form-label">Segundo nombre</label>
                        <input type="text" id="segundoNombre" class="swal2-input form-control">
                    </div>
                    <div class="mb-3">
                        <label for="primerApellido" class="form-label">Primer apellido</label>
                        <input type="text" id="primerApellido" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="segundoApellido" class="form-label">Segundo apellido</label>
                        <input type="text" id="segundoApellido" class="swal2-input form-control">
                    </div>
                    <div class="mb-3">
                        <label for="correo" class="form-label">Correo</label>
                        <input type="email" id="correo" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="contrasena" class="form-label">Contraseña</label>
                        <input type="password" id="contrasena" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="rol" class="form-label">Rol</label>
                        <select id="rol" class="swal2-select form-select" required>
                            <option value="">Seleccione un rol</option>
                            <option value="residente">Residente</option>
                            <option value="admin">Administrador</option>
                            <option value="lider_comunitarop">Líder comunitario</option>
                        </select>
                    </div>
                </form>`,
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const primerNombre = document.getElementById('primerNombre').value.trim();
                const segundoNombre = document.getElementById('segundoNombre').value.trim();
                const primerApellido = document.getElementById('primerApellido').value.trim();
                const segundoApellido = document.getElementById('segundoApellido').value.trim();
                const correo = document.getElementById('correo').value.trim();
                const contrasena = document.getElementById('contrasena').value.trim();
                const rol = document.getElementById('rol').value;
                if (!primerNombre || !primerApellido || !correo || !contrasena || !rol) {
                    Swal.showValidationMessage('Todos los campos obligatorios deben estar completos');
                    return false;
                }
                return { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, contrasena, rol };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                fetch('/users/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(result.value)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('¡Usuario creado!', 'El usuario fue creado exitosamente', 'success').then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo crear el usuario', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo crear el usuario', 'error');
                });
            }
        });
    });

    // Eliminar usuario
    document.querySelectorAll('.eliminar-usuario').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = btn.getAttribute('data-id');
            console.log('Eliminando usuario con id:', userId);
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará el usuario permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/users/delete/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if (data.success) {
                            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success').then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo eliminar el usuario', 'error');
                        }
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
                    });
                }
            });
        });
    });

    // Actualizar usuario
    document.querySelectorAll('.editar-usuario').forEach(btn => {
        btn.addEventListener('click', async function() {
            const userId = btn.getAttribute('data-id');
            let userData = {};
            try {
                const res = await fetch(`/users/${userId}`);
                userData = await res.json();
            } catch {
                Swal.fire('Error', 'No se pudo obtener la información del usuario', 'error');
                return;
            }

            Swal.fire({
                title: 'Editar usuario',
                customClass: {
                    popup: 'swal-nunito',
                    title: 'swal-title-custom'
                },
                showCloseButton: true,
                html:
                    `<form id="usuarioEditForm">
                        <div class="mb-3">
                            <label for="editPrimerNombre" class="form-label">Primer nombre</label>
                            <input type="text" id="editPrimerNombre" class="swal2-input form-control" value="${userData.primerNombre || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editSegundoNombre" class="form-label">Segundo nombre</label>
                            <input type="text" id="editSegundoNombre" class="swal2-input form-control" value="${userData.segundoNombre || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="editPrimerApellido" class="form-label">Primer apellido</label>
                            <input type="text" id="editPrimerApellido" class="swal2-input form-control" value="${userData.primerApellido || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editSegundoApellido" class="form-label">Segundo apellido</label>
                            <input type="text" id="editSegundoApellido" class="swal2-input form-control" value="${userData.segundoApellido || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="editCorreo" class="form-label">Correo</label>
                            <input type="email" id="editCorreo" class="swal2-input form-control" value="${userData.correo || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editRol" class="form-label">Rol</label>
                            <select id="editRol" class="swal2-select form-select" required>
                                <option value="">Seleccione un rol</option>
                                <option value="residente" ${userData.rol === 'residente' ? 'selected' : ''}>Residente</option>
                                <option value="admin" ${userData.rol === 'admin' ? 'selected' : ''}>Administrador</option>
                                <option value="lider_comunitarop" ${userData.rol === 'lider_comunitarop' ? 'selected' : ''}>Líder comunitario</option>
                            </select>
                        </div>
                    </form>`,
                showCancelButton: true,
                confirmButtonText: 'Actualizar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const primerNombre = document.getElementById('editPrimerNombre').value.trim();
                    const segundoNombre = document.getElementById('editSegundoNombre').value.trim();
                    const primerApellido = document.getElementById('editPrimerApellido').value.trim();
                    const segundoApellido = document.getElementById('editSegundoApellido').value.trim();
                    const correo = document.getElementById('editCorreo').value.trim();
                    const rol = document.getElementById('editRol').value;
                    if (!primerNombre || !primerApellido || !correo || !rol) {
                        Swal.showValidationMessage('Todos los campos obligatorios deben estar completos');
                        return false;
                    }
                    return { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, rol };
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    fetch(`/users/update/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(result.value)
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('¡Usuario actualizado!', 'El usuario fue actualizado exitosamente', 'success').then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo actualizar el usuario', 'error');
                        }
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
                    });
                }
            });
        });
    });
});