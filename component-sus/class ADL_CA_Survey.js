window.ADLSurveyConcejero = class {
  constructor(options) {
    this.options = {
      name: 'adl-survey',
      title: 'TITULO DE LA ENCUESTA',
      storage: 'local',
      expiryDays: 30,
      theme: 'popup',
      zIndex: 9999,
      injectionTarget: 'body',
      resolveTarget: null,
      questionsPerPage: 1,
      color: {
        background: '#FFF',
        text: '#000',
        button: '#CCC',
        buttonText: '#000',
        buttonActive: '#007BFF',
        buttonActiveText: '#FFF',
      },
      questions: [],
      thanks: '¡Gracias por participar!',
      ...options,
    };

    this.currentPage = 0;
    this.totalPages = Math.ceil(
      this.options.questions.length / this.options.questionsPerPage
    );

    this.storage = new ADLStorage(this.options.name)[this.options.storage]();
  }

  show() {
    let target;

    if (typeof this.options.resolveTarget === 'function') {
      target = this.options.resolveTarget();
    } else {
      target =
        document.querySelector(this.options.injectionTarget) || document.body;
    }

    if (!target) {
      console.error(
        'ADLSurvey: No se pudo encontrar el contenedor de destino.'
      );
      return;
    }

    if (target.querySelector(`#${this.options.name}`)) {
      console.warn(
        'ADLSurvey: Ya existe una encuesta activa en el contenedor de destino.'
      );
      return;
    }

    const container = document.createElement('div');
    container.id = `${this.options.name}`;
    const shadowRoot = container.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      ${this.renderStyles()}
      ${this.renderHTML()}
    `;

    target.appendChild(container);
    this.bindEvents(shadowRoot);
  }

  renderStyles() {
    return `
      <style>
        :host {
          display: flex;
          width: 100%;
          height: calc(100%\u0020-\u002042px);
        }
        .adlsurvey {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          height: 100%;
          background-color: ${this.options.color.background};
          color: ${this.options.color.text};
          font-family: Arial, sans-serif;
          border-radius: 8px;
          padding: 20px;
          position: relative;
          z-index: ${this.options.zIndex};
        }

        .adlsurvey-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .adlsurvey-close {
          font-size: 32px;
          border: none;
          background: transparent;
        }

        .adlsurvey-body {
          margin-bottom: 20px;
        }

        .adlsurvey-question {
          margin-bottom: 15px;
        }
        
        .adlsurvey-label {
          display: flex;
          justify-content: space-between;
          font-size: small;
          font-weight: normal;
        }

        .adlsurvey-stars-wrapper {
          display: flex;
          justify-content: space-between;
          gap: 5px;
        }

        .adlsurvey-star-option span {
          font-size: 48px;
          color: #FFF;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .adlsurvey-stars-wrapper input[type="radio"] {
          opacity: 0;
          position: absolute;
          pointer-events: none;
        }
        
        .adlsurvey-stars-wrapper .adlsurvey-star-option {
          cursor: pointer;
          font-size: 24px;
          color: #ccc;
          transition: color 0.2s ease;
        }

        .adlsurvey-stars-wrapper input[type="radio"]:checked + label span,
        .adlsurvey-stars-wrapper .adlsurvey-star-option:hover span {
          color: #FECE49;
        }

        .adlsurvey-text {
          width: 100%
        }


        .adlsurvey-footer {
          display: flex;
          justify-content: space-between;
        }

        .adlsurvey-btn {
          background-color: ${this.options.color.button};
          color: ${this.options.color.buttonText};
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s, color 0.3s;
          
        }

        .adlsurvey-btn:hover {
          background-color: ${this.options.color.buttonActive};
          color: ${this.options.color.buttonActiveText};
        }
        
        .adlsurvey-btn:disabled {
          cursor: not-allowed;
          opacity: 0.3; 
        }
        .adlsurvey-thanks {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .adlsurvey-thanks svg {
          fill: ${this.options.color.buttonActive};
        }
        .adlsurvey-thanks h2 {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
        }

      </style>
    `;
  }

  renderHTML() {
    const questionsHTML = this.options.questions
      .map((q, idx) => this.renderQuestion(q, idx))
      .join('');

    return `
      <div class="adlsurvey">
        <div class="adlsurvey-header">
          <h4>${this.options.title}</h4>
          <button class="adlsurvey-close">×</button>
        </div>
        <div class="adlsurvey-body js-adlsurvey-body">
          ${questionsHTML}
        </div>
        <div class="adlsurvey-footer">
          <button class="adlsurvey-btn js-adlsurvey-prev" hidden>Anterior</button>
          <button class="adlsurvey-btn js-adlsurvey-next">
            ${this.currentPage < this.totalPages - 1 ? 'Siguiente' : 'Enviar'}
          </button>
        </div>
      </div>
    `;
  }

  renderQuestion(question, index) {
    const components = {
      stars: (q, idx) => {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
          starsHTML += `
            <input type="radio" name="${this.options.name}-q${idx}" 
              id="${this.options.name}-q${idx}-${i}" 
              value="${i}">
            <label for="${this.options.name}-q${idx}-${i}" class="adlsurvey-star-option">
              <span data-value="${i}">★</span>
            </label>`;
        }
        return `
          <div class="adlsurvey-stars data-index="${idx} data-index="${idx}">
            <div class="adlsurvey-stars-wrapper">${starsHTML}</div>
            <label class="adlsurvey-label">
              <span>${q.highScoreLabel}</span>
              <span>${q.lowScoreLabel}</span>
            </label>
          </div>
        `;
      },
      text: (q, idx) => `
        <textarea class="adlsurvey-text" name="${this.options.name}-q${idx}" rows="4"></textarea>
      `,
    };

    return `
      <div class="adlsurvey-question js-adlsurvey-question" 
           data-index="${index}"
           data-type="${question.type}"
           data-required="${question.required}" 
           data-answered="false"
           style="${
             index < this.options.questionsPerPage ? '' : 'display: none'
           }">
        <p>${question.text}</p>
        ${components[question.type]?.(question, index) || ''}
      </div>
    `;
  }

  bindEvents(shadowRoot) {
    const closeBtn = shadowRoot.querySelector('button.adlsurvey-close');
    const nextBtn = shadowRoot.querySelector('.js-adlsurvey-next');
    const prevBtn = shadowRoot.querySelector('.js-adlsurvey-prev');

    closeBtn.addEventListener('click', () => this.close(shadowRoot, 'skip'));
    nextBtn.addEventListener('click', () => this.nextPage(shadowRoot));
    prevBtn.addEventListener('click', () => this.prevPage(shadowRoot));

    this.initializeQuestions(shadowRoot);
    this.updateButtonState(shadowRoot, 'bindEvents');
  }

  close(shadowRoot, type) {
    const container = shadowRoot.host;
    let exp = type === 'skip' ? '7d' : '30d';
    utag.link({
      tealium_event: 'click',
      event_category: 'concejero aval',
      label: type,
    });
    if (container) container.remove();
    utag.loader.SC('utag_survey_ca', {
      showComponent: `false;exp-${exp}`,
    });
  }

  initializeQuestions(shadowRoot) {
    const questions = shadowRoot.querySelectorAll('.js-adlsurvey-question');

    questions.forEach((question) => {
      const type = question.dataset.type;

      if (type === 'text') {
        this.initializeTextQuestion(question, shadowRoot);
      } else if (type === 'stars') {
        this.initializeStarsQuestion(question, shadowRoot);
      }
    });
  }

  initializeTextQuestion(question, shadowRoot) {
    const textarea = question.querySelector('textarea');
    if (!textarea) return;

    textarea.addEventListener('input', (e) => {
      question.dataset.answered =
        e.target.value.trim() !== '' ? 'true' : 'false';
      this.updateButtonState(shadowRoot, 'initializeTextQuestion');
    });
  }

  initializeStarsQuestion(question, shadowRoot) {
    const wrapper = question.querySelector('.adlsurvey-stars-wrapper');
    if (!wrapper) return;

    wrapper.addEventListener('click', (e) => {
      const span = e.target.closest('span[data-value]');
      if (!span) return;

      const value = parseInt(span.dataset.value, 10);
      wrapper.querySelectorAll('span').forEach((star) => {
        const starValue = parseInt(star.dataset.value, 10);
        star.style.color = starValue <= value ? '#FECE49' : '#FFF';
      });

      question.dataset.answered = 'true';
      this.updateButtonState(shadowRoot, 'initializeStarsQuestion');
    });
  }

  updateButtonState(shadowRoot, source) {
    const currentQuestions = Array.from(
      shadowRoot.querySelectorAll('.js-adlsurvey-question')
    ).filter(
      (q, idx) =>
        idx >= this.currentPage * this.options.questionsPerPage &&
        idx < (this.currentPage + 1) * this.options.questionsPerPage
    );

    const allAnswered = currentQuestions.every((q) => {
      const isRequired = q.dataset.required === 'true';
      if (!isRequired) return true;

      const isAnswered = q.dataset.answered === 'true';
      return isAnswered;
    });

    const nextBtn = shadowRoot.querySelector('.js-adlsurvey-next');
    nextBtn.disabled = !allAnswered;
  }

  nextPage(shadowRoot) {
    if (this.currentPage < this.totalPages - 1) {
      this.saveResponsesToCookie(shadowRoot);
      this.currentPage++;
      this.updatePage(shadowRoot);
      this.updateButtonState(shadowRoot, 'nextPage');
    } else {
      this.saveResponsesToCookie(shadowRoot);
      this.showThankYouPage(shadowRoot);
    }
  }

  prevPage(shadowRoot) {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePage(shadowRoot);
    }
  }

  updatePage(shadowRoot) {
    const questions = shadowRoot.querySelectorAll('.js-adlsurvey-question');
    questions.forEach((q, idx) => {
      q.style.display =
        idx >= this.currentPage * this.options.questionsPerPage &&
        idx < (this.currentPage + 1) * this.options.questionsPerPage
          ? ''
          : 'none';
    });

    const nextBtn = shadowRoot.querySelector('.js-adlsurvey-next');
    const prevBtn = shadowRoot.querySelector('.js-adlsurvey-prev');
    nextBtn.textContent =
      this.currentPage < this.totalPages - 1 ? 'Siguiente' : 'Enviar';
    prevBtn.hidden = this.currentPage === 0;
  }

  showThankYouPage(shadowRoot) {
    const surveyHeader = shadowRoot.querySelector('.adlsurvey-header');
    const surveyFooter = shadowRoot.querySelector('.adlsurvey-footer');
    surveyHeader.style.display = 'none';
    surveyFooter.style.display = 'none';

    const surveyBody = shadowRoot.querySelector('.adlsurvey-body');
    const thanksPageHTML = `
        <div class="adlsurvey-thanks">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px";
"><path d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 20.44 46.660281 16.189328 44.363281 12.611328 L 42.994141 14.228516 C 44.889141 17.382516 46 21.06 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 C 30.443 4 35.393906 6.0997656 39.128906 9.5097656 L 40.4375 7.9648438 C 36.3525 4.2598437 30.935 2 25 2 z M 43.236328 7.7539062 L 23.914062 30.554688 L 15.78125 22.96875 L 14.417969 24.431641 L 24.083984 33.447266 L 44.763672 9.046875 L 43.236328 7.7539062 z"></path></svg>
            <h2>${this.options.thanks}</h3>
            <h4>${this.options.feedback}</h4>
            <button class="adlsurvey-btn js-adlsurvey-finish">Finalizar</button>
        </div>
    `;
    surveyBody.innerHTML = thanksPageHTML;

    const finishBtn = shadowRoot.querySelector('.js-adlsurvey-finish');
    finishBtn.addEventListener('click', () => {
      this.submitSurvey();
      this.close(shadowRoot, 'finished');
    });
  }

  saveResponsesToCookie(shadowRoot) {
    // Seleccionar las preguntas visibles en la página actual
    const currentQuestions = Array.from(
        shadowRoot.querySelectorAll('.js-adlsurvey-question')
    ).filter((q, idx) =>
        idx >= this.currentPage * this.options.questionsPerPage &&
        idx < (this.currentPage + 1) * this.options.questionsPerPage
    );

    const responses = {};
    currentQuestions.forEach(question => {
        const questionIndex = question.dataset.index;
        const type = question.dataset.type;

        if (type === 'text') {
            const textarea = question.querySelector('textarea');
            responses[questionIndex] = textarea ? textarea.value.trim() : null;
        } else if (type === 'stars') {
            const selectedStar = question.querySelector('input[type="radio"]:checked');
            responses[questionIndex] = selectedStar ? selectedStar.value : null;
        }
    });

    // Leer las respuestas existentes de la cookie y actualizarlas
    const existingResponses = this.getSurveyResponsesCookie();
    const updatedResponses = { ...existingResponses, ...responses };

    // Guardar las respuestas actualizadas en la cookie
    this.setSurveyResponsesCookie(updatedResponses);
}


  submitSurvey() {
    utag.link({
      tealium_event: 'send_survey',
      event_name: this.options.name,
      id_sus: b.tealium_random,
      data: [],
    });
  }
};
