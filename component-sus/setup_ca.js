const config = {
  name: 'adl-survey',
  title: 'CALIFICACIÓN DE EXPERIENCIA',
  storage: 'local',
  expiryDays: 31,
  theme: 'modal',
  zIndex: 9999,
  injectionTarget: 'body',
  resolveTarget: null,/*() => {
    return document
      .querySelector("adl-consejero-aval")
      .shadowRoot.querySelector("idw-web-chat-aval")
      .shadowRoot.querySelector("idw-web-chat")
      .shadowRoot.querySelector("#surveyIDW");
  },*/
  questionsPerPage: 2,
  color: {
    background: '#f5f5f5',
    text: '#000',
    button: '#00B800',
    buttonText: '#fff',
    buttonActive: '#00B800 ',
    buttonActiveText: '#fff',
  },
  questions: [
    {
      text: '¿Cómo calificarias tu satisfacción general con la asesoría financiera de hoy?',
      type: 'stars',
      lowScoreLabel: 'Nada satisfecho',
      highScoreLabel: 'Muy satisfecho',
      required: true,
    },
    {
      text: '¿Qué tan fáciles de entender fueron las respuestas entregadas en la asesoria de hoy?',
      type: 'stars',
      lowScoreLabel: 'Nada fáciles',
      highScoreLabel: 'Muy fáciles',
      required: true,
    },
    {
      text: '¿Qué tan útil consideras fue la asesoría y respuestas entregadas el día de hoy?',
      type: 'stars',
      lowScoreLabel: 'Nada útil',
      highScoreLabel: 'Muy útil',
      required: true,
    },
    {
      text: 'Tienes comentarios adicionales sobre la asesoría de hoy?',
      type: 'text',
      required: false,
    },
  ],
  thanks: 'CALIFICACIÓN ENVIADA',
  feedback: 'Gracias por tus comentarios, estos me ayudaran a seguir mejorando',
};

if (utag.loader.RC('utag_survey_ca').showComponent === undefined) {
  const adlSurveyConcejero = new ADLSurveyConcejero(config);
  adlSurveyConcejero.show();
}
