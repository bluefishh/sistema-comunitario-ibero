// Actualizar perfil del usuario autenticado
document.addEventListener('DOMContentLoaded', function() {
    const btnActualizar = document.querySelector('.actualizar-perfil');
    if (!btnActualizar) return;

    btnActualizar.addEventListener('click', async function() {
        const contrasena = document.getElementById('contrasena').value.trim();
        const confirmarContrasena = document.getElementById('confirmarContrasena').value.trim();

        if (!contrasena || !confirmarContrasena) {
            Swal.fire('Campos requeridos', 'Debes completar ambos campos de contraseña.', 'warning');
            return;
        }
        if (contrasena !== confirmarContrasena) {
            Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
            return;
        }

        Swal.fire({
            title: '¿Guardar cambios?',
            text: '¿Estás seguro de actualizar tu perfil?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch('/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ contrasena })
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('¡Actualizado!', 'Tu perfil ha sido actualizado.', 'success').then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire('Error', data.message || 'No se pudo actualizar el perfil', 'error');
                }
            }
        });
    });
});