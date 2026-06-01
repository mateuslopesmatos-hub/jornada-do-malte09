document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. MENU RESPONSIVO & EXPLORAR ---
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const btnExplore = document.getElementById("btn-explore");

    menuToggle.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", !expanded);
        mainNav.classList.toggle("open");
    });

    if (btnExplore) {
        btnExplore.addEventListener("click", () => {
            document.getElementById("jornada").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Fechar menu mobile pressionando ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mainNav.classList.contains("open")) {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });


    // --- 2. ACESSIBILIDADE (FONTE E CONTRASTE) ---
    let currentFontSize = 16;
    const rootHtml = document.documentElement;

    document.getElementById("btn-increase").addEventListener("click", () => {
        if (currentFontSize < 22) {
            currentFontSize += 1;
            rootHtml.style.setProperty("--font-base", `${currentFontSize}px`);
        }
    });

    document.getElementById("btn-decrease").addEventListener("click", () => {
        if (currentFontSize > 12) {
            currentFontSize -= 1;
            rootHtml.style.setProperty("--font-base", `${currentFontSize}px`);
        }
    });

    const btnContrast = document.getElementById("btn-contrast");
    btnContrast.addEventListener("click", () => {
        document.body.classList.toggle("high-contrast");
        
        // Comunicação de estado para o iframe da HQ se necessário
        const hqIframe = document.getElementById("hq-iframe");
        if (hqIframe && hqIframe.contentWindow) {
            hqIframe.contentWindow.postMessage(
                { type: "toggleContrast", active: document.body.classList.contains("high-contrast") }, 
                "*"
            );
        }
    });


    // --- 3. CURIOSIDADES ALEATÓRIAS ---
    const curiosities = [
        "Guarapuava e região compõem um dos maiores polos produtores de cevada e malte da América Latina.",
        "O sistema de Plantio Direto na cevada protege o solo contra erosões e retém carbono, ajudando o meio ambiente.",
        "A malteação imita o processo natural de germinação do grão, mas controlado perfeitamente por tecnologia industrial.",
        "A tecnologia de precisão com drones reduz em até 30% o uso de defensivos desnecessários nas lavouras de cevada.",
        "Subprodutos da produção de malte são frequentemente reutilizados para a alimentação nutritiva do gado local."
    ];

    const btnCuriosity = document.getElementById("btn-curiosity");
    const curiosityText = document.getElementById("curiosity-text");

    btnCuriosity.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * curiosities.length);
        curiosityText.textContent = curiosities[randomIndex];
    });


    // --- 4. CARROSSEL DE IMAGENS ---
    const slides = document.querySelectorAll(".carousel-slide");
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {
        slides[currentSlide].classList.remove("active");
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
    }

    document.querySelector(".carousel-next").addEventListener("click", () => showSlide(currentSlide + 1));
    document.querySelector(".carousel-prev").addEventListener("click", () => showSlide(currentSlide - 1));

    function startAutoplay() {
        carouselInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    }
    function stopAutoplay() { clearInterval(carouselInterval); }

    startAutoplay();
    const carouselElement = document.querySelector(".carousel");
    carouselElement.addEventListener("mouseenter", stopAutoplay);
    carouselElement.addEventListener("mouseleave", startAutoplay);


    // --- 5. CARDS EXPANSÍVEIS (ACCORDION) ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute("aria-expanded") === "true";
            
            header.setAttribute("aria-expanded", !isExpanded);
            const icon = header.querySelector(".icon");

            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = "-";
            } else {
                content.style.maxHeight = "0";
                icon.textContent = "+";
            }
        });
    });


    // --- 6. QUIZ INTERATIVO ---
    const quizData = [
        {
            question: "Qual é o tema central do Concurso Agrinho 2026?",
            options: [
                "Produção em massa sem limites.",
                "Agro forte, futuro sustentável: equilíbrio entre produção e meio ambiente.",
                "A história antiga da agricultura urbana.",
                "Uso exclusivo de ferramentas manuais no campo."
            ],
            correct: 1
        },
        {
            question: "Onde se inicia a jornada da transformação do malte apresentada no site?",
            options: [
                "Na grande cidade comercial.",
                "Diretamente nos supermercados.",
                "Nas lavouras de cevada em Guarapuava.",
                "Em laboratórios de química industrial."
            ],
            correct: 2
        },
        {
            question: "Qual destas é uma prática sustentável aplicada no campo?",
            options: [
                "Queima completa da palhada protetora.",
                "Uso excessivo e sem controle de água na irrigação.",
                "Manejo responsável do solo e monitoramento por drones.",
                "Monocultura contínua sem rotação de solo."
            ],
            correct: 2
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const questionNumberEl = document.getElementById("question-number");
    const questionTextEl = document.getElementById("question-text");
    const quizOptionsEl = document.getElementById("quiz-options");
    const quizWindowEl = document.getElementById("quiz-window");
    const quizResultEl = document.getElementById("quiz-result");
    const resultTextEl = document.getElementById("result-text");
    const btnRestartQuiz = document.getElementById("btn-restart-quiz");

    function loadQuestion() {
        const currentQuiz = quizData[currentQuestionIndex];
        questionNumberEl.textContent = `Pergunta ${currentQuestionIndex + 1} de ${quizData.length}`;
        questionTextEl.textContent = currentQuiz.question;
        quizOptionsEl.innerHTML = "";

        currentQuiz.options.forEach((option, idx) => {
            const button = document.createElement("button");
            button.classList.add("quiz-btn");
            button.textContent = option;
            button.addEventListener("click", () => checkAnswer(idx));
            quizOptionsEl.appendChild(button);
        });
    }

    function checkAnswer(selectedIdx) {
        if (selectedIdx === quizData[currentQuestionIndex].correct) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        quizWindowEl.classList.add("hidden");
        quizResultEl.classList.remove("hidden");
        
        let feedback = "";
        if (score === quizData.length) feedback = "Excelente! Você conhece tudo sobre o agro sustentável! 🌾";
        else if (score >= 1) feedback = "Muito bem! Você pegou os conceitos principais. 🌱";
        else feedback = "Que tal ler as seções do site novamente para aprender mais? 📚";

        resultTextEl.innerHTML = `Você acertou <strong>${score}</strong> de <strong>${quizData.length}</strong> perguntas.<br><br>${feedback}`;
    }

    btnRestartQuiz.addEventListener("click", () => {
        score = 0;
        currentQuestionIndex = 0;
        quizResultEl.classList.add("hidden");
        quizWindowEl.classList.remove("hidden");
        loadQuestion();
    });

    // Inicializa a primeira questão do quiz
    loadQuestion();
});
