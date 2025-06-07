document.addEventListener('DOMContentLoaded', function() {
    // Crear alerta
    document.querySelector('#crear-alerta').addEventListener('click', function() {
        Swal.fire({
            title: 'Nueva alerta',
            customClass: {
                popup: 'swal-nunito',
                title: 'swal-title-custom'
            },
            showCloseButton: true,
            html:
                `<form id="alertaForm">
                    <div class="mb-3">
                        <label for="titulo" class="form-label">Título de la alerta</label>
                        <input type="text" id="titulo" class="swal2-input form-control" placeholder=" " required>
                    </div>
                    <div class="mb-3">
                        <label for="tipo" class="form-label">Tipo de alerta</label>
                        <select id="tipo" class="swal2-select form-select" required>
                            <option value="">Seleccione una opción</option>
                            <option value="seguridad">Seguridad</option>
                            <option value="emergencia">Emergencia</option>
                            <option value="comunidad">Comunidad</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <textarea id="descripcion" class="swal2-textarea form-control" placeholder=" " required></textarea>
                    </div>
                </form>`,
            showCancelButton: true,
            confirmButtonText: 'Publicar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const titulo = document.getElementById('titulo').value.trim();
                const descripcion = document.getElementById('descripcion').value.trim();
                const tipo = document.getElementById('tipo').value;
                if (!titulo || !descripcion || !tipo) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { titulo, descripcion, tipo };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                fetch('/alerts/create', {
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
                        Swal.fire('¡Alerta enviada!', 'La alerta se envió a los encargados para su aprobación', 'success').then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo crear la alerta', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo crear la alerta', 'error');
                });
            }
        });
    });

    // Eliminar alerta
    document.querySelectorAll('.eliminar-alerta').forEach(btn => {
        btn.addEventListener('click', function() {
            const alertaId = btn.getAttribute('data-id');
            console.log("ID ALERTA A BORRAR: " + alertaId);
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará la alerta permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/alerts/delete/${alertaId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log("DATA DELETE ALERTA: ", data);
                        if (data.success) {
                            Swal.fire('Eliminada', 'La alerta ha sido eliminada.', 'success').then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo eliminar la alerta', 'error');
                        }
                    })
                    .catch(() => {
                        console.log("ERROR DELETE ALERTA");
                        Swal.fire('Error', 'No se pudo eliminar la alerta', 'error');
                    });
                }
            });
        });
    });

    // Editar alerta
    document.querySelectorAll('.editar-alerta').forEach(btn => {
        btn.addEventListener('click', async function() {
            const alertaId = btn.getAttribute('data-id');
            let alertaData = {};
            try {
                const res = await fetch(`/alerts/${alertaId}`);
                alertaData = await res.json();
            } catch {
                Swal.fire('Error', 'No se pudo obtener la información de la alerta', 'error');
                return;
            }

            Swal.fire({
                title: 'Editar alerta',
                customClass: {
                    popup: 'swal-nunito',
                    title: 'swal-title-custom'
                },
                showCloseButton: true,
                html:
                    `<form id="alertaEditForm">
                        <div class="mb-3">
                            <label for="editTitulo" class="form-label">Título de la alerta</label>
                            <input type="text" id="editTitulo" class="swal2-input form-control" value="${alertaData.titulo || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editTipo" class="form-label">Tipo de alerta</label>
                            <select id="editTipo" class="swal2-select form-select" required>
                                <option value="">Seleccione una opción</option>
                                <option value="seguridad" ${alertaData.tipo === 'seguridad' ? 'selected' : ''}>Seguridad</option>
                                <option value="emergencia" ${alertaData.tipo === 'emergencia' ? 'selected' : ''}>Emergencia</option>
                                <option value="comunidad" ${alertaData.tipo === 'comunidad' ? 'selected' : ''}>Comunidad</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editDescripcion" class="form-label">Descripción</label>
                            <textarea id="editDescripcion" class="swal2-textarea form-control" required>${alertaData.descripcion || ''}</textarea>
                        </div>
                    </form>`,
                showCancelButton: true,
                confirmButtonText: 'Actualizar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const titulo = document.getElementById('editTitulo').value.trim();
                    const descripcion = document.getElementById('editDescripcion').value.trim();
                    const tipo = document.getElementById('editTipo').value;
                    if (!titulo || !descripcion || !tipo) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }
                    return { titulo, descripcion, tipo };
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    fetch(`/alerts/update/${alertaId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(result.value)
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('¡Alerta actualizada!', 'La alerta fue actualizada exitosamente', 'success').then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo actualizar la alerta', 'error');
                        }
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo actualizar la alerta', 'error');
                    });
                }
            });
        });
    });

    // Ver alerta
    document.querySelectorAll('.ver-alerta').forEach(btn => {
        btn.addEventListener('click', async function() {
            const alertaId = btn.getAttribute('data-id');
            let alertaData = {};
            try {
                const res = await fetch(`/alerts/${alertaId}`);
                alertaData = await res.json();
            } catch {
                Swal.fire('Error', 'No se pudo obtener la información de la alerta', 'error');
                return;
            }

            Swal.fire({
                title: alertaData.titulo || 'Alerta',
                html: `
                    <div style="text-align:left">
                        <b>Tipo:</b> ${alertaData.tipo || 'Sin tipo'}<br>
                        <b>Descripción:</b><br> ${alertaData.descripcion || 'No hay descripción disponible'}<br>
                        <b>Fecha:</b> ${alertaData.fecha ? new Date(alertaData.fecha).toLocaleString() : 'Sin fecha'}<br>
                        <b>Estado:</b> ${alertaData.estado || 'Sin estado'}
                    </div>
                `,
                icon: 'info',
                customClass: {
                    popup: 'swal-nunito',
                    title: 'swal-title-custom'
                },
                showCloseButton: true,
                showDenyButton: true,
                confirmButtonText: 'Aprobar',
                denyButtonText: 'Rechazar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Aprobar alerta
                    try {
                        const res = await fetch(`/alerts/approve/${alertaId}`, { method: 'PUT' });
                        const data = await res.json();
                        if (data.success) {
                            Swal.fire('¡Aprobada!', 'La alerta fue aprobada.', 'success').then(() => location.reload());
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo aprobar la alerta', 'error');
                        }
                    } catch {
                        Swal.fire('Error', 'No se pudo aprobar la alerta', 'error');
                    }
                } else if (result.isDenied) {
                    // Rechazar alerta
                    try {
                        const res = await fetch(`/alerts/reject/${alertaId}`, { method: 'PUT' });
                        const data = await res.json();
                        if (data.success) {
                            Swal.fire('¡Rechazada!', 'La alerta fue rechazada.', 'success').then(() => location.reload());
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo rechazar la alerta', 'error');
                        }
                    } catch {
                        Swal.fire('Error', 'No se pudo rechazar la alerta', 'error');
                    }
                }
            });
        });
    });
});