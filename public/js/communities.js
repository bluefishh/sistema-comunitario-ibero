// Se declara la variable debounceTimeout para almacenar el timeout
let debounceTimeout;
// Se declara la variable lastQuery para almacenar la última consulta
let lastQuery = "";

// Se añade un evento de escucha al input con id 'buscarComunidad' para explorar nuevas comunidades
document.getElementById('buscarComunidad').addEventListener('input', function() {
    clearTimeout(debounceTimeout);
    const query = this.value.trim();
    lastQuery = query;
    debounceTimeout = setTimeout(async () => {
        if (query.length < 3) {
            document.getElementById('explorar').innerHTML = '<p class="text-muted text-center">Busque una comunidad para unirse.</p>';
            return;
        }
        try {
            // Se realiza la consulta a la API de Nominatim
            const res = await fetch(`/api/nominatim/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            const barrios = data.filter(item =>
                ['suburb', 'neighbourhood', 'quarter', 'residential', 'borough', 'block'].includes(item.type)
            );
            if (query !== lastQuery) return;
            let html = '';
            if (!barrios.length) {
                html = '<p class="text-muted text-center mt-3">No se encontraron barrios.</p>';
            } else {
                html = barrios.map(item => {
                    const address = item.address || {};
                    const nombreBarrio = address.suburb || address.neighbourhood || address.quarter || address.residential || address.borough || address.block || '';
                    const municipio = address.city || address.town || address.village || address.county || '';
                    const departamento = address.state || '';
                    const pais = address.country || '';
                    const ubicacion = [departamento, municipio, pais].filter(Boolean).join(', ');

                    return `
                        <div class="card mb-4">
                            <div class="card-body d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <img src="/img/default_image_community.png" alt="imgComunidad" id="community-image">
                                    <div class="card-content ms-4">
                                        <h5 class="card-title">${nombreBarrio}</h5>
                                        <p class="card-text text-muted">${ubicacion}</p>
                                    </div>
                                </div>
                                <div class="d-flex flex-column align-items-end">
                                    <button class="btn btn-danger btn-main" onclick="guardarComunidad('${item.osm_id}', '${nombreBarrio}', '${municipio}', '${departamento}', '')">Unirse</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            document.getElementById('explorar').innerHTML = html;
        } catch (err) {
            document.getElementById('explorar').innerHTML = '<p class="text-danger text-center">Error al buscar comunidades.</p>';
        }
    }, 500);
});

// Se añade función para guardar la comunidad haciendo un POST a la API 
function guardarComunidad(osm_id, nombre, ciudad = '', estado = '', codigoPostal = '') {
    const comunidad = {
        apiId: osm_id,
        nombre: nombre,
        ciudad: ciudad,
        estado: estado,
        codigoPostal: codigoPostal
    };

    fetch('/communities/join', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comunidad)
    })
    .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error('Respuesta inesperada del servidor: ' + text.slice(0, 100));
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error');

        if (res.status === 200) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: data.message || 'Ya eres parte de esta comunidad.',
                showConfirmButton: true
            });
        } else if (res.status === 201) {
            Swal.fire({
            icon: 'success',
            title: '¡Hecho!',
            text: 'Ahora eres parte de la comunidad.',
            showConfirmButton: true
            }).then(() => {
                location.reload();
            });
        }
    })
    .catch(err => {
        console.log(err.message || 'Error al unirse a la comunidad');
    });
}

// Se añade un evento de escucha al input con id 'buscarComunidad' para filtrar las comunidades unidas
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('buscarComunidad');
    const misComunidadesDiv = document.getElementById('mis-comunidades');
    if (input && misComunidadesDiv) {
        input.addEventListener('input', function () {
            const filtro = input.value.toLowerCase();
            const cards = misComunidadesDiv.querySelectorAll('.card');
            cards.forEach(card => {
                const nombre = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const ciudad = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
                if (nombre.includes(filtro) || ciudad.includes(filtro)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Limpiar input al cambiar de tab
    const tabs = document.querySelectorAll('#comunidadTabs a[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function () {
            if (input) {
                input.value = '';
                input.dispatchEvent(new Event('input'));
            }
        });
    });
});