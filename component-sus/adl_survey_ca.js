class ADLSurvey {
  constructor(options) {
    this.options = {
      name: 'adl-survey',
      storage: 'local',
      expiryDays: 30,
      theme: 'popup', // modal or popup
      zIndex: 9999,
      injectionTarget: 'body', // Default container for injection
      questionsPerPage: 1, // Default: one question per page
      color: {
        background: '#FFF',
        text: '#000',
        button: '#CCC',
        buttonActive: '#007BFF',
        buttonActiveText: '#FFF',
      },
      questions: [],
      thanks: '¡Gracias por participar!',
      ...options,
    };

    this.currentPage = 0; // Current page index
    this.totalPages = Math.ceil(this.options.questions.length / this.options.questionsPerPage);

    this.storage = new ADLStorage(this.options.name)[this.options.storage]();
  }

  show() {
    const target = document.querySelector(this.options.injectionTarget) || document.body;
    target.insertAdjacentHTML('beforeend', this.render());
    this.insertStyles();
    this.bindEvents();
  }

  render() {
    const questionsHTML = this.options.questions
      .map((q, idx) => this.renderQuestion(q, idx))
      .join('');

    return `
      <div class="adlsurvey" id="${this.options.name}">
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
              value="${i}" ${i === 3 ? 'checked' : ''}>
            <label for="${this.options.name}-q${idx}-${i}" class="adlsurvey-star-option">
              <span>★</span>
            </label>`;
        }
        return `
          <div class="adlsurvey-stars">
            <span class="adlsurvey-scale-label-full">${q.lowScoreLabel}</span>
            <div class="adlsurvey-stars-wrapper">${starsHTML}</div>
            <span class="adlsurvey-scale-label-full">${q.highScoreLabel}</span>
          </div>
        `;
      },
      text: (q, idx) => `
        <textarea name="${this.options.name}-q${idx}" rows="4"></textarea>
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

  insertStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .adlsurvey {
        background-color: ${this.options.color.background};
        color: ${this.options.color.text};
        font-family: Arial, sans-serif;
        border-radius: 8px;
        padding: 20px;
        max-width: 500px;
        margin: auto;
        position: relative;
        z-index: ${this.options.zIndex};
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
        justify-content: space-between;
      }

      .adlsurvey-btn {
        background-color: ${this.options.color.button};
        color: ${this.options.color.text};
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
    `;
    document.head.appendChild(style); // Inserta estilos en el DOM
  }

  bindEvents() {
    const nextBtn = document.querySelector('.js-adlsurvey-next');
    const prevBtn = document.querySelector('.js-adlsurvey-prev');

    nextBtn.addEventListener('click', () => this.nextPage());
    prevBtn.addEventListener('click', () => this.prevPage());
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePage();
    } else {
      this.submitSurvey();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePage();
    }
  }

  updatePage() {
    const questions = document.querySelectorAll('.js-adlsurvey-question');
    questions.forEach((q, idx) => {
      q.style.display =
        idx >= this.currentPage * this.options.questionsPerPage &&
        idx < (this.currentPage + 1) * this.options.questionsPerPage
          ? ''
          : 'none';
    });

    const nextBtn = document.querySelector('.js-adlsurvey-next');
    const prevBtn = document.querySelector('.js-adlsurvey-prev');
    nextBtn.textContent = this.currentPage < this.totalPages - 1 ? 'Siguiente' : 'Enviar';
    prevBtn.hidden = this.currentPage === 0;
  }

  submitSurvey() {
    alert(this.options.thanks);
    const container = document.querySelector(`#${this.options.name}`);
    if (container) container.remove();
  }
}
