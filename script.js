// --- DOM Elements ---
const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const promptOption = document.querySelector(".prompt-option");

const API_KEY = "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"; // ¡CUIDADO! No exponer en producción.

// Sidebar controls
const shapeRadios = document.querySelectorAll('input[name="shape"]');
const scaleSlider = document.getElementById('scale');
const scaleValueDisplay = document.getElementById('scale-val');
const densitySlider = document.getElementById('density');
const densityValueDisplay = document.getElementById('density-val');
const rotationSlider = document.getElementById('rotation');
const rotationValueDisplay = document.getElementById('rotation-val');

// --- INICIO: Elementos del DOM para el Modal de Exportación ---
const exportSidebarBtn = document.querySelector(".sidebar .export-btn");
const exportModal = document.getElementById('export-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const exportFormatBtns = document.querySelectorAll('.export-format-btn');
const sharePatternBtn = document.getElementById('share-pattern-btn');
const exportStatusMsg = document.getElementById('export-status');
// --- FIN: Elementos del DOM para el Modal de Exportación ---


const examplePrompts = [
  "Seamless tileable pattern para cocina moderna y elegante en tonos azules y verdes. Incluye siluetas estilizadas de utensilios de cocina, hojas de hierbas y líneas geométricas finas. Estilo minimalista, colores planos y bordes limpios para uso en baldosa repetible.", 
  "Patrón repetible para habitación infantil, alegre y colorido. Elementos: dibujos simplificados de animales (osos, conejos), bloques de juguetes y nubes, todo en paleta pastel. Diseño divertido y acogedor, estilo dibujo infantil con contornos suaves, completamente tileable.", 
   "Seamless tileable pattern para dormitorio juvenil en tonos rosa y morado. Motivos: grafitis suaves, estrellas fugaces y casitas estilizadas. Estilo moderno y divertido, contornos limpios y repetición perfecta.",
  "Tileable pattern para baño infantil con paleta pastel (celeste, rosa, amarillo). Elementos: patitos, burbujas y conchas de mar simplificadas. Diseño juguetón y acogedor, bordes suaves.",
  "Seamless pattern para terraza al aire libre en verdes y corales. Incluye hojas tropicales, macetas geométricas y gotas de agua, estilo plano y repetible sin cortes.",
  "Tileable texture para pared de acento en sala, paleta gris y dorado. Motivos: líneas diagonales, triángulos superpuestos y toques metálicos, estilo minimalista y repetición perfecta.",
  "Seamless pattern para cafetería vintage en marrones y crema. Elementos: tazas, granos de café y ramas de café estilizadas, sin sombras, bordes nítidos.",
  "Tileable pattern para restaurante mexicano en rojos, verdes y blancos. Iconos de chiles, sombreros y piñas, estilo folk minimalista y repetible.",
  "Seamless texture para sala de lectura con paleta cálida (terracota, beige). Motivos: libros abiertos, lámparas y tazas de té, líneas finas y repetición continua.",
  "Tileable pattern para pasillo de hotel en azul petróleo y dorado. Diseño geométrico con rombos y hexágonos, estilo art déco minimalista, seamless.",
  "Seamless pattern para cocina rústica en tonos tierra. Motivos: utensilios de madera, ramas de olivo y círculos irregulares, estilo hand-drawn y repetible.",
  "Tileable pattern para cocina industrial en negro, gris y rojo. Incluye engranajes, tuercas y líneas técnicas, estilo gráfico y seamless.",
  "Seamless texture para spa en paleta spa-green y blanco. Elementos: piedras apiladas, hojas de eucalipto y gotas, diseño relajante y repetición perfecta.",
  "Tileable pattern para gimnasio en tonos neón sobre fondo oscuro. Motivos: pesas, siluetas de movimiento y rayas dinámicas, estilo energético y seamless.",
  "Seamless pattern para biblioteca infantil con paleta multicolor suave. Elementos: letras, bloques de colores y globos, estilo alegre y repetible.",
  "Tileable pattern para guardería en tonos pastel y acuarela. Iconos de animales de granja, florecitas y nubes, contornos acuarelados y seamless.",
  "Seamless texture para estudio de música en negro, dorado y azul oscuro. Motivos: notas musicales, auriculares y formas de onda, estilo elegante y repetible.",
  "Tileable pattern para comedor familiar en tonos cálidos (ocre, marrón). Elementos: cubiertos, platos y servilletas esquemáticas, estilo contemporáneo y seamless.",
  "Seamless pattern para recibidor en blanco y grafito. Diseño con líneas entrecruzadas y puntos estratégicos, estética minimalista y repetible.",
  "Tileable pattern para farmacia en verdes y blanco. Elementos: cruces, frascos de medicina y hojas, estilo limpio y seamless.",
  "Seamless texture para tienda de moda en rosa viejo y negro. Motivos: perchas, tacones y labios, estilo fashion sketch y repetible.",
  "Tileable pattern para bar de cócteles en turquesa y naranja. Incluye copas, rodajas de cítricos y pajitas, estilo flat design y seamless."
];

// --- Three.js Setup ---
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
camera.position.set(0, 0, 3);
const textureLoader = new THREE.TextureLoader();

// --- Sphere and Material ---
let currentTexture = null; // <--- TU VARIABLE GLOBAL para la textura activa
let sphereMaterial;
const sphereGeometry = new THREE.SphereGeometry( 1, 64, 64);
sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    metalness: 0.2,
    roughness: 0.8,
    fog:true,
    map: null
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// --- State for Texture Mode ---
let activeTextureMode = 'procedural'; 
let currentAiImageSrc = null;     

// --- Theme ---
(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    document.body.classList.toggle("dark-theme", isDarkTheme);
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();
const ToggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
};

const getImageDimensions = (aspectRatioString, modelIdentifier) => {
    let baseWidth = 512;
    let baseHeight = 512;
    let multiple = 8;
    if (modelIdentifier.includes("xl") || modelIdentifier.includes("FLUX")) {
        baseWidth = 1024;
        baseHeight = 1024;
        multiple = 64;
    }
    const [ratioW, ratioH] = aspectRatioString.split(":").map(Number);
    let targetWidth, targetHeight;
    if (ratioW / ratioH > baseWidth / baseHeight) {
        targetWidth = baseWidth;
        targetHeight = Math.round(baseWidth * (ratioH / ratioW));
    } else {
        targetHeight = baseHeight;
        targetWidth = Math.round(baseHeight * (ratioW / ratioH));
    }
    targetWidth = Math.max(multiple, Math.round(targetWidth / multiple) * multiple);
    targetHeight = Math.max(multiple, Math.round(targetHeight / multiple) * multiple);
    return { width: targetWidth, height: targetHeight };
};

const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
    const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
    const { width, height } = getImageDimensions(aspectRatio, selectedModel);
    console.log(`Generating ${imageCount} images with ${selectedModel} for prompt: "${promptText}" at ${width}x${height}`);
    const imagePromises = Array.from({ length: imageCount }, async (_, index) => {
        try {
            const response = await fetch(MODEL_URL, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "x-use-cache": "false",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: promptText,
                    parameters: { width, height, num_inference_steps: selectedModel.includes("FLUX.1-schnell") ? 8 : 25 },
                    options: { wait_for_model: true, use_cache: false },
                }),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`API Error for image ${index + 1}: ${response.status} ${response.statusText}`, errorBody);
                try { throw new Error(JSON.parse(errorBody).error || `HTTP error! status: ${response.status}`); }
                catch (e) { throw new Error(errorBody || `HTTP error! status: ${response.status}`); }
            }
            const blob = await response.blob();
            if (blob.type === "application/json" || blob.size === 0) {
                const errorText = await blob.text();
                console.error("Received JSON/empty instead of image, possible error:", errorText);
                throw new Error(JSON.parse(errorText).error || "API returned invalid data");
            }
            return { status: 'fulfilled', value: blob, index }; // Devolvemos el índice original también
        } catch (error) {
            console.error(`Error generating image ${index + 1}:`, error);
            // Asegúrate de que 'reason' sea un string y que index esté presente para manejo de errores
            return { status: 'rejected', reason: error.message || "Unknown error", index };
        }
    });
    return Promise.allSettled(imagePromises);
};

