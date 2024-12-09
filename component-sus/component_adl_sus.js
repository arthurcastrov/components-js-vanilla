class SusComponent extends HTMLElement {
  constructor(id, name, storage, questions, theme, position, thanks, questionsPerPage = 1) {
    super();

    this.id = id;
    this.name = name;
    this.storage = storage;
    this.questions = questions;
    this.theme = theme;
    this.position = position;
    this.thanks = thanks;
    this.questionsPerPage = questionsPerPage;
    this.currentIndex = 0;

    // Attach shadow root
    this.attachShadow({ mode: 'open' });

    // Render survey content
    this.render();

  }

  render() {
    const styles = `
      <style>
        .survey {
          background-color: ${this.theme.bgColor || '#f9f9f9'};
          color: ${this.theme.textColor || '#333'};
          font-family: ${this.theme.font || 'Arial, sans-serif'};
          padding: 20px;
          border-radius: 5px;
        }
        .survey button {
          background-color: ${this.theme.buttonColor || '#007bff'};
          color: white;
          border: none;
          padding: 10px;
          border-radius: 3px;
          cursor: pointer;
        }
      </style>
      `;

      const start = this.currentIndex;
      const end = start + this.questionsPerPage;
      const questionsPage = this.questions.slice(start, end);
      
      let questionsHTML = questionsPage.map((question, index) => {
        return this.renderQuestion(question, index + start);
      }).join('');

      const buttonText = end >= this.questions.length ? 'Send Response' : 'Continue';

      const html = `
        <div class="survey">
          <h2>${this.name}</h2>
          ${questionsHTML}
          <button id="action-btn">${buttonText}</button>
        </div>
      `;
      this.shadowRoot.innerHTML = styles + html;
      this.shadowRoot.getElementById('action-btn').addEventListener('click', () => {
        this.currentIndex += this.questionsPerPage;
        if (this.currentIndex >= this.questions.length) {
          this.sendResponse();
        } else {
          this.render();
        }
      });
  }

  renderQuestion(question, index) {
    switch (question.type) {
      case 'text':
        return `
          <div>
            <p>${question.text}</p>
            <input type="text" id="question-${index}">
          </div>
        `;
      case 'scale':
        // Escala del 1 al 10, por ejemplo
        return `
          <div>
            <p>${question.text}</p>
            ${[...Array(10)].map((_, i) => `
              <label>
                <input type="radio" name="question-${index}" value="${i + 1}">${i + 1}
              </label>
            `).join('')}
          </div>
        `;
      case 'emoji':
        // Ejemplo de caritas con emojis
        return `
          <div>
            <p>${question.text}</p>
            ${['😞', '😐', '😊'].map((emoji, i) => `
              <label>
                <input type="radio" name="question-${index}" value="${i + 1}">${emoji}
              </label>
            `).join('')}
          </div>
        `;
      default:
        return ''; // Para tipos no reconocidos
    }
  }
  
  showThanks() {
    this.shadowRoot.innerHTML = `
      <div class="survey">
        <h2>${this.thanks}</h2>
        <button id="close-btn">Close</button>
      </div>
    `;
    this.shadowRoot.getElementById('close-btn').addEventListener('click', () => {
      this.remove(); // Remueve el componente de la página, si es deseado
    });
  }
}
  
customElements.define('sus-component', SusComponent);
