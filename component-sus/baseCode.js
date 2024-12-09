class EncuestaSatisfaccion extends HTMLElement {
  constructor(id, nombre, storage, preguntas, tema, posicion, thanks, preguntasPorPantalla = 1) {
    super();

    this.id = id;
    this.nombre = nombre;
    this.storage = storage;
    this.preguntas = preguntas;
    this.tema = tema;
    this.posicion = posicion;
    this.thanks = thanks;
    this.preguntasPorPantalla = preguntasPorPantalla;
    this.indicePreguntaActual = 0;

    // Adjuntar shadow root
    this.attachShadow({ mode: 'open' });

    // Renderizar el contenido de la encuesta
    this.render();
  }

  render() {
    const estilos = `
      <style>
        .encuesta {
          background-color: ${this.tema.bgColor || '#f9f9f9'};
          color: ${this.tema.textColor || '#333'};
          font-family: ${this.tema.font || 'Arial, sans-serif'};
          padding: 20px;
          border-radius: 5px;
        }
        .encuesta button {
          background-color: ${this.tema.buttonColor || '#007bff'};
          color: white;
          border: none;
          padding: 10px;
          border-radius: 3px;
          cursor: pointer;
        }
      </style>
    `;

    // Calcular el grupo de preguntas que se deben mostrar
    const inicio = this.indicePreguntaActual;
    const fin = inicio + this.preguntasPorPantalla;
    const preguntasPagina = this.preguntas.slice(inicio, fin);

    let preguntasHTML = preguntasPagina.map((pregunta, index) => {
      return this.renderPregunta(pregunta, index + inicio);
    }).join('');

    // Determinar el texto del botón (Continuar o Enviar Respuesta)
    const textoBoton = fin >= this.preguntas.length ? 'Enviar Respuesta' : 'Continuar';

    const html = `
      <div class="encuesta">
        <h2>${this.nombre}</h2>
        ${preguntasHTML}
        <button id="accion-btn">${textoBoton}</button>
      </div>
    `;

    this.shadowRoot.innerHTML = `${estilos}${html}`;
    this.shadowRoot.querySelector('#accion-btn').addEventListener('click', this.handleAction.bind(this));
  }



  renderPregunta(pregunta, index) {
    switch (pregunta.tipo) {
      case 'caritas':
        return `
          <div class="pregunta">
            <p>${pregunta.texto}</p>
            <div class="caritas">
              ${['😡', '😕', '😐', '😊', '😍']
                .map(
                  (emoji, idx) => `
                <span data-value="${idx + 1}">${emoji}</span>`
                )
                .join('')}
            </div>
          </div>
        `;
      case 'calificacion':
        return `
          <div class="pregunta">
            <p>${pregunta.texto}</p>
            <input type="range" min="1" max="10" step="1" value="5" />
          </div>
        `;
      case 'abierta':
        return `
          <div class="pregunta">
            <p>${pregunta.texto}</p>
            <textarea rows="4" cols="50"></textarea>
          </div>
        `;
      case 'multiple':
        return `
          <div class="pregunta">
            <p>${pregunta.texto}</p>
            ${pregunta.opciones
              .map(
                (opcion) => `
              <label>
                <input type="radio" name="pregunta-${index}" value="${opcion}">
                ${opcion}
              </label>`
              )
              .join('')}
          </div>
        `;
      default:
        return '';
    }
  }

  handleAction() {
    const siguienteInicio = this.indicePreguntaActual + this.preguntasPorPantalla;
    
    // Si se han mostrado todas las preguntas, enviar respuestas
    if (siguienteInicio >= this.preguntas.length) {
      this.enviarRespuestas();
    } else {
      // Avanzar al siguiente grupo de preguntas
      this.indicePreguntaActual = siguienteInicio;
      this.render(); // Renderizar el siguiente grupo de preguntas
    }
  }

  enviarRespuestas() {
    console.log("Enviando respuestas...");
    // Aquí agregarías el código para almacenar o procesar las respuestas
    this.shadowRoot.innerHTML = `<p>${this.thanks}</p>`;
  }


  // Método para manejar el envío de la encuesta
  handleSubmit() {
    const respuestas = [];

    // Recorrer y capturar las respuestas de cada tipo de pregunta
    this.preguntas.forEach((pregunta, index) => {
      const preguntaDOM = this.shadowRoot.querySelector(
        `.pregunta:nth-of-type(${index + 1})`
      );
      let respuesta;

      if (pregunta.tipo === 'caritas') {
        respuesta = preguntaDOM.querySelector('span.selected')?.dataset.value;
      } else if (pregunta.tipo === 'calificacion') {
        respuesta = preguntaDOM.querySelector('input[type="range"]').value;
      } else if (pregunta.tipo === 'abierta') {
        respuesta = preguntaDOM.querySelector('textarea').value;
      } else if (pregunta.tipo === 'multiple') {
        respuesta = preguntaDOM.querySelector(
          'input[type="radio"]:checked'
        )?.value;
      }

      respuestas.push({ pregunta: pregunta.texto, respuesta });
    });

    // Almacenar respuestas según el método definido (localStorage o cookie)
    this.saveRespuestas(respuestas);

    // Mostrar mensaje de agradecimiento
    this.mostrarAgradecimiento();
  }

  // Guardar las respuestas en localStorage o cookies
  saveRespuestas(respuestas) {
    if (this.storage === 'localStorage') {
      localStorage.setItem(this.id, JSON.stringify(respuestas));
    } else {
      document.cookie = `${this.id}=${JSON.stringify(respuestas)}; path=/;`;
    }
  }

  // Mostrar la pantalla de agradecimiento
  mostrarAgradecimiento() {
    this.shadowRoot.innerHTML = `
      <div class="encuesta">
        <p>${this.thanks || '¡Gracias por tu participación!'}</p>
      </div>
    `;
  }
}

// Registrar el componente personalizado
customElements.define('encuesta-satisfaccion', EncuestaSatisfaccion);
