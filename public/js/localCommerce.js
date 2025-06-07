document.addEventListener('DOMContentLoaded', function() {
    // Crear oferta
    document.querySelector('#crear-oferta').addEventListener('click', function() {
        Swal.fire({
            title: 'Nueva oferta',
            customClass: {
                popup: 'swal-nunito',
                title: 'swal-title-custom'
            },
            showCloseButton: true,
            html:
                `<form id="ofertaForm">
                    <div class="mb-3">
                        <label for="nombre_negocio" class="form-label">Nombre del negocio</label>
                        <input type="text" id="nombre_negocio" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="direccion_negocio" class="form-label">Dirección del negocio</label>
                        <input type="text" id="direccion_negocio" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="descuento" class="form-label">Descuento (ej: -20%, 2x1)</label>
                        <input type="text" id="descuento" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="fecha_vigencia" class="form-label">Fecha de vigencia</label>
                        <input type="date" id="fecha_vigencia" class="swal2-input form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <textarea id="descripcion" class="swal2-textarea form-control" required></textarea>
                    </div>
                </form>`,
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const nombre_negocio = document.getElementById('nombre_negocio').value.trim();
                const direccion_negocio = document.getElementById('direccion_negocio').value.trim();
                const descuento = document.getElementById('descuento').value.trim();
                const fecha_vigencia = document.getElementById('fecha_vigencia').value;
                const descripcion = document.getElementById('descripcion').value.trim();
                if (!nombre_negocio || !direccion_negocio || !descuento || !fecha_vigencia || !descripcion) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { nombre_negocio, direccion_negocio, descuento, fecha_vigencia, descripcion };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                fetch('/localcommerce/create', {
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
                        Swal.fire('¡Oferta enviada!', 'La oferta se envió para su aprobación', 'success').then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo crear la oferta', 'error');
                    }
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo crear la oferta', 'error');
                });
            }
        });
    });

    // Eliminar oferta
    document.querySelectorAll('.eliminar-oferta').forEach(btn => {
        btn.addEventListener('click', function() {
            const ofertaId = btn.getAttribute('data-id');
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará la oferta permanentemente.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/localcommerce/delete/${ofertaId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('Eliminada', 'La oferta ha sido eliminada.', 'success').then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo eliminar la oferta', 'error');
                        }
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo eliminar la oferta', 'error');
                    });
                }
            });
        });
    });

    // Editar oferta
    document.querySelectorAll('.editar-oferta').forEach(btn => {
        btn.addEventListener('click', async function() {
            const ofertaId = btn.getAttribute('data-id');
            let ofertaData = {};
            try {
                const res = await fetch(`/localcommerce/${ofertaId}`);
                ofertaData = await res.json();
            } catch {
                Swal.fire('Error', 'No se pudo obtener la información de la oferta', 'error');
                return;
            }

            Swal.fire({
                title: 'Editar oferta',
                customClass: {
                    popup: 'swal-nunito',
                    title: 'swal-title-custom'
                },
                showCloseButton: true,
                html:
                    `<form id="ofertaEditForm">
                        <div class="mb-3">
                            <label for="editNombreNegocio" class="form-label">Nombre del negocio</label>
                            <input type="text" id="editNombreNegocio" class="swal2-input form-control" value="${ofertaData.nombre_negocio || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDireccionNegocio" class="form-label">Dirección del negocio</label>
                            <input type="text" id="editDireccionNegocio" class="swal2-input form-control" value="${ofertaData.direccion_negocio || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDescuento" class="form-label">Descuento</label>
                            <input type="text" id="editDescuento" class="swal2-input form-control" value="${ofertaData.descuento || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editFechaVigencia" class="form-label">Fecha de vigencia</label>
                            <input type="date" id="editFechaVigencia" class="swal2-input form-control" value="${ofertaData.fecha_vigencia ? ofertaData.fecha_vigencia.split('T')[0] : ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDescripcion" class="form-label">Descripción</label>
                            <textarea id="editDescripcion" class="swal2-textarea form-control" required>${ofertaData.descripcion || ''}</textarea>
                        </div>
                    </form>`,
                showCancelButton: true,
                confirmButtonText: 'Actualizar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const nombre_negocio = document.getElementById('editNombreNegocio').value.trim();
                    const direccion_negocio = document.getElementById('editDireccionNegocio').value.trim();
                    const descuento = document.getElementById('editDescuento').value.trim();
                    const fecha_vigencia = document.getElementById('editFechaVigencia').value;
                    const descripcion = document.getElementById('editDescripcion').value.trim();
                    if (!nombre_negocio || !direccion_negocio || !descuento || !fecha_vigencia || !descripcion) {
                        Swal.showValidationMessage('Todos los campos son obligatorios');
                        return false;
                    }
                    return { nombre_negocio, direccion_negocio, descuento, fecha_vigencia, descripcion };
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    fetch(`/localcommerce/update/${ofertaId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(result.value)
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            Swal.fire('¡Oferta actualizada!', 'La oferta fue actualizada exitosamente', 'success').then(() => {
                                location.reload();
                            });
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo actualizar la oferta', 'error');
                        }
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo actualizar la oferta', 'error');
                    });
                }
            });
        });
    });

    // Ver oferta y aprobar/rechazar
    document.querySelectorAll('.ver-oferta').forEach(btn => {
        btn.addEventListener('click', async function() {
            const ofertaId = btn.getAttribute('data-id');
            let ofertaData = {};
            try {
                const res = await fetch(`/localcommerce/${ofertaId}`);
                ofertaData = await res.json();
            } catch {
                Swal.fire('Error', 'No se pudo obtener la información de la oferta', 'error');
                return;
            }

            Swal.fire({
                title: ofertaData.nombre_negocio || 'Oferta',
                html: `
                    <div style="text-align:left">
                        <b>Dirección:</b> ${ofertaData.direccion_negocio || 'Sin dirección'}<br>
                        <b>Descuento:</b> ${ofertaData.descuento || 'Sin descuento'}<br>
                        <b>Fecha de vigencia:</b> ${ofertaData.fecha_vigencia ? new Date(ofertaData.fecha_vigencia).toLocaleDateString() : 'Sin fecha'}<br>
                        <b>Descripción:</b><br> ${ofertaData.descripcion || 'No hay descripción disponible'}<br>
                        <b>Estado:</b> ${ofertaData.estado || 'Sin estado'}
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
                    // Aprobar oferta
                    try {
                        const res = await fetch(`/localcommerce/approve/${ofertaId}`, { method: 'PUT' });
                        const data = await res.json();
                        if (data.success) {
                            Swal.fire('¡Aprobada!', 'La oferta fue aprobada.', 'success').then(() => location.reload());
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo aprobar la oferta', 'error');
                        }
                    } catch {
                        Swal.fire('Error', 'No se pudo aprobar la oferta', 'error');
                    }
                } else if (result.isDenied) {
                    // Rechazar oferta
                    try {
                        const res = await fetch(`/localcommerce/reject/${ofertaId}`, { method: 'PUT' });
                        const data = await res.json();
                        if (data.success) {
                            Swal.fire('¡Rechazada!', 'La oferta fue rechazada.', 'success').then(() => location.reload());
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo rechazar la oferta', 'error');
                        }
                    } catch {
                        Swal.fire('Error', 'No se pudo rechazar la oferta', 'error');
                    }
                }
            });
        });
    });
});