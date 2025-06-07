// Editar horario de recolección
document.querySelectorAll('.editar-horario').forEach(btn => {
    btn.addEventListener('click', function() {
        const dia = btn.closest('tr').querySelector('td').innerText.trim().toLowerCase();
        const horarioActual = btn.closest('tr').querySelectorAll('td')[1].innerText.trim();
        const comunidadId = btn.getAttribute('data-comunidad-id') || window.comunidadId || '';

        Swal.fire({
            title: 'Editar horario',
            customClass: {
                popup: 'swal-nunito',
                title: 'swal-title-custom'
            },
            showCloseButton: true,
            html: `
                <form id="horarioForm">
                    <div class="mb-3">
                        <label for="dia" class="form-label">Día</label>
                        <input type="text" id="dia" class="swal2-input form-control" value="${dia.charAt(0).toUpperCase() + dia.slice(1)}" readonly disabled>
                    </div>
                    <div class="mb-3">
                        <label for="nuevoHorario" class="form-label">Nuevo horario</label>
                        <input type="text" id="nuevoHorario" class="swal2-input form-control" value="${horarioActual}" required>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nuevoHorario = document.getElementById('nuevoHorario').value.trim();
                if (!nuevoHorario) {
                    Swal.showValidationMessage('El horario no puede estar vacío');
                    return false;
                }
                return nuevoHorario;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                fetch('/wastemanagement/schedule/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        comunidadId,
                        dia,
                        horario: result.value
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('¡Horario actualizado!', '', 'success').then(() => location.reload());
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo actualizar el horario', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo actualizar el horario', 'error');
                });
            }
        });
    });
});

// Crear campaña de reciclaje
document.addEventListener('DOMContentLoaded', function() {
    const btnCrearCampaña = document.querySelector('#crear-campannia');
    if (btnCrearCampaña) {
        btnCrearCampaña.addEventListener('click', function() {
            Swal.fire({
                title: 'Nueva campaña de reciclaje',
                customClass: {
                    popup: 'swal-nunito',
                    title: 'swal-title-custom'
                },
                showCloseButton: true,
                html: `
                    <form id="campañaForm">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre de la campaña</label>
                            <input type="text" id="nombre" class="swal2-input form-control" placeholder=" " required>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <textarea id="descripcion" class="swal2-textarea form-control" placeholder=" " required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="fecha_campannia" class="form-label">Fecha de la campaña</label>
                            <input type="date" id="fecha_campannia" class="swal2-input form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="hora" class="form-label">Hora</label>
                            <input type="time" id="hora" class="swal2-input form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="lugar" class="form-label">Lugar</label>
                            <input type="text" id="lugar" class="swal2-input form-control" placeholder=" " required>
                        </div>
                    </form>
                `,
                showCancelButton: true,
                confirmButtonText: 'Crear',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const nombre = document.getElementById('nombre').value.trim();
                    const descripcion = document.getElementById('descripcion').value.trim();
                    const fecha_campannia = document.getElementById('fecha_campannia').value;
                    const hora = document.getElementById('hora').value;
                    const lugar = document.getElementById('lugar').value.trim();
                    if (!nombre || !descripcion || !fecha_campannia || !hora || !lugar) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }
                    return { nombre, descripcion, fecha_campannia, hora, lugar };
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    fetch('/wastemanagement/campaigns/create', {
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
                            Swal.fire('¡Campaña creada!', 'La campaña fue registrada exitosamente.', 'success').then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo crear la campaña', 'error');
                        }
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo crear la campaña', 'error');
                    });
                }
            });
        });
    }
});

// Eliminar campaña
document.querySelectorAll('.eliminar-campannia').forEach(btn => {
    btn.addEventListener('click', function() {
        const campaniaId = btn.getAttribute('data-id');
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la campaña permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/wastemanagement/campaigns/delete/${campaniaId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Eliminada', 'La campaña ha sido eliminada.', 'success').then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo eliminar la campaña', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo eliminar la campaña', 'error');
                });
            }
        });
    });
});

// Editar campaña
document.querySelectorAll('.editar-campannia').forEach(btn => {
    btn.addEventListener('click', async function() {
        const campaniaId = btn.getAttribute('data-id');
        let campaniaData = {};
        try {
            const res = await fetch(`/wastemanagement/campaigns/${campaniaId}`);
            campaniaData = await res.json();
        } catch {
            Swal.fire('Error', 'No se pudo obtener la información de la campaña', 'error');
            return;
        }

        Swal.fire({
            title: 'Editar campaña',
            customClass: {
                popup: 'swal-nunito',
                title: 'swal-title-custom'
            },
            showCloseButton: true,
            html: `
                <form id="campaniaEditForm">
                    <div class="mb-3">
                        <label for="editNombre" class="form-label">Nombre de la campaña</label>
                        <input type="text" id="editNombre" class="swal2-input form-control" value="${campaniaData.nombre || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="editDescripcion" class="form-label">Descripción</label>
                        <textarea id="editDescripcion" class="swal2-textarea form-control" required>${campaniaData.descripcion || ''}</textarea>
                    </div>
                    <div class="mb-3">
                        <label for="editFecha" class="form-label">Fecha de la campaña</label>
                        <input type="date" id="editFecha" class="swal2-input form-control" value="${campaniaData.fecha_campannia ? campaniaData.fecha_campannia.substring(0,10) : ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="editHora" class="form-label">Hora</label>
                        <input type="time" id="editHora" class="swal2-input form-control" value="${campaniaData.hora || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="editLugar" class="form-label">Lugar</label>
                        <input type="text" id="editLugar" class="swal2-input form-control" value="${campaniaData.lugar || ''}" required>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre = document.getElementById('editNombre').value.trim();
                const descripcion = document.getElementById('editDescripcion').value.trim();
                const fecha_campannia = document.getElementById('editFecha').value;
                const hora = document.getElementById('editHora').value;
                const lugar = document.getElementById('editLugar').value.trim();
                if (!nombre || !descripcion || !fecha_campannia || !hora || !lugar) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { nombre, descripcion, fecha_campannia, hora, lugar };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                fetch(`/wastemanagement/campaigns/update/${campaniaId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result.value)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('¡Campaña actualizada!', 'La campaña fue actualizada exitosamente', 'success').then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo actualizar la campaña', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo actualizar la campaña', 'error');
                });
            }
        });
    });
});

// Ver campaña
document.querySelectorAll('.ver-campannia').forEach(btn => {
    btn.addEventListener('click', async function() {
        const campaniaId = btn.getAttribute('data-id');
        let campaniaData = {};
        try {
            const res = await fetch(`/wastemanagement/campaigns/${campaniaId}`);
            campaniaData = await res.json();
        } catch {
            Swal.fire('Error', 'No se pudo obtener la información de la campaña', 'error');
            return;
        }

        Swal.fire({
            title: campaniaData.nombre || 'Campaña',
            html: `
                <div style="text-align:left">
                    <b>Descripción:</b><br> ${campaniaData.descripcion || 'Sin descripción'}<br>
                    <b>Fecha:</b> ${campaniaData.fecha_campannia ? new Date(campaniaData.fecha_campannia).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sin fecha'}<br>
                    <b>Hora:</b> ${campaniaData.hora || 'Sin hora'}<br>
                    <b>Lugar:</b> ${campaniaData.lugar || 'Sin lugar'}<br>
                    <b>Estado:</b> ${campaniaData.estado || 'Sin estado'}
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
                // Aprobar campaña
                try {
                    const res = await fetch(`/wastemanagement/campaigns/approve/${campaniaId}`, { method: 'PUT' });
                    const data = await res.json();
                    if (data.success) {
                        Swal.fire('¡Aprobada!', 'La campaña fue aprobada.', 'success').then(() => location.reload());
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo aprobar la campaña', 'error');
                    }
                } catch {
                    Swal.fire('Error', 'No se pudo aprobar la campaña', 'error');
                }
            } else if (result.isDenied) {
                // Rechazar campaña
                try {
                    const res = await fetch(`/wastemanagement/campaigns/reject/${campaniaId}`, { method: 'PUT' });
                    const data = await res.json();
                    if (data.success) {
                        Swal.fire('¡Rechazada!', 'La campaña fue rechazada.', 'success').then(() => location.reload());
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo rechazar la campaña', 'error');
                    }
                } catch {
                    Swal.fire('Error', 'No se pudo rechazar la campaña', 'error');
                }
            }
        });
    });
});

// Crear punto de reciclaje
document.querySelectorAll('#crear-punto').forEach(btn => {
    btn.addEventListener('click', function() {
        Swal.fire({
            title: 'Nuevo punto de reciclaje',
            customClass: {
                popup: 'swal-nunito',
                title: 'swal-title-custom'
            },
            showCloseButton: true,
            html: `
                <form id="puntoForm">
                    <div class="mb-3">
                        <label for="nombrePunto" class="form-label">Nombre del punto</label>
                        <input type="text" id="nombrePunto" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="direccionPunto" class="form-label">Dirección</label>
                        <input type="text" id="direccionPunto" class="swal2-input form-control" required>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre = document.getElementById('nombrePunto').value.trim();
                const direccion = document.getElementById('direccionPunto').value.trim();
                if (!nombre || !direccion) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { nombre, direccion };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                fetch('/wastemanagement/collection-points/create', {
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
                        Swal.fire('¡Punto creado!', 'El punto de reciclaje fue registrado exitosamente.', 'success').then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo crear el punto', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo crear el punto', 'error');
                });
            }
        });
    });
});

// Editar punto de reciclaje
document.querySelectorAll('.editar-punto').forEach(btn => {
    btn.addEventListener('click', async function() {
        const puntoId = btn.getAttribute('data-id');
        let puntoData = {};
        try {
            const res = await fetch(`/wastemanagement/collection-points/${puntoId}`);
            puntoData = await res.json();
        } catch {
            Swal.fire('Error', 'No se pudo obtener la información del punto', 'error');
            return;
        }

        Swal.fire({
            title: 'Editar punto de reciclaje',
            customClass: {
                popup: 'swal-nunito',
                title: 'swal-title-custom'
            },
            showCloseButton: true,
            html: `
                <form id="puntoEditForm">
                    <div class="mb-3">
                        <label for="editNombrePunto" class="form-label">Nombre del punto</label>
                        <input type="text" id="editNombrePunto" class="swal2-input form-control" value="${puntoData.nombre || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label for="editDireccionPunto" class="form-label">Dirección</label>
                        <input type="text" id="editDireccionPunto" class="swal2-input form-control" value="${puntoData.direccion || ''}" required>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre = document.getElementById('editNombrePunto').value.trim();
                const direccion = document.getElementById('editDireccionPunto').value.trim();
                if (!nombre || !direccion) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { nombre, direccion };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                fetch(`/wastemanagement/collection-points/update/${puntoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result.value)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('¡Punto actualizado!', 'El punto fue actualizado exitosamente', 'success').then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo actualizar el punto', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo actualizar el punto', 'error');
                });
            }
        });
    });
});

// Eliminar punto de reciclaje
document.querySelectorAll('.eliminar-punto').forEach(btn => {
    btn.addEventListener('click', function() {
        const puntoId = btn.getAttribute('data-id');
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el punto permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/wastemanagement/collection-points/delete/${puntoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Eliminado', 'El punto ha sido eliminado.', 'success').then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo eliminar el punto', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo eliminar el punto', 'error');
                });
            }
        });
    });
});