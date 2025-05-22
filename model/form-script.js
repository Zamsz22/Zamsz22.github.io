// form-script.js
document.addEventListener('DOMContentLoaded', () => {
    const wizard = document.querySelector('.form-wizard'); // Contenedor de los slides
    const slides = document.querySelectorAll('.form-wizard .slide');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const finishBtn = document.querySelector('.finish-btn');
    const summaryPromptTextarea = document.getElementById('summary-prompt');
    const usePromptBtn = document.getElementById('use-prompt-btn');

    let currentSlideIndex = 0;
    const answers = {};

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    function showSlide(newIndex) {
        const oldIndex = currentSlideIndex;
        if (newIndex === oldIndex) return; // No hacer nada si es el mismo slide

        const currentActiveSlide = slides[oldIndex];
        const nextActiveSlide = slides[newIndex];

        // Determinar dirección
        const direction = newIndex > oldIndex ? 'next' : 'prev';

        // Salida del slide actual
        if (currentActiveSlide) {
            currentActiveSlide.classList.remove('active');
            if (direction === 'next') {
                currentActiveSlide.classList.add('exit-left');
            } else {
                currentActiveSlide.classList.add('exit-right');
            }
            // Quitar la clase de salida después de la animación para poder reutilizarla
            // Es importante que la duración de este timeout sea igual o mayor que la de la transición CSS
            setTimeout(() => {
                currentActiveSlide.classList.remove('exit-left', 'exit-right');
            }, 500); // 500ms es la duración de la transición en el CSS
        }
        
        // Entrada del nuevo slide
        if (nextActiveSlide) {
            // Preparamos el slide para entrar desde la dirección opuesta a la salida del anterior
            // Esto es más para una animación de empuje, pero con superposición,
            // solo necesitamos asegurar que se quite cualquier clase de salida.
            nextActiveSlide.classList.remove('exit-left', 'exit-right');

            // Lo hacemos activo. La transición CSS se encargará de animar translateX(0) y opacity:1
            nextActiveSlide.classList.add('active');
        }
        
        currentSlideIndex = newIndex;

        // Ajustar la altura del wizard al nuevo slide activo (si la altura es variable)
        // Esto es más relevante si los slides tienen alturas muy diferentes y .form-wizard tiene height: auto
        if (wizard && nextActiveSlide) {
            // wizard.style.height = nextActiveSlide.offsetHeight + 'px'; // Descomentar si es necesario
        }
    }
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTextarea = slides[currentSlideIndex].querySelector('textarea');
            if (currentTextarea) {
                answers[`q${currentSlideIndex + 1}`] = currentTextarea.value.trim();
                 // Opcional: Validación simple
                // if (!answers[`q${currentSlideIndex + 1}`]) {
                //     alert("Por favor, completa este campo antes de continuar.");
                //     currentTextarea.focus();
                //     return;
                // }
            }
            // El último slide es el de resumen (índice slides.length - 1)
            // Así que el último slide con preguntas es slides.length - 2
            if (currentSlideIndex < slides.length - 2) { 
                showSlide(currentSlideIndex + 1);
            } else {
                // Esto no debería pasar si el botón es finishBtn, pero por si acaso
                console.warn("Se intentó ir 'siguiente' desde el último slide de preguntas.");
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentSlideIndex > 0) {
                // Opcional: Si quieres guardar la respuesta del slide actual incluso al ir para atrás
                // const currentTextarea = slides[currentSlideIndex].querySelector('textarea');
                // if (currentTextarea) {
                //     answers[`q${currentSlideIndex + 1}`] = currentTextarea.value.trim();
                // }
                showSlide(currentSlideIndex - 1);
            }
        });
    });

    finishBtn.addEventListener('click', () => {
        const currentTextarea = slides[currentSlideIndex].querySelector('textarea');
        if (currentTextarea) {
            answers[`q${currentSlideIndex + 1}`] = currentTextarea.value.trim();
            // Opcional: Validación
            // if (!answers[`q${currentSlideIndex + 1}`]) {
            //     alert("Por favor, completa este campo para finalizar.");
            //     currentTextarea.focus();
            //     return;
            // }
        }
        
        let constructedPrompt = "";
        // Usar un orden definido para las preguntas si es importante
        const questionOrder = ['q1', 'q2', 'q3', 'q4', 'q5']; 
        questionOrder.forEach((key, index) => {
            if (answers[key]) {
                // Frases conectoras más naturales
                switch(key) {
                    case 'q1': constructedPrompt += `La textura se aplicará en ${answers[key]}. `; break;
                    case 'q2': constructedPrompt += `El estilo principal es ${answers[key]}. `; break;
                    case 'q3': constructedPrompt += `Los colores predominantes son ${answers[key]}. `; break;
                    case 'q4': constructedPrompt += `Debe incluir elementos como ${answers[key]}. `; break;
                    case 'q5': constructedPrompt += `Además, ${answers[key]}. `; break;
                }
            }
        });
        
        if (!constructedPrompt.toLowerCase().includes("tileable") && !constructedPrompt.toLowerCase().includes("seamless")) {
            constructedPrompt =  constructedPrompt;
        }

        summaryPromptTextarea.value = constructedPrompt.trim();
        showSlide(slides.length - 1); // Mostrar el slide de resumen
    });

    usePromptBtn.addEventListener('click', () => {
        const finalPrompt = summaryPromptTextarea.value;
        if (finalPrompt) {
            localStorage.setItem('wizardPrompt', finalPrompt);
            window.location.href = 'texture.html';
        } else {
            alert('No hay prompt para usar.');
        }
    });

    // Mostrar el primer slide al cargar
    if (slides.length > 0) {
        slides[0].classList.add('active'); // El primer slide es activo por defecto
    }
    // showSlide(0); // Esto también funcionaría pero es menos explícito para el estado inicial
});