const createImageCards = async (selectedModel, imageCount, promptText) => {
    promptOption.innerHTML = "";
    const cardElements = [];
    for (let i = 0; i < imageCount; i++) {
        const cardDiv = document.createElement('div');
        cardDiv.className = "img-card loading";
        cardDiv.id = `img-card-${i}`;
        cardDiv.innerHTML = `
            <div class="status-container">
                <div class="spinner"></div>
                <p class="status-text">Generando...</p>
            </div>
            <img src="" class="result-img" alt="Generated pattern ${i + 1}" style="display:none; cursor:pointer;">
            <div class="img-overlay">
                <button class="img-download-btn" title="Descargar imagen">
                    <i class="fa-solid fa-download"></i>
                </button>
            </div>`;
        promptOption.appendChild(cardDiv);
        cardElements.push(cardDiv);
    }

    const aspectRatio = "1:1";
    const results = await generateImages(selectedModel, imageCount, aspectRatio, promptText);

    results.forEach(result => {
        // Obtener el índice: si es fulfilled, del valor; si es rejected, de la razón (si la incluiste)
        const originalIndex = result.status === 'fulfilled' ? result.value.index : (result.reason && result.reason.index !== undefined ? result.reason.index : -1);

        if (originalIndex === -1 && result.status === 'rejected') {
             // Si no podemos obtener el índice de un error, intentamos usar el índice del bucle de results,
             // pero esto es menos fiable si las promesas no se resuelven en orden (aunque con Promise.allSettled deberían).
             // Lo ideal es que 'index' siempre se incluya en el objeto de error.
             // Por ahora, si no hay índice, simplemente logueamos y podríamos saltar esta tarjeta.
            console.error("Could not determine original index for a rejected result, or result structure is unexpected:", result);
            // Encuentra la primera tarjeta 'loading' que no haya sido procesada. Esto es un fallback.
            const cardWithError = promptOption.querySelector(`.img-card.loading`);
            if (cardWithError) {
                cardWithError.classList.remove("loading");
                const statusText = cardWithError.querySelector(".status-text");
                if (statusText) statusText.textContent = `Error: ${result.reason || 'Desconocido (sin índice)'}`;
            }
            return;
        }
        
        // Si el originalIndex es -1 pero fue 'fulfilled', algo muy raro pasó.
        if (originalIndex === -1) {
            console.error("Fulfilled result is missing index:", result);
            return; // Salir si no hay índice válido
        }

        const card = cardElements[originalIndex]; // Usar el índice original
        if (!card) {
            console.error("Card not found for original index:", originalIndex);
            return;
        }


        card.classList.remove("loading");
        const imgElement = card.querySelector(".result-img");
        const statusContainer = card.querySelector(".status-container");
        const statusText = card.querySelector(".status-text");
        const downloadBtn = card.querySelector(".img-download-btn");

        if (result.status === "fulfilled" && result.value.value instanceof Blob && result.value.value.size > 0) {
            const imageUrl = URL.createObjectURL(result.value.value);
            imgElement.src = imageUrl;
            imgElement.style.display = 'block';
            if(statusContainer) statusContainer.style.display = 'none';

            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                const a = document.createElement('a');
                a.href = imageUrl;
                a.download = `pattern-${selectedModel.split('/').pop()}-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };

            imgElement.addEventListener('click', () => {
                document.querySelectorAll('.prompt-option .img-card.selected').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                applyAiTextureToSphere(imageUrl);
            });

        } else {
            imgElement.style.display = 'none';
            if(statusContainer) statusContainer.style.display = 'flex';
            statusText.textContent = `Error: ${result.reason || 'Desconocido'}`; // result.reason debería ser un string
            console.error(`Failed to load image for card ${originalIndex}:`, result.reason);
        }
    });
};

function applyAiTextureToSphere(imageUrl) {
    if (currentTexture && currentTexture !== sphereMaterial.map) {
        currentTexture.dispose();
    }
    if (sphereMaterial.map && sphereMaterial.map !== currentTexture) { // Si había una textura AI previa diferente
         if(sphereMaterial.map.dispose) sphereMaterial.map.dispose(); // Asegurarse que existe dispose
    }

    textureLoader.load(
        imageUrl,
        (loadedTexture) => {
            currentTexture = loadedTexture;
            currentTexture.wrapS = THREE.RepeatWrapping;
            currentTexture.wrapT = THREE.RepeatWrapping;
            
            sphereMaterial.map = currentTexture;
            sphereMaterial.needsUpdate = true;
            
            activeTextureMode = 'ai';
            currentAiImageSrc = imageUrl;
            
            console.log("AI Texture applied to sphere. Mode:", activeTextureMode);
            applyTextureTransformations();
        },
        undefined,
        (err) => {
            console.error('Error loading AI texture for sphere:', err);
            switchToProceduralTexture();
        }
    );
}

const handleFormSubmit = (e) => {
    e.preventDefault();

    const selectedModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    let promptText = promptInput.value.trim();

    if (!selectedModel) {
        alert("Por favor, selecciona un modelo.");
        return;
    }
    if (!promptText) {
        alert("Por favor, escribe una descripción.");
        promptInput.focus();
        return;
    }

    const selectedShapeType = document.querySelector('input[name="shape"]:checked').value;
    const shapePromptPrefix = selectedShapeType === 'geometric' ? "Geometric pattern, " : "Organic pattern, ";
    promptText = shapePromptPrefix + promptText;
    if (!promptText.toLowerCase().includes("tileable") && !promptText.toLowerCase().includes("seamless")) {
        promptText = "Tileable seamless pattern. " + promptText;
    }

    console.log(`Form submitted: Model: ${selectedModel}, Count: ${imageCount}, Prompt: "${promptText}"`);
    
    // Añadir spinner al botón de generar
    const submitButton = e.target.querySelector('button[type="submit"]'); // O promptForm.querySelector(...)
    const originalButtonHTML = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<div class="spinner" style="width:1em; height:1em; border-width:2px; margin-right:5px; display:inline-block;"></div> Generando...`;


    createImageCards(selectedModel, imageCount, promptText)
        .catch(error => { // Captura errores si createImageCards o generateImages fallan catastróficamente
            console.error("Error catastrófico durante la generación de imágenes:", error);
            alert(`Ocurrió un error grave: ${error.message}`);
        })
        .finally(() => { // Se ejecuta siempre, después del try o catch
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
        });
};

promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
});
promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", ToggleTheme);

function resize() {
    const viewer = document.querySelector('.viewer');
    if (!viewer) return;
    const width = viewer.offsetWidth;
    const height = viewer.offsetHeight;
    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}
window.addEventListener('resize', resize);


const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 5, 5);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

