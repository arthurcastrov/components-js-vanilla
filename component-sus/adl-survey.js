/*!
 * ADL - Survey 3.2.1
 * System Usability Scale (SUS)
 * https://www.adldigitallab.com
 * 
 * @license Copyright 2023, ADL Digital Lab S.A.S. All rights reserved.
 * @author: Andrés Valencia Oliveros
 */
window.ADLSurvey = class {
  /**
   * The options object for the survey.
   *
   * @type {Object}
   *
   * @property {string} id The ID of the survey.
   * @property {string} name The name of the attribute event_name.
   * @property {number} expiryDays The expiry date of the cookie, in days.
   * @property {string} storage The storage type of the survey cookie or localStorage.
   * @property {Array} questions The questions for the survey.
   * @property {number} zIndex The z-index of the widget.
   * @property {string} theme The theme of the widget.
   * @property {string} popupPosition The position of the widget.
   * @property {Object} color The color of the widget buttons.
   * @property {string} thanks The text to show after the survey is completed.
   * @property {string} title The title of the survey in modal.
   *
   * @default
   */
  options = {
    id: String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, ''),
    name: 'adl-survey-v3',
    expiryDays: 360,
    storage: 'local', // cookie or local
    questions: [
      {text: 'Question 1', type: 'ratingScale', lowScoreLabel: 'Very poor', highScoreLabel: 'Excellent', scale: 5, required: true},
      {text: 'Question 2', type: 'text', required: false}
    ],
    zIndex: 9999,
    theme: 'popup', // popup or modal
    popupPosition: 'right', // right, left
    color: {
      background: "#ffffff",
      text: "#000",
      button: "#e0e2e8",
      buttonActive: "#626a84",
      buttonActiveText: "#fff"
    },
    thanks: '¡Gracias por tu tiempo!',
    title: 'Tu opinión es muy importante',
    feedback: 'Sugerencias'
  };

  /**
   * An array of answers to the survey.
   *
   * @type {Array}
   */
  answers = [];

  css = {
    _reset: "<!-- ADL Survey - Reset Styles --> \
      <style id=\"style-adlsurvey-reset\"> \
        .adlsurvey-reset-styles *,.adlsurvey-reset-styles *::before,.adlsurvey-reset-styles *::after{box-sizing:border-box;} \
        .adlsurvey-reset-styles *{-webkit-text-size-adjust:100%;font-family:Arial,sans-serif,Tahoma;font-size:16px;font-weight:400;letter-spacing:normal;line-height:1.5;margin:0;text-transform:initial;} \
        .adlsurvey-reset-styles input,.adlsurvey-reset-styles button,.adlsurvey-reset-styles select,.adlsurvey-reset-styles optgroup,.adlsurvey-reset-styles textarea{font-family:inherit;font-size:inherit;line-height:inherit;margin:0;} \
        //.adlsurvey-reset-styles textarea{white-space:revert; } \
        .adlsurvey-reset-styles textarea{white-space:revert;background:#ffffff; } \
        .adlsurvey-reset-styles span{color:inherit;border:0;margin:0;padding:0;float:none;} \
        .adlsurvey-reset-styles button,.adlsurvey-reset-styles select{text-transform:none;} \
        .adlsurvey-reset-styles button:focus:not(:focus-visible){outline:0;} \
        .adlsurvey-reset-styles button{-webkit-appearance:button;appearance:button;} \
        .adlsurvey-reset-styles button:not(:disabled){cursor:pointer;} \
        .adlsurvey-reset-styles [hidden]{display:none!important;} \
      </style>",
    _colors: function (s) {
      return "<!-- ADL Survey - General Styles --> \
      <style id=\"style-adlsurvey-colors-"+s.name+"\"> \
        #"+s.name+"{--adlsurvey-color-background:"+s.color.background+";--adlsurvey-color-text:"+s.color.text+";--adlsurvey-color-button:"+s.color.button+";--adlsurvey-color-button-active:"+s.color.buttonActive+";--adlsurvey-color-button-active-text:"+s.color.buttonActiveText+";} \
      </style>";
    },
    _general: "<!-- ADL Survey - General Styles --> \
      <style id=\"style-adlsurvey-general\"> \
        //.adlsurvey-container{background:var(--adlsurvey-color-background);border-radius:5px 5px 0 0;box-shadow:0 0 7px 0 rgba(0,0,0,.3)!important;font-size:.75em!important;margin:0 auto;min-width:300px;} \
        .adlsurvey-container{background:var(--adlsurvey-color-background);border-radius:5px 5px 0 0;font-size:.75em!important;margin:0 auto;min-width:220px;} \
        .adlsurvey-title{color:var(--adlsurvey-color-text)!important;font-size:12px!important;font-weight:bold!important;line-height:1.2!important;margin:0;min-height:16px;padding:12px;text-align:left;word-break:break-word;word-wrap:break-word;} \
        .adlsurvey-header-title{font-size:1.375em;font-weight:500;line-height:1;margin-right:1em;color:var(--adlsurvey-color-text);} \
        .adlsurvey-answers-wrapper{margin:0 auto;max-width:none;padding:0 12px 12px 12px;} \
        .adlsurvey-rating-scale{align-items:center;display:flex;flex-direction:row;gap:2px;height:45px;justify-content:space-between;margin:0!important;} \
        .adlsurvey-rating-scale-stars{align-items:center;display:flex;flex-direction:row;gap:2px;height:50px;justify-content:space-between;margin:0!important;} \
        .adlsurvey-scale-option{border-bottom-width:1px;border-top-width:1px;color:var(--adlsurvey-color-text)!important;display:inline-block;flex:1;font-size:15px!important;height:45px;margin:0!important;padding:8px 0!important;width:auto!important;} \
        .adlsurvey-rating-input:checked+label span{background-color:var(--adlsurvey-color-button-active);color:var(--adlsurvey-color-button-active-text);} \
        .adlsurvey-scale-option span:hover{background-color:var(--adlsurvey-color-button-active);color:var(--adlsurvey-color-button-active-text);} \
        .adlsurvey-rating-input,.adlsurvey-reaction-input,.adlsurvey-stars-input{height:0;opacity:0;position:absolute;width:0;} \
        .adlsurvey-scale-option span{background-color:var(--adlsurvey-color-button);border:1px solid transparent;border-radius:2px;clear:none!important;color:inherit;cursor:pointer;display:block;float:left!important;font-size:inherit;list-style-image:none!important;list-style-type:none!important;padding:4px 0 5px 0!important;transition:background-color .15s ease-in-out;text-align:center!important;text-indent:0;width:100%;} \
        .adlsurvey-scale-labels{clear:both;padding-top:5px;} \
        .adlsurvey-scale-labels::after{content:'';clear:both!important;display:block;} \
        .adlsurvey-scale-label{color:var(--adlsurvey-color-text)!important;font-size:.75em;max-width:45%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.8;} \
        .adlsurvey-scale-label:first-child{float:left!important;} \
        .adlsurvey-scale-label:last-child{float:right!important;} \
        .adlsurvey-footer{align-items:center;border-color:rgba(224, 226, 232, 0.6)!important;border-top:1px solid;display:flex;flex-direction:row-reverse;gap:12px;justify-content:center;padding:0 0.75em;width:100%;} \
        .adlsurvey-actions{align-items:center;display:flex;flex-direction:row-reverse;float:right!important;gap:12px;min-height:55px;} \
        .adlsurvey-btn{background-color:var(--adlsurvey-color-button-active);border:0!important;border-radius:8px;box-shadow:none!important;color:var(--adlsurvey-color-button-active-text);float:none!important;font-size:14px!important;font-weight:600!important;height:40px!important;margin:0;min-height:initial!important;min-width:initial!important;outline:0!important;padding:8px 24px!important;text-decoration:none;transition:opacity .15s ease-in-out;vertical-align:top;width:auto!important;zoom:1;} \
        .adlsurvey-btn-primary:hover{opacity: 0.77;} \
        .adlsurvey-btn-primary[disabled]{pointer-events:none;opacity:.33;} \
        .adlsurvey-input-field{background:none;border:1px solid var(--adlsurvey-color-text)!important;border-radius:4px;color:var(--adlsurvey-color-text);float:none;font-size:0.875em;max-width:none!important;min-height:40px;min-width:100%;outline:none!important;padding:6px!important;text-indent:0!important;width:100%;} \
        .adlsurvey-input-field::placeholder {color:var(--adlsurvey-color-text);opacity:0.55;} \
        .adlsurvey-input-textarea{height:100px;resize:none;} \
        .adlsurvey-input-textarea-character-counter{font-size:0.75em;text-align:right;width:100%;color:var(--adlsurvey-color-text);opacity:0.77;} \
        .adlsurvey-min-height-auto{min-height:auto!important;} \
        .adlsurvey-thanks{padding:1em;text-align:center;font-size:1em;width:100%;display:flex;justify-content:center;align-items:center;} \
        .adlsurvey-count,.adlsurvey-count>span{font-size:0.875em;color:var(--adlsurvey-color-text);opacity:0.77;} \
        .adlsurvey-reaction-option{display:inline-block;flex:1;height:60px;margin:0!important;padding:8px 0!important;width:auto!important;} \
        .adlsurvey-reaction-option span{opacity:0.65;clear:none!important;color:inherit;cursor:pointer;display:block;float:left!important;list-style-image:none!important;list-style-type:none!important;padding:4px 0 5px 0!important;transition:opacity .15s ease-in-out, scale .50s;text-align:center!important;text-indent:0;width:100%;line-height:0;} \
        .adlsurvey-reaction-option span:hover,.adlsurvey-reaction-input:checked+label span{opacity:1;scale:1.1;} \
        .adlsurvey-stars-option{display:inline-block;flex:1;height:60px;margin:0!important;padding:8px 0!important;width:auto!important;} \
        .adlsurvey-stars-option span{clear:none!important;color:inherit;cursor:pointer;display:block;float:left!important;list-style-image:none!important;list-style-type:none!important;padding:4px 0 5px 0!important;transition:opacity .15s ease-in-out, scale .50s;text-align:center!important;text-indent:0;width:100%;line-height:0;} \
        .adlsurvey-stars-option span:hover,.adlsurvey-stars-input:checked+label span{scale:1.1;} \
        .adlsurvey-rating-scale-stars input[type='radio']:checked ~ label svg path {fill: #FFF;} \
        .adlsurvey-rating-scale-stars input[type='radio']:checked+label svg path {fill: #FECE49;} \
        .adlsurvey-popup-minimized .adlsurvey-popup-toggle-arrow svg{transform: rotate(180deg);} \
        .adlsurvey-radio-list{display:flex;flex-wrap:wrap;align-items:center} \
        .adlsurvey-radio-list input[type=radio]{--adlsurvey-radio-size:16px;height:var(--adlsurvey-radio-size);aspect-ratio:1;border:calc(var(--adlsurvey-radio-size)/8) solid #939393;padding:calc(var(--adlsurvey-radio-size)/8);background:radial-gradient(farthest-side,var(--adlsurvey-color-button-active) 94%,#0000) 50%/0 0 no-repeat content-box;border-radius:50%;outline-offset:calc(var(--adlsurvey-radio-size)/10);-webkit-appearance:none;-moz-appearance:none;appearance:none;cursor:pointer;font-size:inherit;transition:.3s;visibility:visible;} \
        .adlsurvey-radio-list input[type=radio]:checked{border-color:var(--adlsurvey-color-button-active);background-size:100% 100%;} \
        .adlsurvey-radio-list input[type=radio]:disabled{background:linear-gradient(#939393 0 0) 50%/100% 20% no-repeat content-box;opacity:.5;cursor:not-allowed;} \
        .adlsurvey-radio-list label{margin:5px;cursor:pointer;color:var(--adlsurvey-color-text);} \
        .adlsurvey-radio-list textarea{display:none;width:100%;box-sizing:border-box} \
        .adlsurvey-radio-list input[type=radio]:checked+label{color:var(--adlsurvey-color-button-active)} \
        .adlsurvey-radio-list input[type=radio]:checked~textarea{display:block} \
      </style>",
    modal: function (s) {
      return "<!-- SUS Modal Styles: "+s.name.concat('-', s.id)+" --> \
      <style> \
        // #"+s.name+".adlsurvey{z-index:"+s.zIndex+";position:fixed;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;} \
        #"+s.name+".adlsurvey{width:100%;height:100%;overflow:visible;display:flex;align-items:center;justify-content:center;} \
        #"+s.name+" .adlsurvey-popup-toggle{display:none;} \
        //#"+s.name+" .adlsurvey-container{border-radius:8px;width:576px;animation:adlsurvey-ani-position-scale-up .5s cubic-bezier(.165,.84,.44,1) forwards;} \
        #"+s.name+" .adlsurvey-container{border-radius:8px;width:576px;animation:adlsurvey-ani-position-scale-up .5s cubic-bezier(.165,.84,.44,1) forwards;} \
        #"+s.name+" .adlsurvey-body{min-height:110px;padding:0 1em;} \
        #"+s.name+" .adlsurvey-footer{padding:0.75em;} \
        #"+s.name+" .adlsurvey-scale-labels{display:none;} \
        #"+s.name+" .adlsurvey-scale-label-full{display:block;font-size:12px;text-align:center;width:80px;color:var(--adlsurvey-color-text)!important;} \
        #"+s.name+" .adlsurvey-count{padding: 0 1em;} \
        //#"+s.name+" .adlsurvey-header{padding:1.5em 1.5em 1em 1.5em;display:flex;flex-shrink:0;align-items:center;justify-content:space-between;} \
        #"+s.name+" .adlsurvey-header{padding:1.5em 1.5em 1em 1.5em;display:flex;flex-shrink:0;align-items:center;justify-content:flex-end;} \
        #"+s.name+" .adlsurvey-header-close{margin:0;border:0;padding:0;background:none;border-radius:50%;width:32px;height:32px;display:flex;flex-flow:column nowrap;justify-content:center;align-items:center;cursor:pointer;transition:all 150ms;} \
        #"+s.name+" .adlsurvey-header-close span{margin:0;padding:0;border:0;background:none;position:relative;width:20px;height:20px;} \
        #"+s.name+" .adlsurvey-header-close span:after,.adlsurvey-header-close span:before {content:'';position:absolute;top:9px;left:0;right:0;height:2px;background:var(--adlsurvey-color-text);border-radius:6px;} \
        #"+s.name+" .adlsurvey-header-close span:after{transform:rotate(-45deg);} \
        #"+s.name+" .adlsurvey-header-close span:before{transform:rotate(45deg);} \
        #"+s.name+" .adlsurvey-header-close:hover{opacity:.65;transform:rotateZ(90deg);} \
        //#"+s.name+" .adlsurvey-thanks{font-size:1.375em;font-weight: 600;padding: 1.5em;} \
        #"+s.name+" .adlsurvey-thanks{font-size:1em;font-weight: 600;padding: 1.5em;} \
        #"+s.name+" .adlsurvey-thanks-text{font-size:12pz;font-weight: 400;padding: 1.5em;} \
        //@media (max-width:576px){#"+s.name+" .adlsurvey-embed-container{margin:0.5em;}#"+s.name+" .adlsurvey-container{width:100%}#"+s.name+" .adlsurvey-scale-label-full{display:none}#"+s.name+" .adlsurvey-scale-labels{display:block}#"+s.name+" .adlsurvey-header{padding:1em 1em 0 1em}#"+s.name+" .adlsurvey-body{min-height:120px;padding:0}} \
        #"+s.name+" .adlsurvey-embed-container{margin:0.5em;}#"+s.name+" .adlsurvey-container{width:100%}#"+s.name+" .adlsurvey-scale-label-full{display:none}#"+s.name+" .adlsurvey-scale-labels{display:block}#"+s.name+" .adlsurvey-header{padding:1em 1em 0 1em}#"+s.name+" .adlsurvey-body{min-height:120px;padding:0} \
        //@media (max-width:576px){#"+s.name+" .adlsurvey-container{width:100%}#"+s.name+" .adlsurvey-scale-label-full{display:none}#"+s.name+" .adlsurvey-scale-labels{display:block}#"+s.name+" .adlsurvey-header{padding:1em 1em 0 1em}#"+s.name+" .adlsurvey-body{min-height:120px;padding:0}} \
        #"+s.name+" .adlsurvey-container{width:100%}#"+s.name+" .adlsurvey-scale-label-full{display:none}#"+s.name+" .adlsurvey-scale-labels{display:block}#"+s.name+" .adlsurvey-header{padding:1em 1em 0 1em}#"+s.name+" .adlsurvey-body{min-height:120px;padding:0} \
        @keyframes adlsurvey-ani-position-scale-up{0%{transform:scale(.65);opacity:0}100%{transform:scale(1);opacity:1}} \
      </style>";
    },
    popup: function (s) {
      return "<!-- SUS Popup Styles: "+s.name.concat('-', s.id)+" --> \
      <style> \
        #"+s.name+" .adlsurvey-container{position:static;transform:none;width:100%;} \
        #"+s.name+" .adlsurvey-position{animation:adlsurvey-ani-position-slide-to-top 700ms linear;bottom:0;position:fixed;"+s.popupPosition+":3em;z-index:"+s.zIndex+";width:300px;transition:transform 0.33s ease-in-out;} \
        #"+s.name+" .adlsurvey-header,.adlsurvey-scale-label-full{display:none} \
        #"+s.name+" .adlsurvey-body{min-height: 125px} \
        #"+s.name+" .adlsurvey-btn{height:32px!important;padding:6px 16px!important;} \
        #"+s.name+" .adlsurvey-popup-minimized{transform:translateY(97%);} \
        #"+s.name+" .adlsurvey-popup-toggle{text-align:center;position:absolute;top:-18px;right:20px;width:40px;height:18px;padding-top:2px;cursor:pointer;border:none;box-shadow:0 0 7px 0 rgba(0,0,0,.3)!important;border-radius:5px 5px 0 0;background-color:var(--adlsurvey-color-background);color:var(--adlsurvey-color-text)!important;display:flex;align-items:center;justify-content:center;} \
        #"+s.name+" .adlsurvey-popup-toggle::before{content:'';position:absolute;left:-4px;right:-4px;bottom:-8px;height:8px;background:inherit} \
        #"+s.name+" .adlsurvey-popup-toggle-feedback{display:none;} \
        #"+s.name+" .adlsurvey-popup-toggle-arrow:hover{cursor:pointer} \
        //@media (max-width: 576px){#"+s.name+" .adlsurvey-position{left:50%;right:auto;transform:translateX(-50%);}.adlsurvey-popup-minimized{transform:translate(-50%,97%)!important;}} \
        #"+s.name+" .adlsurvey-position{left:50%;right:auto;transform:translateX(-50%);}.adlsurvey-popup-minimized{transform:translate(-50%,97%)!important;} \
        @keyframes adlsurvey-ani-position-slide-to-top {0% {bottom:-100%;}} \
     </style>";
    },
    button: function (s) {
      let reversePosition = s.popupPosition == "right" ? 'left': 'right';
      let direction = s.popupPosition == "right" ? '-': '';
      return "<!-- SUS Popup Styles: "+s.name.concat('-', s.id)+" --> \
      <style> \
        #"+s.name+" .adlsurvey-container{position:static;transform:none;width:100%;} \
        #"+s.name+" .adlsurvey-position{animation:adlsurvey-ani-position-slide-to-border 700ms linear;"+s.popupPosition+":0;top:50%;transform:translateY(-50%);border-radius:5px 0 0 0;position:fixed;z-index:"+s.zIndex+";width:300px;transition:"+s.popupPosition+" 0.33s ease-in-out;} \
        #"+s.name+" .adlsurvey-header,.adlsurvey-scale-label-full{display:none} \
        #"+s.name+" .adlsurvey-body{min-height: 125px} \
        #"+s.name+" .adlsurvey-btn{height:32px!important;padding:6px 16px!important;} \
        #"+s.name+" .adlsurvey-popup-minimized{"+s.popupPosition+":-300px!important} \
        #"+s.name+" .adlsurvey-popup-toggle{text-align:center;position:absolute;width:fit-content;height:34px;padding:0 16px;cursor:pointer;border:none;border-radius:5px 5px 0 0;background-color:var(--adlsurvey-color-button-active);color:var(--adlsurvey-color-button-active-text)!important;display:flex;align-items:center;gap:12px;justify-content:space-between;transform:rotate("+direction+"90deg) translateY(-18px);} \
        #"+s.name+" .adlsurvey-button-container{position:absolute;top:50%;"+reversePosition+":0;} \
        #"+s.name+" .adlsurvey-button-position{position:relative;display:flex;justify-content:center;align-items:center;} \
        #"+s.name+" .adlsurvey-thanks{min-height: 90px;} \
        @keyframes adlsurvey-ani-position-slide-to-border {0% {"+s.popupPosition+":-100%;}} \
     </style>";
    }
  };

  render() {
    let that = this;
    const components = {
      /**
       * Generate the rating scale HTML for a given question and index.
       *
       * @param {object} question - The question object containing information about the rating scale.
       * @param {number} index - The index of the rating scale.
       * @return {string} The HTML code representing the rating scale.
       */
      ratingScale: function (question, index) {
        let inputs = ``;
        for (let i = 1; i <= question.scale; i++) {
          inputs += '<input class="adlsurvey-rating-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-'+i+'" value="'+i+'"> \
          <label class="adlsurvey-scale-option" for="'+that.options.name+'-q'+index+'-'+i+'"> \
            <span>'+i+'</span> \
          </label> \
          ';
        }
    
        return ' \
        <div class="adlsurvey-rating"> \
          <div class="adlsurvey-rating-scale"> \
            <span class="adlsurvey-scale-label-full">'+question.lowScoreLabel+'</span> \
            '+inputs+' \
            <span class="adlsurvey-scale-label-full">'+question.highScoreLabel+'</span> \
          </div> \
          <div class="adlsurvey-scale-labels"> \
            <span class="adlsurvey-scale-label">'+question.lowScoreLabel+'</span> \
            <span class="adlsurvey-scale-label">'+question.highScoreLabel+'</span> \
          </div> \
        </div> \
        ';
      },
      /**
       * Generates a textarea element for a given question and index.
       *
       * @param {any} question - The question to generate the text element from.
       * @param {number} index - The index of the textarea element.
       * @return {string} The HTML code representing the textarea element.
       */
      text: function (question, index) {
        return '\
        <div class="adlsurvey-input"> \
          <textarea class="adlsurvey-input-field adlsurvey-input-textarea js-adlsurvey-input-textarea" name="'+that.options.name+'-q'+index+'" placeholder="Por favor escribe aquí..." spellcheck="false" maxlength="120"></textarea> \
          <div class="adlsurvey-input-textarea-character-counter js-adlsurvey-input-textarea-character-counter">120</div> \
        </div> \
        ';
      },
      /**
       * Generate the reaction scale HTML for a given question and index.
       *
       * @param {object} question - The question object containing information about the reaction scale.
       * @param {number} index - The index of the reaction scale.
       * @return {string} The HTML code representing the reaction scale.
       */
      reaction: function (question, index) {
        return ' \
        <div class="adlsurvey-rating"> \
          <div class="adlsurvey-rating-scale"> \
            <span class="adlsurvey-scale-label-full">'+question.lowScoreLabel+'</span> \
            <input class="adlsurvey-reaction-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-1" value="Me enoja"> \
            <label class="adlsurvey-reaction-option" for="'+that.options.name+'-q'+index+'-1" title="Me enoja"> <span> \
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect width="34" height="34" rx="17" fill="#FFD042"/><circle cx="10.0454" cy="14.8364" r="2.31818" fill="#252B31"/><circle cx="23.9544" cy="14.8364" r="2.31818" fill="#252B31"/><path d="M16.9999 26.1182C19.0129 26.1182 20.8761 25.5836 22.3963 24.6756C26.06 22.487 22.813 18.3909 18.5454 18.3909H16.9999H15.4544C11.1868 18.3909 7.93976 22.487 11.6035 24.6756C13.1237 25.5836 14.9869 26.1182 16.9999 26.1182Z" fill="#252B31"/><path d="M9.27271 10.3286L14.2004 14.1833" stroke="#252B31" stroke-width="1.54545" stroke-linecap="round"/><path d="M25.0186 10.3286L20.0909 14.1833" stroke="#252B31" stroke-width="1.54545" stroke-linecap="round"/></svg> \
            </span> </label> \
            <input class="adlsurvey-reaction-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-2" value="No me gusta"> \
            <label class="adlsurvey-reaction-option" for="'+that.options.name+'-q'+index+'-2" title="No me gusta"> <span> \
            <svg width="35" height="34" fill="none"> <rect x=".25" width="34" height="34" rx="17" fill="#FFD042"/> <circle cx="10.296" cy="13.136" r="2.318" fill="#252B31"/> <circle cx="24.204" cy="13.136" r="2.318" fill="#252B31"/> <path d="M9.523 23.954c4.811-4.12 10.643-4.12 15.454 0" stroke="#252B31" stroke-width="1.545" stroke-linecap="round"/></svg> \
            </span> </label>  \
            <input class="adlsurvey-reaction-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-3" value="Neutral">\
            <label class="adlsurvey-reaction-option" for="'+that.options.name+'-q'+index+'-3" title="Neutral"> <span> \
            <svg width="35" height="34" fill="none"> <rect x=".5" width="34" height="34" rx="17" fill="#FFD042"/> <circle cx="10.546" cy="13.136" r="2.318" fill="#252B31"/> <circle cx="24.455" cy="13.136" r="2.318" fill="#252B31"/> <path d="M9 22.41h17" stroke="#252B31" stroke-width="1.545" stroke-linecap="round"/></svg> \
            </span> </label> \
            <input class="adlsurvey-reaction-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-4" value="Me gusta"> \
            <label class="adlsurvey-reaction-option" for="'+that.options.name+'-q'+index+'-4" title="Me gusta"> <span> \
            <svg width="35" height="34" fill="none"> <rect x=".75" width="34" height="34" rx="17" fill="#FFD042"/> <circle cx="10.796" cy="13.136" r="2.318" fill="#252B31"/> <circle cx="24.705" cy="13.136" r="2.318" fill="#252B31"/> <path d="M17.75 26.273c4.7 0 8.583-2.914 9.19-6.692.084-.521-.413-.912-.925-.784a34.077 34.077 0 0 1-16.53 0c-.512-.128-1.009.262-.925.784.607 3.778 4.49 6.692 9.19 6.692Z" fill="#252B31"/></svg> \
            </span> </label> \
            <input class="adlsurvey-reaction-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-5" value="Me encanta"> \
            <label class="adlsurvey-reaction-option" for="'+that.options.name+'-q'+index+'-5" title="Me encanta"> <span> \
            <svg width="34" height="34" fill="none"> <rect width="34" height="34" rx="17" fill="#FFD042"/> <path d="M12.544 10.607c.402 0 .77.16 1.07.417.268.288.436.64.436 1.024s-.168.736-.469 1.024c-1.531 1.729-2.435 2.593-2.71 2.593-.274 0-1.177-.864-2.709-2.593a1.37 1.37 0 0 1-.435-1.024c0-.384.168-.736.435-1.024.268-.288.67-.417 1.037-.417a1.5 1.5 0 0 1 1.07.417l.369.352a.333.333 0 0 0 .468 0l.334-.352a1.67 1.67 0 0 1 1.104-.417ZM24.768 10.607c.401 0 .77.16 1.07.417.268.288.435.64.435 1.024s-.167.736-.468 1.024c-1.532 1.729-2.435 2.593-2.71 2.593-.274 0-1.178-.864-2.71-2.593a1.37 1.37 0 0 1-.434-1.024c0-.384.167-.736.435-1.024.267-.288.669-.417 1.037-.417a1.5 1.5 0 0 1 1.07.417l.368.352a.333.333 0 0 0 .468 0l.335-.352a1.67 1.67 0 0 1 1.104-.417Z" fill="#E1001D"/> <path d="M17 26.483c4.7 0 8.583-2.913 9.19-6.692.084-.52-.413-.91-.925-.783a34.075 34.075 0 0 1-16.53 0c-.512-.128-1.009.262-.925.783.607 3.779 4.49 6.692 9.19 6.692Z" fill="#252B31"/></svg> \
            </span> </label> \
            <span class="adlsurvey-scale-label-full">'+question.highScoreLabel+'</span> \
          </div> \
          <div class="adlsurvey-scale-labels"> \
            <span class="adlsurvey-scale-label">'+question.lowScoreLabel+'</span> \
            <span class="adlsurvey-scale-label">'+question.highScoreLabel+'</span> \
          </div> \
        </div> \
        ';
      },
      /**
       * Generate the reaction scale HTML for a given question and index.
       *
       * @param {object} question - The question object containing information about the reaction scale.
       * @param {number} index - The index of the reaction scale.
       * @return {string} The HTML code representing the reaction scale.
       */
      stars: function (question, index) {
        return ' \
        <div class="adlsurvey-rating"> \
          <div class="adlsurvey-rating-scale-stars" data-type-question="stars" data-question='+index+'> \
            <input class="adlsurvey-stars-input" type="radio" name="'+that.options.name+'-q'+index+'" id="hidden-start" checked value="0">\
            <span class="adlsurvey-scale-label-full">'+question.lowScoreLabel+'</span> \
            <input class="adlsurvey-stars-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-1" value="1"> \
            <label class="adlsurvey-stars-option" for="'+that.options.name+'-q'+index+'-1" title="1 start"> <span> \
            <svg width="42" height="42" viewBox="0 0 35 32" fill="#FECE49" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 1.61804L20.9535 12.2467L21.0657 12.5922H21.429L32.6046 12.5922L23.5634 19.1611L23.2695 19.3746L23.3817 19.7201L26.8352 30.3488L17.7939 23.7799L17.5 23.5664L17.2061 23.7799L8.16481 30.3488L11.6183 19.7201L11.7305 19.3746L11.4366 19.1611L2.39535 12.5922L13.571 12.5922H13.9343L14.0465 12.2467L17.5 1.61804Z" fill="#FECE49"/></svg> \
            </span> </label> \
            <input class="adlsurvey-stars-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-2" value="2"> \
            <label class="adlsurvey-stars-option" for="'+that.options.name+'-q'+index+'-2" title="2 start"> <span> \
            <svg width="42" height="42" viewBox="0 0 35 32" fill="#FECE49" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 1.61804L20.9535 12.2467L21.0657 12.5922H21.429L32.6046 12.5922L23.5634 19.1611L23.2695 19.3746L23.3817 19.7201L26.8352 30.3488L17.7939 23.7799L17.5 23.5664L17.2061 23.7799L8.16481 30.3488L11.6183 19.7201L11.7305 19.3746L11.4366 19.1611L2.39535 12.5922L13.571 12.5922H13.9343L14.0465 12.2467L17.5 1.61804Z" fill="#FECE49"/></svg> \
            </span> </label>  \
            <input class="adlsurvey-stars-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-3" value="3">\
            <label class="adlsurvey-stars-option" for="'+that.options.name+'-q'+index+'-3" title="3 start"> <span> \
            <svg width="42" height="42" viewBox="0 0 35 32" fill="#FECE49" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 1.61804L20.9535 12.2467L21.0657 12.5922H21.429L32.6046 12.5922L23.5634 19.1611L23.2695 19.3746L23.3817 19.7201L26.8352 30.3488L17.7939 23.7799L17.5 23.5664L17.2061 23.7799L8.16481 30.3488L11.6183 19.7201L11.7305 19.3746L11.4366 19.1611L2.39535 12.5922L13.571 12.5922H13.9343L14.0465 12.2467L17.5 1.61804Z" fill="#FECE49"/></svg> \
            </span> </label> \
            <input class="adlsurvey-stars-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-4" value="4"> \
            <label class="adlsurvey-stars-option" for="'+that.options.name+'-q'+index+'-4" title="4 start"> <span> \
            <svg width="42" height="42" viewBox="0 0 35 32" fill="#FECE49" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 1.61804L20.9535 12.2467L21.0657 12.5922H21.429L32.6046 12.5922L23.5634 19.1611L23.2695 19.3746L23.3817 19.7201L26.8352 30.3488L17.7939 23.7799L17.5 23.5664L17.2061 23.7799L8.16481 30.3488L11.6183 19.7201L11.7305 19.3746L11.4366 19.1611L2.39535 12.5922L13.571 12.5922H13.9343L14.0465 12.2467L17.5 1.61804Z" fill="#FECE49"/></svg> \
            </span> </label> \
            <input class="adlsurvey-stars-input" type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-5" value="5"> \
            <label class="adlsurvey-stars-option" for="'+that.options.name+'-q'+index+'-5" title="5 start"> <span> \
            <svg width="42" height="42" viewBox="0 0 35 32" fill="#FECE49" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 1.61804L20.9535 12.2467L21.0657 12.5922H21.429L32.6046 12.5922L23.5634 19.1611L23.2695 19.3746L23.3817 19.7201L26.8352 30.3488L17.7939 23.7799L17.5 23.5664L17.2061 23.7799L8.16481 30.3488L11.6183 19.7201L11.7305 19.3746L11.4366 19.1611L2.39535 12.5922L13.571 12.5922H13.9343L14.0465 12.2467L17.5 1.61804Z" fill="#FECE49"/></svg> \
            </span> </label> \
            <span class="adlsurvey-scale-label-full">'+question.highScoreLabel+'</span> \
          </div> \
          <div class="adlsurvey-scale-labels"> \
            <span class="adlsurvey-scale-label">'+question.lowScoreLabel+'</span> \
            <span class="adlsurvey-scale-label">'+question.highScoreLabel+'</span> \
          </div> \
        </div> \
        ';
      },
      /**
       * Generate the radio buttons HTML for a given question and index.
       *
       * @param {object} question - The question object containing information about the radio buttons.
       * @param {number} index - The index of the radio buttons.
       * @return {string} The HTML code representing the radio buttons.
       */
      radioButtons: function (question, index) {
        let inputs = ``;
        for (let i = 0; i < question.options.length; i++) {
          inputs += '<div class="adlsurvey-radio-list">';
          inputs += '<input type="radio" name="'+that.options.name+'-q'+index+'" id="'+that.options.name+'-q'+index+'-'+i+'" value="'+question.options[i].answer+'"> \
            <label for="'+that.options.name+'-q'+index+'-'+i+'"> \
              '+question.options[i].answer+' \
            </label>';
          if(question.options[i].comment) {
            inputs += '<textarea class="adlsurvey-input-field adlsurvey-input-textarea" id="'+that.options.name+'-q'+index+'-text" placeholder="Por favor escribe aquí..." spellcheck="false" maxlength="120" oninput="document.getElementById(\''+that.options.name+'-q'+index+'-'+i+'\').value=event.target.value"></textarea>';
          }
          inputs += '</div>';
        }

        return ' \
        <div class="adlsurvey-radio"> \
          '+inputs+' \
        </div> \
        ';
      },
      /**
       * Generates a description element.
       *
       * @param {any} question - The question to generate the text element from.
       * @param {number} index - The index of the textarea element.
       * @return {string} The HTML code representing the description element.
       */
      statement: function (question, index) {
        return '\
        <div> \
          <p> \
          '+question.description+' \
          </p> \
          <input type="hidden" name="'+that.options.name+'-q'+index+'" value="Skip Statement"> \
        </div> \
        ';
      },
    };

    /**
     * Renders a widget using the given question and index.
     *
     * @param {Object} question - The question used to render the widget.
     * @param {number} index - The index of the widget.
     * @return {string} The rendered widget HTML.
     */
    const renderComponent = (question, index) => {
      return '\
      <div class="adlsurvey-question js-adlsurvey-question" hidden> \
        <div class="adlsurvey-title">'+question.text+'</div> \
        <div class="adlsurvey-answers-wrapper"> \
          '+components[question.type](question, index)+' \
        </div> \
      </div> \
      ';
    }

    /**
     * Generates the HTML template for a survey widget.
     *
     * @param {Array} questions - An array of data to render in the modal.
     * @return {string} The HTML template for the modal.
     */
    return '\
    <div class="adlsurvey" id="'+this.options.name+'"> \
      <div class="adlsurvey-embed-container adlsurvey-reset-styles"> \
        <div class="adlsurvey-container adlsurvey-position js-adlsurvey-position"> \
          <div class="adlsurvey-button-container"> \
            <div class="adlsurvey-button-position"> \
              <button class="adlsurvey-popup-toggle js-adlsurvey-popup-toggle"><span class="adlsurvey-popup-toggle-arrow js-adlsurvey-popup-toggle-arrow"> \
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8"><path fill="currentColor" d="M.69 1.13a.64.64 0 01.92 0L6 5.63l4.4-4.5a.64.64 0 01.91 0c.25.26.25.67 0 .92l-4.58 4.7a1 1 0 01-1.13.23 1 1 0 01-.33-.23L.7 2.05a.66.66 0 010-.92z"></path></svg> \
                </span><span class="adlsurvey-popup-toggle-feedback">'+this.options.feedback+'</span> \
              </button> \
            </div> \
          </div> \
          <form name="js-adlsurvey-form-'+this.options.name+'"> \
          <div class="adlsurvey-thanks js-adlsurvey-thanks adlsurvey-header-logo" hidden><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M 25 2 C 12.317 2 2 12.317 2 25 C 2 37.683 12.317 48 25 48 C 37.683 48 48 37.683 48 25 C 48 20.44 46.660281 16.189328 44.363281 12.611328 L 42.994141 14.228516 C 44.889141 17.382516 46 21.06 46 25 C 46 36.579 36.579 46 25 46 C 13.421 46 4 36.579 4 25 C 4 13.421 13.421 4 25 4 C 30.443 4 35.393906 6.0997656 39.128906 9.5097656 L 40.4375 7.9648438 C 36.3525 4.2598437 30.935 2 25 2 z M 43.236328 7.7539062 L 23.914062 30.554688 L 15.78125 22.96875 L 14.417969 24.431641 L 24.083984 33.447266 L 44.763672 9.046875 L 43.236328 7.7539062 z"/></svg></div> \
          <div class="adlsurvey-thanks js-adlsurvey-thanks adlsurvey-header-title" hidden>'+this.options.thanks+'</div> \
          <div class="adlsurvey-thanks js-adlsurvey-thanks adlsurvey-header-text" hidden>Gracias por tus comentarios, estos me ayudaran a seguir mejorando</div> \
            <div class="adlsurvey-header js-adlsurvey-header"> \
              <div class="adlsurvey-header-title js-adlsurvey-header-title" style="display:none">'+this.options.title+'</div> \
              <button type="button" class="adlsurvey-header-close js-adlsurvey-close"> \
              <span></span>\
              </button> \
            </div> \
            <div class="adlsurvey-body js-adlsurvey-body"> \
              '+this.options.questions.map(renderComponent).join('')+' \
            </div> \
            <div class="adlsurvey-footer"> \
              <div class="adlsurvey-actions"> \
                <button class="adlsurvey-btn adlsurvey-btn-primary js-adlsurvey-btn-close js-adlsurvey-close" type="button" hidden>Finalizar</button> \
                <button class="adlsurvey-btn adlsurvey-btn-primary js-adlsurvey-btn-next" type="button" value="0">Siguiente</button> \
              </div> \
              <div class="adlsurvey-count js-adlsurvey-count" style="display:none"> \
                <span class="adlsurvey-count-question js-adlsurvey-count-question">1</span> <span>de</span> <span class="adlsurvey-count-total js-adlsurvey-count-total">0</span> \
              </div> \
            </div> \
          </form> \
        </div> \
      </div> \
    </div> \
    ';
  }

  /**
   * Creates a new survey instance.
   *
   * @param {Object} opt The options object for the survey.
   */
  constructor(opt) {
    if (typeof opt === 'object') {
      Object.assign(this.options, opt);
    }

    this.storage = new ADLStorage(this.options.name)[this.options.storage]().get() || {};
  }

  /**
   * Executes the next step of the form.
   *
   * @return {void} This function does not return anything.
   */
  next(e, that) {
    const currentIndex = Number(e.target.value);
    that.answers.push(document.forms["js-adlsurvey-form-"+this.options.name][this.options.name+"-q" + currentIndex].value);
    that.answers.push(document.forms["js-adlsurvey-form-"+this.options.name][this.options.name+"-q" + (currentIndex+1)].value);

    new ADLStorage(that.options.name, {
      "id": that.options.id,
      "answers": that.answers
    }, that.options.expiryDays)[that.options.storage]().set(); 

    const $adlSurvey = document.getElementById(this.options.name);

    let elements = $adlSurvey.getElementsByClassName("js-adlsurvey-question");
     for(var i = 0; i < elements.length; i++){
      elements[i].setAttribute("hidden", "");
     }

    if (that.answers.length == that.options.questions.length) {
      e.target.style.display = "none";
      this.thanks();
    } else {
      e.target.value = currentIndex + 2;
      e.target.disabled = that.options.questions[currentIndex + 1].required;
      $adlSurvey.getElementsByClassName("js-adlsurvey-question")[currentIndex + 2].removeAttribute("hidden");
      $adlSurvey.getElementsByClassName("js-adlsurvey-question")[currentIndex + 3].removeAttribute("hidden");
      $adlSurvey.querySelector(".js-adlsurvey-count-question").textContent = that.answers.length + 2;
    }
  }

  /**
   * Displays the "Thanks" screen.
   *
   * @returns {void}
   */
  thanks() {
    const $adlSurvey = document.getElementById(this.options.name);

    $adlSurvey.querySelector(".js-adlsurvey-btn-next").setAttribute("hidden", "");
    $adlSurvey.querySelector(".js-adlsurvey-btn-close").removeAttribute("hidden");
    $adlSurvey.querySelector(".js-adlsurvey-thanks.adlsurvey-header-logo").removeAttribute("hidden");
    $adlSurvey.querySelector(".js-adlsurvey-thanks.adlsurvey-header-title").removeAttribute("hidden");
    $adlSurvey.querySelector(".js-adlsurvey-thanks.adlsurvey-header-text").removeAttribute("hidden");
    $adlSurvey.querySelector(".js-adlsurvey-header").setAttribute("hidden", "");
    $adlSurvey.querySelector(".js-adlsurvey-count").setAttribute("hidden", "");
    $adlSurvey.querySelector(".js-adlsurvey-body").classList.add("adlsurvey-min-height-auto");
  }

  /**
   * Closes the modal by this.options the display property of the ".js-adlsurvey-modal" element to "none".
   */
  close(e, that) {
    document.getElementById(that.options.name).style.display = "none";

    let data = {
      "id": that.options.id,
      "answers": that.answers
    };

    if (that.answers.length > 0) {
      data.close = true;
      that.utagEventHandler();
    }

    new ADLStorage(that.options.name, data, that.options.expiryDays)[that.options.storage]().set(); 
  }

  /**
   * Send an event to utag
   *
   * @return {void} This function does not return a value.
   */
  utagEventHandler() {
    const event = {
      "tealium_event": "send_survey", // Check EventStream - Event Feed - Conditions - String equals send_survey
      "event_name": this.options.name,
      "id_sus": this.options.id,
      "data": []
    };

    const questionAnswer = [];
    for (var i = 0; i < this.answers.length; i++) {
      const item = this.options.questions[i];
      Object.keys(item).forEach((key) => {
        const value = item[key];
        if (key === "text") {
          questionAnswer.push(JSON.stringify({ key: value, value: this.answers[i] }));
          questionAnswer.push(JSON.stringify({ key: `question_${i + 1}`, value: item[key] }));
          questionAnswer.push(JSON.stringify({ key: `answer_${i + 1}`, value: this.answers[i] }));
        } else {
          questionAnswer.push(JSON.stringify({ key: `${key}_${i + 1}`, value: typeof value === "string" ? value : JSON.stringify(value) }));
        }
      });
    }

    event.data = questionAnswer;

    if (typeof utag != 'undefined' && utag) {
      utag.link(event);
    } else {
      console.log(this.options.name +": utag is undefined");
      console.log(event);
    }
  }

  show() {
    // Check if the SUS is closed, Cookie/Local Storage.
    if (this.storage.data && this.storage.data.close) {
      return false;
    }

    // Check if the setting element exists.
    const $checkAdlSurvey = document.getElementById(this.options.name);
    if (($checkAdlSurvey && !this.storage.data) 
      || ($checkAdlSurvey && this.storage.data && this.storage.data.answers && this.storage.data.answers.length === 0)) { 
      $checkAdlSurvey.style.display = "flex";
      return false; 
    }

    if ($checkAdlSurvey) {
      
      $checkAdlSurvey.remove();
    } else {
      if (!document.getElementById('style-adlsurvey-reset')) {
        document.head.insertAdjacentHTML('beforeend', this.css._reset);
      }
      if (!document.getElementById('style-adlsurvey-general')) {
        document.head.insertAdjacentHTML('beforeend', this.css._general);
      }
      if (!document.getElementById('style-adlsurvey-colors-'+this.options.name)) {
        document.head.insertAdjacentHTML('beforeend', this.css._colors(this.options));
      }
      document.head.insertAdjacentHTML('beforeend', this.css[this.options.theme](this.options));
    }
    //document.body.insertAdjacentHTML('beforeend', this.render(this.options));
    var customTag = document.getElementById("surveyIDW"); //surveyIDW
    customTag.insertAdjacentHTML('beforeend', this.render(this.options));
    
    const $adlSurvey = document.getElementById(this.options.name);

    this.answers = [];
    this.enableNextButton = [false, false, false, true];

    // Initialize the form
    if (
      this.storage.data &&
      this.storage.data.answers &&
      this.storage.data.answers.length > 0
    ) {
      this.answers = this.storage.data.answers;
      this.options.id = this.storage.data.id;
      for (let i = 0; i < this.answers.length; i++) {
        document.forms['js-adlsurvey-form-' + this.options.name][
          this.options.name + '-q' + i
        ].value = this.answers[i];
      }
      $adlSurvey.querySelector('.js-adlsurvey-count-question').textContent =
        this.answers.length + 1;
      $adlSurvey.querySelector('.js-adlsurvey-btn-next').value =
        this.answers.length;

      if (this.answers.length == this.options.questions.length) {
        this.thanks();
      } else {
        $adlSurvey
          .getElementsByClassName('js-adlsurvey-question')
          [this.answers.length].removeAttribute('hidden');
        $adlSurvey.querySelector('.js-adlsurvey-btn-next').disabled =
          this.options.questions[this.answers.length].required;
      }
    } else {
      let required = false;
      for (let i = 0; i < 2; i++) {
        $adlSurvey.getElementsByClassName('js-adlsurvey-question')[i].removeAttribute('hidden');
        if(!required)
          required = this.options.questions[i].required;
      }
      $adlSurvey.querySelector('.js-adlsurvey-btn-next').disabled = required;
    }

    $adlSurvey.querySelector(".js-adlsurvey-count-total").textContent = this.options.questions.length;

    // Event listeners
    document.forms["js-adlsurvey-form-"+this.options.name].addEventListener('input', (event) => {
      event.preventDefault()
      let idQuestion = parseInt(event.target.parentNode.dataset.question);
      this.enableNextButton[idQuestion] = true;
      let $initialQuestion = idQuestion < 2? 0 : 2;
      if(this.enableNextButton[$initialQuestion] && this.enableNextButton[$initialQuestion+1]) {
        $adlSurvey.querySelector('.js-adlsurvey-btn-next').disabled = false;
      }
  });
  
    $adlSurvey.querySelector(".js-adlsurvey-btn-next").addEventListener('click', evt => this.next(evt, this));
  
    const closeButtons = $adlSurvey.querySelectorAll(".js-adlsurvey-close");
    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener("click", evt => this.close(evt, this));
    });

    const textareaElements = $adlSurvey.querySelectorAll(".js-adlsurvey-input-textarea");
    textareaElements.forEach((textareaElement) => {
      const maxlength = textareaElement.getAttribute("maxlength");

      textareaElement.addEventListener("input", () => {
        textareaElement.parentElement.querySelector(".js-adlsurvey-input-textarea-character-counter").textContent = (maxlength - textareaElement.value.length);
      });
    });

    // It is not a modal
    $adlSurvey.querySelector(".js-adlsurvey-popup-toggle").addEventListener('click', () => {
      $adlSurvey.querySelector(".js-adlsurvey-position").classList.toggle("adlsurvey-popup-minimized");
    });

    return $adlSurvey;
  }
};