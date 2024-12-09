class ADLSurvey {
  constructor(options) {
    this.options = {
      name: 'adl-survey',
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
        buttonActive: '#007BFF',
        buttonActiveText: '#FFF',
      },
      questions: [],
      thanks: '¡Gracias por participar!',
      feedback: '',
      ...options,
    };

    this.currentPage = 0;
    this.totalPages = Math.ceil(this.options.questions.length / this.options.questionsPerPage);

    this.storage = new ADLStorage(this.options.name)[this.options.storage]();
  }

  show() {
    let target;

    if (typeof this.options.resolveTarget === 'function') {
      target = this.options.resolveTarget();
    } else {
      target = document.querySelector(this.options.injectionTarget) || document.body;
    }

    if (!target) {
      console.error('ADLSurvey: No se pudo encontrar el contenedor de destino.');
      return;
    }

    if (target.querySelector(`#${this.options.name}`)) {
      console.warn('ADLSurvey: Ya existe una encuesta activa en el contenedor de destino.');
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
          height: calc(100% - 130px);
        }
        .adlsurvey {
          background-color: ${this.options.color.background};
          color: ${this.options.color.text};
          font-family: Arial, sans-serif;
          border-radius: 8px;
          padding: 20px;
          margin: auto;
          position: relative;
          z-index: ${this.options.zIndex};
        }
        .adlsurvey-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .adlsurvey-header button {
          background: none;
          border: none;
          color: ${this.options.color.text};
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
        }

        .adlsurvey-body {
          margin-bottom: 20px;
        }

        .adlsurvey-question {
          margin-bottom: 15px;
        }

        .adlsurvey-stars-wrapper {
          display: flex;
          justify-content: space-between;
          gap: 5px;
        }

        .adlsurvey-star-option span {
          font-size: 24px;
          color: #ddd;
          cursor: pointer;
          transition: color 0.2s;
        }

        .adlsurvey-star-option input:checked ~ label span,
        .adlsurvey-star-option:hover span {
          color: #FFD700;
        }

        .adlsurvey-footer {
          display: flex;
          justify-content: flex-end;
        }

        .adlsurvey-btn {
          background-color: ${this.options.color.button};
          color: ${this.options.color.text};
          border: none;
          padding: 10px 20px;
          cursor: not-allowed;
          border-radius: 5px;
          transition: background-color 0.3s, color 0.3s;
        }

        .adlsurvey-btn.active {
          cursor: pointer;
          background-color: ${this.options.color.buttonActive};
          color: ${this.options.color.buttonActiveText};
        }

        .adlsurvey-thanks {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          margin: auto;
        }

        .adlsurvey-thanks button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: ${this.options.color.button};
          color: ${this.options.color.text};
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
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
          <h3>Encuesta</h3>
          <button class="js-adlsurvey-close">&times;</button>
        </div>
        <div class="adlsurvey-body js-adlsurvey-body">
          ${questionsHTML}
        </div>
        <div class="adlsurvey-footer">
          <button class="adlsurvey-btn js-adlsurvey-next" disabled>Siguiente</button>
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
              value="${i}" required>
            <label for="${this.options.name}-q${idx}-${i}" class="adlsurvey-star-option">
              <span>★</span>
            </label>`;
        }
        return `
          <div class="adlsurvey-stars">
            <span>${q.lowScoreLabel}</span>
            <div class="adlsurvey-stars-wrapper">${starsHTML}</div>
            <span>${q.highScoreLabel}</span>
          </div>
        `;
      },
      text: (q, idx) => `
        <textarea name="${this.options.name}-q${idx}" rows="4" required></textarea>
      `,
    };

    return `
      <div class="adlsurvey-question js-adlsurvey-question" 
           data-index="${index}" 
           style="${index < this.options.questionsPerPage ? '' : 'display: none'}">
        <p>${question.text}</p>
        ${components[question.type]?.(question, index) || ''}
      </div>
    `;
  }

  bindEvents(shadowRoot) {
    const closeBtn = shadowRoot.querySelector('.js-adlsurvey-close');
    const nextBtn = shadowRoot.querySelector('.js-adlsurvey-next');
    const questions = shadowRoot.querySelectorAll('.js-adlsurvey-question');

    closeBtn.addEventListener('click', () => shadowRoot.host.remove());

    questions.forEach((q) => {
      q.addEventListener('input', () => this.validatePage(shadowRoot));
    });

    nextBtn.addEventListener('click', () => {
      if (this.currentPage < this.totalPages - 1) {
        this.nextPage(shadowRoot);
      } else {
        this.showThanks(shadowRoot);
      }
    });
  }

  validatePage(shadowRoot) {
    const questions = shadowRoot.querySelectorAll(
      `.js-adlsurvey-question[data-index="${this.currentPage}"] [required]`
    );
    const nextBtn = shadowRoot.querySelector('.js-adlsurvey-next');
    const allAnswered = Array.from(questions).every((q) => q.value.trim() !== '');

    nextBtn.disabled = !allAnswered;
    nextBtn.classList.toggle('active', allAnswered);
  }

  showThanks(shadowRoot) {
    const container = shadowRoot.querySelector('.adlsurvey');
    container.innerHTML = `
      <div class="adlsurvey-thanks">
        <p>${this.options.thanks}</p>
        ${this.options.feedback ? `<div>${this.options.feedback}</div>` : ''}
        <button class="js-adlsurvey-close">Cerrar</button>
      </div>
    `;

    container.querySelector('.js-adlsurvey-close').addEventListener('click', () => shadowRoot.host.remove());
  }
}