function generateProceduralTexture() {
    const shapeType = document.querySelector('input[name="shape"]:checked').value;
    const itemScale = parseFloat(scaleSlider.value);
    const density = parseFloat(densitySlider.value);
    const textureRotation = parseFloat(rotationSlider.value);

    const textureCanvas = document.createElement('canvas');
    const textureSize = 256;
    textureCanvas.width = textureSize;
    textureCanvas.height = textureSize;
    const ctx = textureCanvas.getContext('2d');
    ctx.clearRect(0,0,textureSize, textureSize);
    ctx.translate(textureSize / 2, textureSize / 2);
    ctx.rotate(THREE.MathUtils.degToRad(textureRotation));
    ctx.translate(-textureSize / 2, -textureSize / 2);
    ctx.fillStyle = document.body.classList.contains('dark-theme') ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
    const numItems = Math.floor(density * 2.5);
    const baseItemSize = 2;
    const actualItemSize = baseItemSize * (itemScale / 5);
    for (let i = 0; i < numItems; i++) {
        const x = Math.random() * textureSize;
        const y = Math.random() * textureSize;
        if (shapeType === 'organic') {
            ctx.beginPath();
            ctx.arc(x, y, actualItemSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(x - actualItemSize / 2, y - actualItemSize / 2, actualItemSize, actualItemSize);
        }
    }
    return new THREE.CanvasTexture(textureCanvas);
}

function switchToProceduralTexture() {
    activeTextureMode = 'procedural';
    currentAiImageSrc = null;
    document.querySelectorAll('.prompt-option .img-card.selected').forEach(c => c.classList.remove('selected'));
    console.log("Switched to procedural texture. Mode:", activeTextureMode);
    applyTextureTransformations();
}

function applyTextureTransformations() {
    const scale = parseFloat(scaleSlider.value);
    const density = parseFloat(densitySlider.value);
    const rotation = parseFloat(rotationSlider.value);

    scaleValueDisplay.textContent = scale;
    densityValueDisplay.textContent = density;
    rotationValueDisplay.textContent = rotation;

    if (currentTexture) {
        if (activeTextureMode === 'procedural' && !(currentTexture instanceof THREE.CanvasTexture)) {
            if(currentTexture.dispose) currentTexture.dispose();
            currentTexture = null;
        } else if (activeTextureMode === 'ai' && currentTexture instanceof THREE.CanvasTexture) {
            if(currentTexture.dispose) currentTexture.dispose();
            currentTexture = null;
        }
    }
    
    if (activeTextureMode === 'procedural') {
        if (currentTexture && currentTexture.isCanvasTexture) {
            if(currentTexture.dispose) currentTexture.dispose();
        }
        currentTexture = generateProceduralTexture();
        currentTexture.needsUpdate = true;
        sphereMaterial.map = currentTexture;
    } else if (activeTextureMode === 'ai' && currentTexture && currentTexture.isTexture) {
        const repeatValue = THREE.MathUtils.mapLinear(scale, 1, 50, 5, 0.2); // Invertido para que más escala sea "menos repeticiones"
        currentTexture.repeat.set(repeatValue, repeatValue);
        const offsetX = THREE.MathUtils.mapLinear(density, 1, 100, -0.5, 0.5);
        const offsetY = THREE.MathUtils.mapLinear(density, 1, 100, -0.5, 0.5);
        currentTexture.offset.set(offsetX, offsetY);
        currentTexture.center.set(0.5, 0.5);
        currentTexture.rotation = THREE.MathUtils.degToRad(rotation);
        currentTexture.wrapS = THREE.RepeatWrapping;
        currentTexture.wrapT = THREE.RepeatWrapping;
        currentTexture.needsUpdate = true;
    } else if (activeTextureMode === 'ai' && !currentTexture && currentAiImageSrc) {
        console.log("Re-applying AI texture from saved source due to slider change.");
        applyAiTextureToSphere(currentAiImageSrc);
        return;
    }
    sphereMaterial.needsUpdate = true;
}

shapeRadios.forEach(radio => {
    radio.addEventListener('change', switchToProceduralTexture);
});

[scaleSlider, densitySlider, rotationSlider].forEach(slider => {
    slider.addEventListener('input', applyTextureTransformations);
});

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
const mouseRotationSpeed = 0.007;
canvas.addEventListener('mousedown', (e) => { isDragging = true; previousMousePosition = { x: e.clientX, y: e.clientY }; canvas.style.cursor = 'grabbing'; });
window.addEventListener('mousemove', (e) => { if (!isDragging) return; const dM = { x: e.clientX - previousMousePosition.x, y: e.clientY - previousMousePosition.y }; sphere.rotation.y += dM.x * mouseRotationSpeed; sphere.rotation.x += dM.y * mouseRotationSpeed; previousMousePosition = { x: e.clientX, y: e.clientY }; });
window.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; canvas.style.cursor = 'grab'; } });
canvas.addEventListener('mouseenter', () => { if (!isDragging) canvas.style.cursor = 'grab'; });
canvas.addEventListener('mouseleave', () => { if (!isDragging) canvas.style.cursor = 'default'; if (isDragging) { isDragging = false; canvas.style.cursor = 'default'; } });

const zoomSpeed = 0.1; const minZoom = 1.5; const maxZoom = 10;
canvas.addEventListener('wheel', (event) => { event.preventDefault(); const zD = event.deltaY > 0 ? 1 : -1; let nZ = camera.position.z + zD * zoomSpeed; camera.position.z = Math.max(minZoom, Math.min(maxZoom, nZ)); });

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


// --- INICIO: Lógica del Modal de Exportación (Adaptada a tus variables) ---
function openExportModal() {
    // Usamos 'currentTexture' para saber si hay algo activo, y 'activeTextureMode' para diferenciar
    if (!currentTexture) { // Si no hay ninguna textura (ni procedural ni AI aplicada)
        alert("Primero genera o selecciona una textura para exportar.");
        return;
    }
    exportModal.classList.add('active');
    exportStatusMsg.style.display = 'none';
    exportStatusMsg.textContent = '';
}

function closeExportModal() {
    exportModal.classList.remove('active');
}

exportSidebarBtn.addEventListener('click', openExportModal);
modalCloseBtn.addEventListener('click', closeExportModal);
exportModal.addEventListener('click', (e) => {
    if (e.target === exportModal) {
        closeExportModal();
    }
});

exportFormatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.disabled) return;

        const format = btn.dataset.format;
        exportStatusMsg.style.display = 'block';
        exportStatusMsg.textContent = `Exportando a ${format.toUpperCase()}...`;

        let exportUrl = null;
        let filename = `qube_pattern_${Date.now()}`;

        if (activeTextureMode === 'ai' && currentAiImageSrc) {
            // Para texturas AI, usamos la URL original del blob
            exportUrl = currentAiImageSrc;
            filename += (format === 'jpg' ? '.jpg' : '.png');
        } else if (activeTextureMode === 'procedural' && currentTexture && currentTexture.image instanceof HTMLCanvasElement) {
            // Para texturas procedurales, currentTexture.image es el canvas
            const proceduralCanvas = currentTexture.image;
            if (format === 'png') {
                exportUrl = proceduralCanvas.toDataURL('image/png');
                filename += '.png';
            } else if (format === 'jpg') {
                exportUrl = proceduralCanvas.toDataURL('image/jpeg', 0.9);
                filename += '.jpg';
            } else {
                exportStatusMsg.textContent = `Formato ${format.toUpperCase()} no soportado para texturas procedurales aún.`;
                setTimeout(() => { exportStatusMsg.style.display = 'none'; }, 3000);
                return;
            }
        }

        if (exportUrl) {
            const a = document.createElement('a');
            a.href = exportUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            exportStatusMsg.textContent = `¡${format.toUpperCase()} exportado como ${filename}!`;
            setTimeout(() => { closeExportModal(); }, 1500);
        } else {
            exportStatusMsg.textContent = 'No hay textura activa para exportar en este formato o hubo un error.';
            setTimeout(() => { exportStatusMsg.style.display = 'none'; }, 3000);
        }
    });
});

sharePatternBtn.addEventListener('click', async () => {
    let shareData = {
        title: 'Patrón de QUBE',
        text: '¡Mira este patrón que generé con QUBE!',
    };
    exportStatusMsg.style.display = 'block';

    // Verifica si hay algo que compartir usando tus variables globales
    if (navigator.share && (currentTexture || currentAiImageSrc)) {
        exportStatusMsg.textContent = 'Preparando para compartir...';
        try {
            let blobToShare;
            let shareFilename = `qube-pattern-${Date.now()}.png`;

            if (activeTextureMode === 'ai' && currentAiImageSrc) {
                if (currentAiImageSrc.startsWith('blob:')) {
                    const response = await fetch(currentAiImageSrc);
                    blobToShare = await response.blob();
                    if (blobToShare.type === 'image/jpeg') shareFilename = `qube-pattern-${Date.now()}.jpg`;
                } else {
                    shareData.url = currentAiImageSrc;
                }
            } else if (activeTextureMode === 'procedural' && currentTexture && currentTexture.image instanceof HTMLCanvasElement) {
                blobToShare = await new Promise(resolve => currentTexture.image.toBlob(resolve, 'image/png'));
            }

            if (blobToShare) {
                 const file = new File([blobToShare], shareFilename, { type: blobToShare.type });
                 if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({ ...shareData, files: [file] });
                    exportStatusMsg.textContent = '¡Patrón compartido!';
                 } else {
                    exportStatusMsg.textContent = 'Tu navegador no soporta compartir archivos de esta manera.';
                 }
            } else if (shareData.url) {
                await navigator.share(shareData);
                exportStatusMsg.textContent = '¡Enlace al patrón compartido!';
            } else {
                 exportStatusMsg.textContent = 'No se pudo preparar el patrón para compartir.';
            }
            setTimeout(() => { closeExportModal(); }, 2000);
        } catch (err) {
            console.error('Error al compartir:', err);
            exportStatusMsg.textContent = `Error al compartir: ${err.message}`;
            setTimeout(() => { exportStatusMsg.style.display = 'none'; }, 3000);
        }
    } else {
        exportStatusMsg.textContent = 'Tu navegador no soporta la función de compartir, o no hay nada que compartir.';
        if(promptInput.value && navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(promptInput.value);
                exportStatusMsg.textContent += ' (Prompt copiado al portapapeles)';
            } catch (clipErr) {
                console.error('Error al copiar prompt:', clipErr);
            }
        }
        setTimeout(() => { exportStatusMsg.style.display = 'none'; }, 4000);
    }
});
// --- FIN: Lógica del Modal de Exportación ---


document.addEventListener('DOMContentLoaded', () => {
    resize(); // Llama a resize una vez al cargar el DOM
    switchToProceduralTexture();
    animate();
});