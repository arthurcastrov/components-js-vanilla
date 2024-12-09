class PreferenceSurvey extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            color: #505354;
            font-family: __Quicksand_7f5e9f,__Quicksand_Fallback_7f5e9f;
            font-weight: 400;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 50;
          }
          .modal-container {
            display: flex;
            flex-direction: column;
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            animation: fadeIn 0.3s ease-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .modal-header {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          }
          .modal-header .title h2 strong {
            align-text: center;
            font-weight: 700;  
            font-size: 1rem;
            color: #505354;
          }
          
          .modal-header .close-btn {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            align-self: flex-end;
            align-items: center;
            background: none;
            font-size: 1.4rem;
            font-weight: 700;
            cursor: pointer;
            color: #3CDBC0;
            padding: 2px 8px;
            border: 1px solid #3CDBC0;
            border-radius: 100px;
          }
            .modal-header .close-btn:hover {
            color: #000;
            background-color: rgb(255 209 0);
          }
          .modal-header .close-btn > strong {
            font-size: .9rem;
            color: inherit;
            font-weight: 700;
          }
          .modal-header .description {
            margin-top: 10px;
            font-size: 0.9rem;
            text-align: center;
          }
          .modal-header .description strong {
            display: block;
            font-size: 1rem;
            color: #3CDBC0;
            font-weight: 700;
          }
          .preference-container {
            display: grid; 
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            flex: 1;
            padding: 3px;
          }
          .preference-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .preference-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .preference-card.selected {
            background-color: #e0f7fa;
            border-color: #3CDBC0;
          }

          .preference-card svg {
            width: 40px;
            height: 40px;
            margin-bottom: 10px;
          }
          .preference-card span {
            hyphens: auto;
          }
          .confirm-btn {
            display: block;
            min-width: 25%;
            align-self: center;
            padding: 10px;
            background-color: #3CDBC0;
            color: white;
            border: none;
            border-radius: 100px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            text-align: center;
            margin-top: 20px;
            transition: background-color 0.3s ease;
          }
          
          .confirm-btn:not(.inactive):hover {
            color: #000;
            background-color: rgb(255 209 0);
          }
          
          .inactive, inactive:hover {
            opacity: .3;
            pointer-events: none;
          }

          
          @media (max-width: 767px) {
            .modal-container {
              width: 100%;
              height: 100%;
              max-width: none;
              max-height: none;
              border-radius: 0;
              padding: 10px;
              display: flex;
              flex-direction: column;
              overflow-y: scroll;
            }
            .preference-card svg {
              width: 60px;
              height: 60px;
              margin-bottom: 10px;
            }
          }

          @media (min-width: 768px) {
            .modal-container {
              width: 50%;
              max-width: none;
              border-radius: 16px;
            }
          }          
        </style>

        <div class="modal-overlay">
          <div class="modal-container">
            <!-- Encabezado del modal -->
            <div class="modal-header">
              <div class="title">
                <h2>
                  <strong>Mis gustos</strong>
                </h2>
                <button class="close-btn">&times;<strong>&nbsp;Saltar</strong></button>  
              </div>
              <h2 class="description">
                <strong>Queremos conocer\u0020+\u0020de ti</strong>
                Selecciona hasta 3 opciones de tus categorías favoritas y ayúdanos a mejorar tu experiencia.
              </h2>
            </div>
            
            <div class="preference-container">
              ${this.getCategories()
                .map(
                  (category) => `
                            <div class="preference-card" data-value="${category.value}">
                              ${category.icon}
                              <span>${category.label}</span>
                            </div>`
                )
                .join('')}  
            </div>

            <button class="confirm-btn inactive ">Confirmar</button>
          </div>
        </div>
      `;

    this.shadowRoot
      .querySelector('.close-btn')
      .addEventListener('click', () => {
        this.closeModal();
      });

    this.shadowRoot.querySelectorAll('.preference-card').forEach((card) => {
      card.addEventListener('click', () => {

        this.toggleSelection(card);

        const selectedCards = this.shadowRoot.querySelectorAll('.preference-card.selected');
        const confirmBtn = this.shadowRoot.querySelector('.confirm-btn');

        if (selectedCards.length > 0) {
          confirmBtn.classList.remove('inactive');
        } else {
          confirmBtn.classList.add('inactive');
        }

      });
    });

    this.shadowRoot
      .querySelector('.confirm-btn')
      .addEventListener('click', () => {
        this.confirmSelection();
        utag.loader.SC('utag_preferences', {
          showComponent: 'false',
        });
      });
  }

  toggleSelection(card) {
    const selectedCards = this.shadowRoot.querySelectorAll(
      '.preference-card.selected'
    );
    const maxSelectCard = 3;

    if (card.classList.contains('selected')) {
      card.classList.toggle('selected');
      return;
    }

    if (selectedCards.length < maxSelectCard) {
      card.classList.toggle('selected');
    }
  }

  confirmSelection() {
    const selectedCards = this.shadowRoot.querySelectorAll(
      '.preference-card.selected'
    );
    const selectedTexts = Array.from(selectedCards)
      .map((card) => card.getAttribute('data-value'))
      .join(',');

    utag.link({
      tealium_event: 'send_survey',
      event_name: 'preferences',
      id_sus: b.tealium_random,
      avalId: b['cp.avalId'],
      data: ['{"key":"preferences","value": "' + selectedTexts + '"}'],
    });
    this.closeModal();
  }

  closeModal() {
    utag.loader.SC('utag_preferences', {
      showComponent:'false;exp-7d',
    });
    this.remove();
  }

  getCategories() {
    return [
      {
        value: 'deportes',
        label: 'Deportes',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_68)">
<path opacity="0.1" d="M19.4327 39.6259C29.4854 39.6259 37.6347 31.4766 37.6347 21.424C37.6347 11.3713 29.4854 3.22198 19.4327 3.22198C9.38007 3.22198 1.23077 11.3713 1.23077 21.424C1.23077 31.4766 9.38007 39.6259 19.4327 39.6259Z" fill="#3CDBC0"/>
<path d="M18.0558 4.18746C17.9102 4.18746 17.7899 4.13998 17.6918 4.04184C17.5936 3.94371 17.5461 3.81709 17.5461 3.66514C17.5461 3.5132 17.5936 3.4024 17.6918 3.3106C17.7899 3.2188 17.9102 3.17448 18.0558 3.17448H22.5097C22.6554 3.17448 22.7756 3.22196 22.8738 3.31693C22.9719 3.4119 23.0194 3.53535 23.0194 3.6873C23.0194 3.82659 22.9719 3.94371 22.8738 4.04184C22.7756 4.13998 22.6554 4.18746 22.5097 4.18746H18.0558ZM20.2685 6.38752C20.1007 6.38752 19.9615 6.33371 19.8507 6.22291C19.7399 6.11212 19.6829 5.97283 19.6829 5.79873V1.43026C19.6829 1.26248 19.7399 1.12636 19.857 1.01557C19.971 0.90794 20.1102 0.854126 20.278 0.854126C20.4458 0.854126 20.5914 0.90794 20.699 1.01874C20.8035 1.12636 20.8573 1.26565 20.8573 1.43342V5.80189C20.8573 5.976 20.8035 6.11845 20.6927 6.22608C20.5819 6.33371 20.4426 6.39069 20.2685 6.39069V6.38752Z" fill="#3CDBC0"/>
<path d="M23.548 34.561C24.1599 34.561 24.656 34.0649 24.656 33.453C24.656 32.8411 24.1599 32.3451 23.548 32.3451C22.9361 32.3451 22.4401 32.8411 22.4401 33.453C22.4401 34.0649 22.9361 34.561 23.548 34.561Z" fill="#FFD100"/>
<path d="M20.68 26.4508L20.202 26.4033L20.164 26.397L15.2257 25.9159L13.6525 25.7639L8.13489 25.2226" stroke="#505354" stroke-width="0.316556" stroke-miterlimit="10"/>
<path d="M8.2077 22.0191L8.62239 21.9811L8.30583 22.0127L8.2077 22.0191Z" fill="#E08A7B" stroke="#505354" stroke-width="0.316556" stroke-miterlimit="10"/>
<path d="M9.32197 21.9083L9.13837 21.9273L9.17635 21.9209L9.32197 21.9083Z" fill="#E08A7B" stroke="#505354" stroke-width="0.316556" stroke-miterlimit="10"/>
<path d="M20.6799 20.8066L20.1703 20.851" stroke="#505354" stroke-width="0.316556" stroke-miterlimit="10"/>
<path d="M15.2257 25.9158C14.2602 28.9136 11.4556 31.0789 8.13488 31.0789C4.02282 31.0789 0.679993 27.7455 0.679993 23.624C0.679993 19.5024 4.01966 16.1691 8.13488 16.1691C9.71133 16.1691 11.1802 16.6566 12.3799 17.5018C13.7063 18.4198 14.7224 19.7588 15.2257 21.3321" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M34.8205 23.624C34.8205 24.5072 34.1083 25.2226 33.2219 25.2226C32.3355 25.2226 31.6233 24.5104 31.6233 23.624C31.6233 23.0225 31.9588 22.5002 32.4495 22.2248C32.6806 22.0982 32.9433 22.0254 33.2219 22.0254C34.1051 22.0254 34.8205 22.744 34.8205 23.624Z" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.2252 16.1691C31.9178 16.1691 30.6895 16.5046 29.6259 17.0934C27.3277 18.3691 25.7703 20.8161 25.7703 23.624C25.7703 27.7455 29.1099 31.0789 33.2252 31.0789C37.3404 31.0789 40.68 27.7455 40.68 23.624C40.68 19.5024 37.3467 16.1691 33.2252 16.1691Z" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.73347 23.624C9.73347 24.5072 9.02122 25.2226 8.13486 25.2226C7.24851 25.2226 6.53625 24.5104 6.53625 23.624C6.53625 22.7376 7.25484 22.0254 8.13486 22.0254C8.47041 22.0254 8.78697 22.1299 9.04654 22.3103C9.46123 22.6015 9.73347 23.0827 9.73347 23.624Z" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.1641 26.397L20.2052 26.4034C20.2052 26.4034 20.2179 26.4034 20.2242 26.4097C20.3698 26.435 20.5218 26.4508 20.68 26.4508C21.5506 26.4508 22.3388 26.0551 22.858 25.4284C23.089 25.1498 23.2663 24.8206 23.3803 24.4629C23.4056 24.3774 23.4278 24.2919 23.4467 24.2001C23.4657 24.121 23.4784 24.0355 23.4879 23.95C23.5006 23.8456 23.5069 23.738 23.5069 23.6272C23.5069 22.7503 23.1049 21.9684 22.4781 21.4556C22.3989 21.3891 22.3135 21.329 22.228 21.272H22.2217C21.7785 20.9808 21.2499 20.8098 20.6832 20.8098C20.5123 20.8098 20.3413 20.8225 20.1736 20.8573" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.6971 10.3666C13.3833 10.3666 12.1298 9.84433 11.2054 8.91998" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.6984 20.9966L15.4822 13.0352L14.4059 10.3666H17.9735" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.68 26.4635V26.4508L8.13489 25.2226" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.30585 22.0127L12.3799 17.505L15.422 12.8832H27.3087L32.4527 22.2248" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.9111 12.2913C31.8449 12.2913 32.6015 11.5347 32.6015 10.6009C32.6015 9.66703 31.8449 8.91046 30.9111 8.91046H24.8933L27.3087 12.8864L22.4749 21.4524" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.13489 22.0254L20.1703 20.851" stroke="#505354" stroke-width="0.633112" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_68">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>`,
      },
      {
        value: 'viajes',
        label: 'Viajes',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_211)">
<path opacity="0.1" d="M20.2451 38.7002C30.3796 38.7002 38.5952 30.4846 38.5952 20.3501C38.5952 10.2156 30.3796 2 20.2451 2C10.1106 2 1.89502 10.2156 1.89502 20.3501C1.89502 30.4846 10.1106 38.7002 20.2451 38.7002Z" fill="#3CDBC0"/>
<path d="M17.2612 7.12207C17.1144 7.12207 16.9932 7.0742 16.8942 6.97527C16.7953 6.87634 16.7474 6.74869 16.7474 6.59551C16.7474 6.44232 16.7953 6.33063 16.8942 6.23808C16.9932 6.14553 17.1144 6.10085 17.2612 6.10085H21.7514C21.8982 6.10085 22.0195 6.14872 22.1184 6.24446C22.2173 6.3402 22.2652 6.46466 22.2652 6.61785C22.2652 6.75826 22.2173 6.87634 22.1184 6.97527C22.0195 7.0742 21.8982 7.12207 21.7514 7.12207H17.2612ZM19.492 9.34004C19.3228 9.34004 19.1824 9.28579 19.0707 9.17409C18.959 9.0624 18.9016 8.92198 18.9016 8.74646V4.34243C18.9016 4.17329 18.959 4.03607 19.0771 3.92437C19.1952 3.81587 19.3356 3.75842 19.5047 3.75842C19.6739 3.75842 19.8207 3.81268 19.9292 3.92437C20.0345 4.03288 20.0887 4.17329 20.0887 4.34243V8.74646C20.0887 8.92198 20.0345 9.06559 19.9228 9.17409C19.8111 9.2826 19.6707 9.34004 19.4952 9.34004H19.492Z" fill="#3CDBC0"/>
<path d="M17.0537 36.1471C17.6706 36.1471 18.1707 35.6471 18.1707 35.0302C18.1707 34.4133 17.6706 33.9132 17.0537 33.9132C16.4368 33.9132 15.9368 34.4133 15.9368 35.0302C15.9368 35.6471 16.4368 36.1471 17.0537 36.1471Z" fill="#FFD100"/>
<path d="M29.1457 26.1902C31.5391 25.0445 34.1592 24.451 36.8112 24.451H40.21L31.3604 28.7497C29.902 29.4581 28.3 29.8251 26.6756 29.8251H4.7544C2.24283 29.8251 0.209961 27.7891 0.209961 25.2807C0.209961 22.7723 2.24602 20.7363 4.7544 20.7363H27.8787C28.6382 20.7363 29.3627 20.4363 29.8988 19.9001L32.8476 16.9514C33.3837 16.4152 34.1114 16.1152 34.8677 16.1152H38.0718L34.389 24.4542" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.5387 29.8252L24.6842 25.6796H18.3941L11.6285 29.8252" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.848203 22.9702H3.73315C4.74161 22.9702 5.39582 24.0329 4.94265 24.9328C4.71288 25.3892 4.24376 25.6796 3.73315 25.6796H0.216309" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.52332 23.5095H11.0987" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.4241 23.5095H17.0027" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.2993 23.5095H22.8747" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M26.3405 23.5095H28.9158" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.50232 12.5186C4.50232 14.1685 5.8395 15.5057 7.48941 15.5057H15.9368C17.2293 15.5057 18.2793 14.4557 18.2793 13.1632C18.2793 11.8708 17.2293 10.8112 15.9368 10.8112C15.5379 10.8112 15.1581 10.9102 14.8231 11.0889C14.5933 9.67513 13.3646 8.60284 11.887 8.60284C10.7637 8.60284 9.79354 9.21877 9.27974 10.1315C8.7787 9.75172 8.1564 9.53152 7.4926 9.53152C5.84269 9.53152 4.50551 10.8751 4.50551 12.5186H4.50232Z" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.6119 11.0378C23.6119 12.3239 24.6523 13.3611 25.9384 13.3611H32.5125C33.5178 13.3611 34.338 12.5441 34.338 11.5357C34.338 10.5272 33.521 9.70704 32.5125 9.70704C32.1998 9.70704 31.9062 9.78363 31.6445 9.92405C31.4658 8.82305 30.5084 7.99011 29.3595 7.99011C28.4851 7.99011 27.7287 8.46881 27.3298 9.18047C26.9405 8.88687 26.4554 8.71454 25.9384 8.71454C24.6523 8.71454 23.6119 9.76129 23.6119 11.0378Z" stroke="#505354" stroke-width="0.638264" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_211">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>`,
      },
      {
        value: 'moda',
        label: 'Moda',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_161)">
<path opacity="0.1" d="M22.1113 37.9688C32.0352 37.9688 40.0801 29.9239 40.0801 20C40.0801 10.0761 32.0352 2.03125 22.1113 2.03125C12.1875 2.03125 4.14258 10.0761 4.14258 20C4.14258 29.9239 12.1875 37.9688 22.1113 37.9688Z" fill="#3CDBC0"/>
<path d="M31.0676 18.6094C30.9238 18.6094 30.8051 18.5625 30.7082 18.4656C30.6113 18.3687 30.5645 18.2437 30.5645 18.0937C30.5645 17.9437 30.6113 17.8344 30.7082 17.7437C30.8051 17.6531 30.9238 17.6094 31.0676 17.6094H35.4645C35.6082 17.6094 35.727 17.6562 35.8238 17.75C35.9207 17.8437 35.9676 17.9656 35.9676 18.1156C35.9676 18.2531 35.9207 18.3687 35.8238 18.4656C35.727 18.5625 35.6082 18.6094 35.4645 18.6094H31.0676ZM33.2488 20.7812C33.0832 20.7812 32.9457 20.7281 32.8363 20.6187C32.727 20.5094 32.6707 20.3719 32.6707 20.2V15.8875C32.6707 15.7219 32.727 15.5875 32.8426 15.4781C32.9582 15.3719 33.0957 15.3156 33.2613 15.3156C33.427 15.3156 33.5707 15.3687 33.677 15.4781C33.7801 15.5844 33.8332 15.7219 33.8332 15.8875V20.2C33.8332 20.3719 33.7801 20.5125 33.6707 20.6187C33.5613 20.725 33.4238 20.7812 33.252 20.7812H33.2488Z" fill="#3CDBC0"/>
<path d="M1.17383 30.7812C1.77789 30.7812 2.26758 30.2916 2.26758 29.6875C2.26758 29.0834 1.77789 28.5938 1.17383 28.5938C0.569767 28.5938 0.0800781 29.0834 0.0800781 29.6875C0.0800781 30.2916 0.569767 30.7812 1.17383 30.7812Z" fill="#FFD100"/>
<path d="M8.50503 4.9906V13.9218C8.50503 15.3656 8.31127 16.8 7.9269 18.1906L7.35816 20.2468C6.97378 21.6375 6.78003 23.0719 6.78003 24.5156V37.2625H14.0144V30.3218L21.355 36.0844C22.3269 36.8469 23.5269 37.2625 24.7613 37.2625H33.3894C33.9457 37.2625 34.4956 37.1781 35.0269 37.0125L38.4925 35.9312C38.8238 35.8281 39.0488 35.5187 39.0488 35.1687V32.2219C39.0488 30.5375 37.7613 29.1062 36.0925 29.0187C34.3988 28.9312 32.2738 28.4687 30.5519 26.9656C28.605 25.2687 26.6613 22.9437 25.3363 21.2406C24.2457 19.8406 23.6613 18.1156 23.6613 16.3344V4.9906H8.50191H8.50503Z" stroke="#505354" stroke-width="0.625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.7832 26.8438H13.0269C14.1676 26.8438 15.2801 27.2 16.2145 27.8594L22.5707 32.3625C23.5051 33.025 24.6176 33.3781 25.7582 33.3781H33.4863C33.8863 33.3781 34.2863 33.3344 34.6801 33.2469L39.0582 32.275" stroke="#505354" stroke-width="0.625" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_161">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'salud',
        label: 'Salud',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_44)">
<path opacity="0.1" d="M20.018 40.018C30.7975 40.018 39.536 31.2795 39.536 20.5C39.536 9.7205 30.7975 0.981995 20.018 0.981995C9.2385 0.981995 0.5 9.7205 0.5 20.5C0.5 31.2795 9.2385 40.018 20.018 40.018Z" fill="#3CDBC0"/>
<path d="M35.1775 15.595C35.0213 15.595 34.8924 15.5441 34.7871 15.4389C34.6819 15.3336 34.631 15.1979 34.631 15.0349C34.631 14.872 34.6819 14.7532 34.7871 14.6547C34.8924 14.5563 35.0213 14.5088 35.1775 14.5088H39.9535C40.1096 14.5088 40.2386 14.5597 40.3438 14.6615C40.449 14.7634 40.5 14.8958 40.5 15.0587C40.5 15.208 40.449 15.3336 40.3438 15.4389C40.2386 15.5441 40.1096 15.595 39.9535 15.595H35.1775ZM37.5468 17.9541C37.3669 17.9541 37.2175 17.8964 37.0987 17.7776C36.9799 17.6588 36.9188 17.5095 36.9188 17.3228V12.6385C36.9188 12.4585 36.9799 12.3126 37.1055 12.1938C37.2311 12.0784 37.3805 12.0173 37.5604 12.0173C37.7403 12.0173 37.8964 12.075 38.0118 12.1938C38.1239 12.3092 38.1816 12.4585 38.1816 12.6385V17.3228C38.1816 17.5095 38.1239 17.6622 38.005 17.7776C37.8862 17.893 37.7369 17.9541 37.5502 17.9541H37.5468Z" fill="#3CDBC0"/>
<path d="M6.77973 23.7247C7.43587 23.7247 7.96778 23.1928 7.96778 22.5366C7.96778 21.8805 7.43587 21.3486 6.77973 21.3486C6.12358 21.3486 5.59167 21.8805 5.59167 22.5366C5.59167 23.1928 6.12358 23.7247 6.77973 23.7247Z" fill="#FFD100"/>
<path d="M24.037 25.4253H24.7125C29.7736 25.4253 33.8775 30.0791 33.8775 34.9603V37.6928" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.83673 37.6894V34.9569C8.83673 30.0757 12.9372 25.4219 18.0085 25.4219H19.0777" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.0214 37.6928C15.775 37.6928 16.386 37.1031 16.386 36.3758C16.386 35.6484 15.775 35.0587 15.0214 35.0587C14.2678 35.0587 13.6569 35.6484 13.6569 36.3758C13.6569 37.1031 14.2678 37.6928 15.0214 37.6928Z" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.1599 25.7953C27.1599 25.7953 28.1409 28.925 27.9474 31.9358" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M29.5055 37.6894H30.8666V34.7498C30.8666 33.1952 29.5598 31.9359 27.9474 31.9359C26.3351 31.9359 25.0282 33.1952 25.0282 34.7498V37.6894H26.5217" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.3859 25.5848C16.3859 25.5848 13.0085 29.4375 15.0214 35.0587" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.7268 17.3465C28.3887 17.3941 28.925 17.8625 28.925 18.504C28.925 19.1456 28.3887 19.6615 27.7268 19.6615V19.9738C27.7268 23.2596 24.9637 25.9243 21.5557 25.9243C18.1477 25.9243 15.3846 23.2596 15.3846 19.9738V19.6615C14.7227 19.6615 14.1864 19.1456 14.1864 18.504C14.1864 17.8625 14.7227 17.3465 15.3846 17.3465C15.3846 17.3465 19.8178 16.3655 20.3778 13.3649C20.3778 13.3649 23.7044 17.058 27.7302 17.3465H27.7268Z" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.908 19.9026C24.4386 19.9026 24.8686 19.4877 24.8686 18.9759C24.8686 18.4641 24.4386 18.0492 23.908 18.0492C23.3775 18.0492 22.9474 18.4641 22.9474 18.9759C22.9474 19.4877 23.3775 19.9026 23.908 19.9026Z" fill="#505354"/>
<path d="M18.9148 19.9026C19.4454 19.9026 19.8755 19.4877 19.8755 18.9759C19.8755 18.4641 19.4454 18.0492 18.9148 18.0492C18.3843 18.0492 17.9542 18.4641 17.9542 18.9759C17.9542 19.4877 18.3843 19.9026 18.9148 19.9026Z" fill="#505354"/>
<path d="M19.7974 22.5502C20.2115 22.9474 20.7817 23.1952 21.4097 23.1952C22.0377 23.1952 22.6113 22.9474 23.0221 22.5502" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.8055 24.2814L30.853 23.6907C30.853 23.6907 32.4619 15.4355 26.5794 11.0397H16.3859C10.5033 15.4355 12.1123 23.6907 12.1123 23.6907L17.299 24.2814" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.4844 5.38794V7.9134" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.7947 6.6507H20.1742" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M26.6677 11.0397L28.219 4.59707C28.219 4.59707 21.5218 0.191091 14.8347 4.59707L16.386 11.0397" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.629 25.4762C25.6155 27.9847 23.589 30.5237 21.5998 30.5237C19.5903 30.5237 17.6046 28.0017 17.6216 25.4694" stroke="#505354" stroke-width="0.678887" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_44">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'belleza',
        label: 'Belleza',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_176)">
<path opacity="0.1" d="M20.5801 39.8701C31.6258 39.8701 40.5801 30.9158 40.5801 19.8701C40.5801 8.82442 31.6258 -0.129883 20.5801 -0.129883C9.53438 -0.129883 0.580078 8.82442 0.580078 19.8701C0.580078 30.9158 9.53438 39.8701 20.5801 39.8701Z" fill="#3CDBC0"/>
<path d="M4.80963 16.2354C4.64963 16.2354 4.51747 16.1832 4.40964 16.0754C4.30182 15.9675 4.24963 15.8284 4.24963 15.6614C4.24963 15.4945 4.30182 15.3728 4.40964 15.2719C4.51747 15.171 4.64963 15.1223 4.80963 15.1223H9.70354C9.86354 15.1223 9.99573 15.1745 10.1036 15.2788C10.2114 15.3832 10.2636 15.5188 10.2636 15.6858C10.2636 15.8388 10.2114 15.9675 10.1036 16.0754C9.99573 16.1832 9.86354 16.2354 9.70354 16.2354H4.80963ZM7.23747 18.6528C7.05312 18.6528 6.90008 18.5936 6.77834 18.4719C6.6566 18.3501 6.59398 18.1971 6.59398 18.0058V13.2058C6.59398 13.0214 6.6566 12.8719 6.7853 12.7501C6.914 12.6319 7.06703 12.5693 7.25137 12.5693C7.43572 12.5693 7.59573 12.6284 7.71399 12.7501C7.82877 12.8684 7.8879 13.0214 7.8879 13.2058V18.0058C7.8879 18.1971 7.82877 18.3536 7.70703 18.4719C7.58529 18.5901 7.43226 18.6528 7.24095 18.6528H7.23747Z" fill="#3CDBC0"/>
<path d="M34.8409 22.131C35.5133 22.131 36.0583 21.586 36.0583 20.9136C36.0583 20.2413 35.5133 19.6962 34.8409 19.6962C34.1686 19.6962 33.6235 20.2413 33.6235 20.9136C33.6235 21.586 34.1686 22.131 34.8409 22.131Z" fill="#FFD100"/>
<path d="M16.1836 8.61444H24.9141C25.3175 8.61444 25.648 8.96227 25.648 9.39357V13.0666C25.648 13.4979 25.321 13.8457 24.9141 13.8457H16.1836C15.7801 13.8457 15.4497 13.4979 15.4497 13.0666V9.39357C15.4497 8.96227 15.7767 8.61444 16.1836 8.61444Z" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M24.1801 13.8458V15.9884C24.1801 16.4023 24.3331 16.7988 24.6114 17.091L27.8183 20.4962C28.0931 20.7884 28.2496 21.1849 28.2496 21.5988V34.6979C28.2496 35.1118 28.0966 35.5084 27.8183 35.8005L26.6566 37.0353C26.3818 37.3275 26.0096 37.491 25.6201 37.491H15.4844C15.0949 37.491 14.7227 37.3275 14.4479 37.0353L13.2862 35.8005C13.0114 35.5084 12.8549 35.1118 12.8549 34.6979V21.5988C12.8549 21.1849 13.0079 20.7884 13.2862 20.4962L16.4931 17.091C16.7679 16.7988 16.9244 16.4023 16.9244 15.9884V13.8458" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.8949 8.61446V4.38142C17.8949 2.82663 19.081 1.56403 20.5488 1.56403C22.0131 1.56403 23.2027 2.82663 23.2027 4.38142V8.61446" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.6462 28.9554C22.8654 29.7136 22.7471 30.5832 22.2184 31.1467C21.8428 31.5467 21.321 31.7936 20.7436 31.7936C20.1662 31.7936 19.648 31.5467 19.2688 31.1467C18.7401 30.5832 18.6184 29.7171 18.841 28.9554L20.7436 23.3936L22.6462 28.9554Z" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.2793 20.4962H27.8149" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.8514 34.6945H28.2462" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_176">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'regalos',
        label: 'Regalos',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_92)">
<path opacity="0.1" d="M19.3016 38.0987C29.0101 38.0987 36.8803 30.2285 36.8803 20.52C36.8803 10.8115 29.0101 2.94128 19.3016 2.94128C9.59316 2.94128 1.7229 10.8115 1.7229 20.52C1.7229 30.2285 9.59316 38.0987 19.3016 38.0987Z" fill="#3CDBC0"/>
<path d="M35.7063 22.8282C35.5657 22.8282 35.4495 22.7823 35.3547 22.6875C35.26 22.5927 35.2141 22.4705 35.2141 22.3237C35.2141 22.177 35.26 22.07 35.3547 21.9813C35.4495 21.8927 35.5657 21.8499 35.7063 21.8499H40.0078C40.1484 21.8499 40.2646 21.8957 40.3593 21.9874C40.4541 22.0791 40.5 22.1984 40.5 22.3451C40.5 22.4796 40.4541 22.5927 40.3593 22.6875C40.2646 22.7823 40.1484 22.8282 40.0078 22.8282H35.7063ZM37.8402 24.9529C37.6782 24.9529 37.5437 24.9009 37.4367 24.7939C37.3297 24.6869 37.2746 24.5524 37.2746 24.3842V20.1654C37.2746 20.0033 37.3297 19.8719 37.4428 19.7649C37.5559 19.6609 37.6904 19.6059 37.8524 19.6059C38.0145 19.6059 38.1551 19.6579 38.2591 19.7649C38.3599 19.8688 38.4119 20.0033 38.4119 20.1654V24.3842C38.4119 24.5524 38.3599 24.69 38.2529 24.7939C38.1459 24.8979 38.0114 24.9529 37.8433 24.9529H37.8402Z" fill="#3CDBC0"/>
<path d="M1.57001 20.3671C2.16096 20.3671 2.64002 19.8881 2.64002 19.2971C2.64002 18.7062 2.16096 18.2271 1.57001 18.2271C0.979059 18.2271 0.5 18.7062 0.5 19.2971C0.5 19.8881 0.979059 20.3671 1.57001 20.3671Z" fill="#FFD100"/>
<path d="M23.7161 13.4854H34.0738C34.6975 13.4854 35.2019 12.981 35.2019 12.3573V9.43468C35.2019 8.81101 34.6975 8.30658 34.0738 8.30658H6.10991C5.48624 8.30658 4.98181 8.81101 4.98181 9.43468V12.3573C4.98181 12.981 5.48624 13.4854 6.10991 13.4854H16.4706" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.7162 30.416V33.73H19.5676H16.4677V30.3854" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4677 16.9645V8.30963H23.7162V16.9675" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4676 8.30966L12.5361 4.79086C11.5272 3.90733 9.94666 4.62271 9.94666 5.96481L10.5092 8.30966" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.7162 8.30966L27.6477 4.79086C28.6566 3.90733 30.2371 4.62271 30.2371 5.96481L29.6746 8.30966" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.7161 8.34331C23.7161 6.86059 22.0927 5.65912 20.0903 5.65912C18.0878 5.65912 16.4645 6.86059 16.4645 8.34331" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.57153 13.4854V32.6019C6.57153 33.2255 7.07597 33.73 7.69963 33.73H32.481C33.1047 33.73 33.6091 33.2255 33.6091 32.6019V13.4854" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.6562 22.1617C20.2127 25.4328 18.8981 29.5019 18.3203 31.0641C18.2041 31.376 17.8128 31.4677 17.5651 31.2476C15.9265 29.7954 14.4285 29.2482 13.5358 29.0434C13.1475 28.9547 12.9794 28.5084 13.1995 28.1782C14.829 25.7294 16.5807 21.7642 16.5807 21.7642L18.2897 21.2017" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.5733 22.1556C20.0169 25.4267 21.3315 29.5019 21.9093 31.0611C22.0255 31.3729 22.4168 31.4646 22.6644 31.2445C24.3031 29.7924 25.8011 29.2451 26.6968 29.0403C27.0851 28.9517 27.2533 28.5053 27.0331 28.1751C25.4037 25.7294 23.658 21.7765 23.658 21.7765L21.8971 21.1956" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.766 17.0348H19.4178C18.7947 17.0348 18.2897 17.5399 18.2897 18.1629V21.0366C18.2897 21.6597 18.7947 22.1647 19.4178 22.1647H20.766C21.389 22.1647 21.8941 21.6597 21.8941 21.0366V18.1629C21.8941 17.5399 21.389 17.0348 20.766 17.0348Z" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.5807 21.7612L13.0711 22.9168C11.9766 23.2775 10.8516 22.4613 10.8516 21.3118V17.0929C10.8516 15.8731 12.105 15.0538 13.2239 15.5429L18.3508 17.796" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.655 21.7765L27.1096 22.9168C28.204 23.2775 29.3291 22.4613 29.3291 21.3118V17.0929C29.3291 15.8731 28.0756 15.0538 26.9567 15.5429L21.8298 17.793" stroke="#505354" stroke-width="0.611434" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_92">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'educacion',
        label: 'Educación',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_560)">
<path opacity="0.1" d="M19.3789 33.6659C27.5299 33.6659 34.1376 27.0582 34.1376 18.9072C34.1376 10.7561 27.5299 4.14844 19.3789 4.14844C11.2279 4.14844 4.62018 10.7561 4.62018 18.9072C4.62018 27.0582 11.2279 33.6659 19.3789 33.6659Z" fill="#3CDBC0"/>
<path d="M35.9754 13.4015C35.8573 13.4015 35.7598 13.363 35.6802 13.2834C35.6006 13.2039 35.5621 13.1012 35.5621 12.978C35.5621 12.8548 35.6006 12.765 35.6802 12.6905C35.7598 12.6161 35.8573 12.5801 35.9754 12.5801H39.5868C39.7048 12.5801 39.8024 12.6186 39.882 12.6957C39.9615 12.7727 40 12.8728 40 12.996C40 13.1089 39.9615 13.2039 39.882 13.2834C39.8024 13.363 39.7048 13.4015 39.5868 13.4015H35.9754ZM37.767 15.1854C37.6309 15.1854 37.518 15.1417 37.4282 15.0519C37.3383 14.9621 37.2921 14.8491 37.2921 14.708V11.1659C37.2921 11.0298 37.3383 10.9195 37.4333 10.8296C37.5283 10.7424 37.6412 10.6962 37.7772 10.6962C37.9133 10.6962 38.0313 10.7398 38.1186 10.8296C38.2033 10.9169 38.2469 11.0298 38.2469 11.1659V14.708C38.2469 14.8491 38.2033 14.9646 38.1135 15.0519C38.0236 15.1392 37.9107 15.1854 37.7695 15.1854H37.767Z" fill="#3CDBC0"/>
<path d="M0.898418 22.3723C1.39457 22.3723 1.79677 21.9701 1.79677 21.4739C1.79677 20.9778 1.39457 20.5756 0.898418 20.5756C0.402269 20.5756 6.10352e-05 20.9778 6.10352e-05 21.4739C6.10352e-05 21.9701 0.402269 22.3723 0.898418 22.3723Z" fill="#FFD100"/>
<path d="M19.4559 35.4215C19.1685 35.2727 15.7932 33.4683 19.4765 29.7619L11.4631 27.4159" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.96825 26.6894L2.73878 24.8645C1.93283 25.0082 -0.621075 27.9805 2.64124 30.2957L3.32143 30.5036" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.4765 35.4292L19.4559 35.4215L7.3692 31.7357" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.4816 29.7645L37.6874 21.4406" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M27.4205 18.0858L37.6848 21.4354C34.8999 24.8363 37.6848 27.1028 37.6848 27.1028L19.479 35.4292" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.093 20.0544L11.0525 20.9887" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.31219 21.787L2.73877 24.8645" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.1161 17.7521H18.1084" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.32141 28.0679L7.36659 28.7609V35.4318L5.344 32.5468L3.32141 34.3949V28.0679Z" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.1618 18.6299L7.27423 13.1397L20.1618 7.22852L33.0494 13.1397L20.1618 18.6299Z" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.6654 15.863L12.8338 21.9153C12.7927 22.2156 12.8903 22.5159 13.1007 22.729C14.456 24.1073 19.8898 28.6966 27.4205 22.6982C27.6721 22.498 27.803 22.1746 27.7722 21.8511L27.187 15.6371" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.167 13.8507C20.9523 13.8507 21.5889 13.4807 21.5889 13.0242C21.5889 12.5678 20.9523 12.1978 20.167 12.1978C19.3816 12.1978 18.745 12.5678 18.745 13.0242C18.745 13.4807 19.3816 13.8507 20.167 13.8507Z" stroke="#505354" stroke-width="0.513347" stroke-miterlimit="10"/>
<path d="M18.7449 13.0242L10.1694 14.3743V20.3933" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.1695 22.3389C10.6982 22.3389 11.1269 21.9034 11.1269 21.3661C11.1269 20.8288 10.6982 20.3933 10.1695 20.3933C9.64073 20.3933 9.2121 20.8288 9.2121 21.3661C9.2121 21.9034 9.64073 22.3389 10.1695 22.3389Z" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.7111 22.1643L11.5401 26.8358C11.6454 27.4287 11.1962 27.9703 10.6058 27.9703H9.87687C9.29679 27.9703 8.85275 27.4466 8.93745 26.864L9.62533 22.1643" stroke="#505354" stroke-width="0.513347" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_560">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'pet',
        label: 'Pet',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_477)">
<path opacity="0.1" d="M19.2821 40.24C28.7278 40.24 36.385 32.5828 36.385 23.1371C36.385 13.6914 28.7278 6.03418 19.2821 6.03418C9.83643 6.03418 2.1792 13.6914 2.1792 23.1371C2.1792 32.5828 9.83643 40.24 19.2821 40.24Z" fill="#3CDBC0"/>
<path d="M20.9656 3.37205C20.8288 3.37205 20.7157 3.32744 20.6235 3.23523C20.5313 3.14302 20.4867 3.02405 20.4867 2.88128C20.4867 2.7385 20.5313 2.6344 20.6235 2.54814C20.7157 2.46188 20.8288 2.42024 20.9656 2.42024H25.1506C25.2874 2.42024 25.4004 2.46486 25.4926 2.55409C25.5848 2.64332 25.6295 2.75932 25.6295 2.9021C25.6295 3.03297 25.5848 3.14302 25.4926 3.23523C25.4004 3.32744 25.2874 3.37205 25.1506 3.37205H20.9656ZM23.0417 5.43928C22.8841 5.43928 22.7532 5.38871 22.6491 5.28461C22.545 5.1805 22.4915 5.04963 22.4915 4.88603V0.781335C22.4915 0.62369 22.545 0.49579 22.655 0.391686C22.7621 0.290555 22.896 0.23999 23.0506 0.23999C23.2053 0.23999 23.3451 0.290555 23.4462 0.39466C23.5444 0.49579 23.595 0.626665 23.595 0.784309V4.88901C23.595 5.0526 23.5444 5.18645 23.4403 5.28758C23.3362 5.38871 23.2053 5.44225 23.0417 5.44225V5.43928Z" fill="#3CDBC0"/>
<path d="M9.76395 36.9681C10.3389 36.9681 10.805 36.502 10.805 35.927C10.805 35.3521 10.3389 34.886 9.76395 34.886C9.18899 34.886 8.7229 35.3521 8.7229 35.927C8.7229 36.502 9.18899 36.9681 9.76395 36.9681Z" fill="#FFD100"/>
<path d="M20.454 37.7295C7.4707 30.1686 3.65452 22.8366 2.79491 17.8812C2.10484 13.9014 4.07986 9.7908 7.63429 8.1043C15.4719 4.38033 20.454 13.6665 20.454 13.6665C20.454 13.6665 25.4362 4.3833 33.2738 8.1043C36.8282 9.7908 38.8032 13.9014 38.1132 17.8812C37.2536 22.8336 33.4374 30.1686 20.454 37.7295Z" stroke="#505354" stroke-width="0.594884" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.4136 23.4702C19.6302 22.5541 21.278 22.5541 22.4915 23.4702C25.1031 25.4392 25.9746 27.2715 26.2006 28.5891C26.4267 29.886 25.7813 31.2245 24.6242 31.7718C23.1876 32.4529 22.0484 31.1918 21.3226 30.7307C20.7932 30.3916 20.1061 30.3916 19.5766 30.7307C18.8538 31.1918 17.7117 32.4559 16.275 31.7718C15.118 31.2215 14.4755 29.886 14.6986 28.5891C14.9276 27.2715 15.7961 25.4392 18.4077 23.4702H18.4136Z" stroke="#505354" stroke-width="0.594884" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.9133 19.7179C19.719 18.9973 19.5696 17.5158 18.5795 16.4089C17.5895 15.302 16.1338 14.9889 15.3282 15.7095C14.5225 16.4301 14.6719 17.9116 15.662 19.0185C16.652 20.1253 18.1077 20.4385 18.9133 19.7179Z" stroke="#505354" stroke-width="0.594884" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.4915 23.835C15.1319 23.2623 15.0136 22.0853 14.2272 21.2061C13.4409 20.327 12.2844 20.0786 11.644 20.6514C11.0036 21.2242 11.1219 22.4012 11.9082 23.2803C12.6946 24.1594 13.8511 24.4078 14.4915 23.835Z" stroke="#505354" stroke-width="0.594884" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28.9975 23.284C29.7838 22.4048 29.9021 21.2278 29.2618 20.6551C28.6214 20.0823 27.4648 20.3307 26.6785 21.2098C25.8922 22.089 25.7739 23.266 26.4143 23.8387C27.0546 24.4115 28.2112 24.1631 28.9975 23.284Z" stroke="#505354" stroke-width="0.594884" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.3947 19.0204C26.3847 17.9135 26.5342 16.4321 25.7285 15.7115C24.9228 14.9908 23.4672 15.304 22.4771 16.4109C21.4871 17.5177 21.3377 18.9992 22.1434 19.7198C22.949 20.4404 24.4047 20.1273 25.3947 19.0204Z" stroke="#505354" stroke-width="0.594884" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_477">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'comida',
        label: 'Comida',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_194)">
<path opacity="0.1" d="M20.74 39.98C31.7857 39.98 40.74 31.0257 40.74 19.98C40.74 8.93429 31.7857 -0.0200195 20.74 -0.0200195C9.6943 -0.0200195 0.73999 8.93429 0.73999 19.98C0.73999 31.0257 9.6943 39.98 20.74 39.98Z" fill="#3CDBC0"/>
<path d="M34.5313 9.73652C34.3713 9.73652 34.2391 9.68435 34.1313 9.57652C34.0235 9.4687 33.9713 9.32957 33.9713 9.16261C33.9713 8.99565 34.0235 8.87391 34.1313 8.77304C34.2391 8.67217 34.3713 8.62348 34.5313 8.62348H39.4252C39.5852 8.62348 39.7174 8.67565 39.8252 8.78C39.933 8.88435 39.9852 9.02 39.9852 9.18696C39.9852 9.34 39.933 9.4687 39.8252 9.57652C39.7174 9.68435 39.5852 9.73652 39.4252 9.73652H34.5313ZM36.9626 12.1539C36.7783 12.1539 36.6252 12.0948 36.5035 11.973C36.3817 11.8513 36.3191 11.6983 36.3191 11.507V6.70696C36.3191 6.52261 36.3817 6.37304 36.5104 6.2513C36.6391 6.13304 36.7922 6.07043 36.9765 6.07043C37.1609 6.07043 37.3209 6.12957 37.4391 6.2513C37.5539 6.36957 37.6131 6.52261 37.6131 6.70696V11.507C37.6131 11.6983 37.5539 11.8548 37.4322 11.973C37.3104 12.0913 37.1574 12.1539 36.9661 12.1539H36.9626Z" fill="#3CDBC0"/>
<path d="M15.1748 35.8061C15.8471 35.8061 16.3922 35.2611 16.3922 34.5887C16.3922 33.9164 15.8471 33.3713 15.1748 33.3713C14.5024 33.3713 13.9574 33.9164 13.9574 34.5887C13.9574 35.2611 14.5024 35.8061 15.1748 35.8061Z" fill="#FFD100"/>
<path d="M5.40088 15.7087V25.7783C5.40088 26.3974 5.82522 26.94 6.43391 27.0931L36.1557 34.5992C37.0252 34.8183 37.8704 34.1714 37.8704 33.2844V23.6253L5.40088 15.7087Z" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.40088 22.4878L37.8739 30.6861" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.40088 19.1801L37.8739 27.3783" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.40088 15.7087C6.9661 7.2496 17.9226 5.31568 20.893 4.94699C21.3522 4.89134 21.8044 5.06525 22.107 5.41307L37.8704 23.6287" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.754 10.2792C17.4531 9.91049 17.2409 8.84614 16.5244 8.97136C15.5435 9.1418 14.6566 11.3505 15.3175 13.1001C15.8079 14.394 16.9696 14.9714 17.2688 15.114C17.3592 15.1557 19.3662 16.074 21.0496 15.0201C23.074 13.7505 23.2444 10.5018 22.3088 9.86527C21.5609 9.35397 20.4548 10.7627 18.7505 10.2827L18.754 10.2792Z" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.7539 10.2792C18.7539 10.2792 18.9973 5.30524 15.0878 2.1748" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_194">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'eventos',
        label: 'Eventos',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_237)">
<path opacity="0.1" d="M18.8105 39.8701C29.8562 39.8701 38.8105 30.9158 38.8105 19.8701C38.8105 8.82442 29.8562 -0.129883 18.8105 -0.129883C7.76479 -0.129883 -1.18951 8.82442 -1.18951 19.8701C-1.18951 30.9158 7.76479 39.8701 18.8105 39.8701Z" fill="#3CDBC0"/>
<path d="M35.7358 17.9744C35.5758 17.9744 35.4436 17.9223 35.3358 17.8144C35.228 17.7066 35.1758 17.5675 35.1758 17.4005C35.1758 17.2336 35.228 17.1118 35.3358 17.011C35.4436 16.9101 35.5758 16.8614 35.7358 16.8614H40.6297C40.7897 16.8614 40.9219 16.9136 41.0297 17.0179C41.1375 17.1223 41.1897 17.2579 41.1897 17.4249C41.1897 17.5779 41.1375 17.7066 41.0297 17.8144C40.9219 17.9223 40.7897 17.9744 40.6297 17.9744H35.7358ZM38.1636 20.3918C37.9793 20.3918 37.8262 20.3327 37.7045 20.211C37.5827 20.0892 37.5201 19.9362 37.5201 19.7449V14.9449C37.5201 14.7605 37.5828 14.611 37.7114 14.4892C37.8401 14.371 37.9932 14.3083 38.1775 14.3083C38.3619 14.3083 38.5219 14.3675 38.6401 14.4892C38.7549 14.6075 38.814 14.7605 38.814 14.9449V19.7449C38.814 19.9362 38.7549 20.0927 38.6332 20.211C38.5114 20.3292 38.3584 20.3918 38.1671 20.3918H38.1636Z" fill="#3CDBC0"/>
<path d="M0.0278771 20.3918C0.700224 20.3918 1.24527 19.8468 1.24527 19.1744C1.24527 18.5021 0.700224 17.957 0.0278771 17.957C-0.64447 17.957 -1.18951 18.5021 -1.18951 19.1744C-1.18951 19.8468 -0.64447 20.3918 0.0278771 20.3918Z" fill="#FFD100"/>
<path d="M27.8679 36.1763L36.0975 34.0476L31.3392 32.7954L27.8679 36.1763Z" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M31.3392 32.7954L28.7653 23.5293" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.6992 8.38843L27.9131 6.5206C28.1949 6.44756 28.4836 6.60756 28.5566 6.87886L31.4923 17.4597C32.2575 20.2215 31.0366 22.938 28.7653 23.5258C26.494 24.1136 24.0279 22.3502 23.2627 19.5884L20.327 9.00756C20.2505 8.73625 20.4175 8.45799 20.6992 8.38495V8.38843Z" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.7931 10.6945H29.614" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.69051 36.1519L1.46094 34.0232L6.2192 32.771L9.69051 36.1519Z" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.21918 32.771L8.78962 23.5015" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.8557 8.36401L9.64181 6.49619C9.36007 6.42314 9.07136 6.58314 8.99832 6.85445L6.06266 17.4353C5.29745 20.1971 6.51832 22.9136 8.78963 23.5014C11.0609 24.0892 13.527 22.3258 14.2922 19.564L17.2279 8.98314C17.3044 8.71184 17.1375 8.43358 16.8557 8.36053V8.36401Z" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.7618 10.6702H7.94092" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.814 4.32579V0.256226" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.0453 4.92058L14.9949 0.854492" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.5826 4.92058L22.6366 0.854492" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_237">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'entretenimiento',
        label: 'Entretenimiento',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_27)">
<path opacity="0.1" d="M20.0801 40.5C31.1258 40.5 40.0801 31.5457 40.0801 20.5C40.0801 9.45431 31.1258 0.5 20.0801 0.5C9.03438 0.5 0.0800781 9.45431 0.0800781 20.5C0.0800781 31.5457 9.03438 40.5 20.0801 40.5Z" fill="#3CDBC0"/>
<path d="M31.0922 10.9522C30.9322 10.9522 30.8 10.9 30.6922 10.7922C30.5844 10.6844 30.5322 10.5453 30.5322 10.3783C30.5322 10.2114 30.5844 10.0896 30.6922 9.98874C30.8 9.88787 30.9322 9.83918 31.0922 9.83918H35.9861C36.1461 9.83918 36.2783 9.89135 36.3861 9.9957C36.494 10.1 36.5461 10.2357 36.5461 10.4027C36.5461 10.5557 36.494 10.6844 36.3861 10.7922C36.2783 10.9 36.1461 10.9522 35.9861 10.9522H31.0922ZM33.5201 13.3696C33.3357 13.3696 33.1827 13.3105 33.0609 13.1887C32.9392 13.067 32.8766 12.914 32.8766 12.7227V7.92266C32.8766 7.73831 32.9392 7.58874 33.0679 7.467C33.1966 7.34874 33.3496 7.28613 33.534 7.28613C33.7183 7.28613 33.8783 7.34526 33.9966 7.467C34.1114 7.58526 34.1705 7.73831 34.1705 7.92266V12.7227C34.1705 12.914 34.1114 13.0705 33.9896 13.1887C33.8679 13.307 33.7148 13.3696 33.5235 13.3696H33.5201Z" fill="#3CDBC0"/>
<path d="M1.99315 19.2826C2.66549 19.2826 3.21054 18.7375 3.21054 18.0652C3.21054 17.3928 2.66549 16.8478 1.99315 16.8478C1.3208 16.8478 0.775757 17.3928 0.775757 18.0652C0.775757 18.7375 1.3208 19.2826 1.99315 19.2826Z" fill="#FFD100"/>
<path d="M19.6836 35.2826L19.1236 36.8061H10.8836L8.32705 29.8078C7.83662 28.4756 7.59314 27.0669 7.59314 25.6513C7.59314 23.4982 8.16705 21.38 9.25575 19.5191L11.9584 14.9243H18.0523L19.7462 17.8043" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.0522 14.9209V11.9156H11.9548V14.9209" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.9549 11.9156C11.9549 10.8582 11.8819 9.95388 11.7949 9.24084C11.6801 8.32954 11.381 7.46693 11.054 6.6078C10.7549 5.82867 10.6853 4.93475 10.9184 4.01997C11.3114 2.48606 12.5914 1.2791 14.1462 0.973014C16.8488 0.437361 19.2245 2.49649 19.2245 5.11562C19.2245 5.67214 19.1166 6.20432 18.9219 6.69127C18.6366 7.40432 18.3758 8.1278 18.2645 8.88953C18.1532 9.65127 18.0523 10.6774 18.0523 11.9156" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.1827 23.213C26.0952 23.213 26.8349 22.4733 26.8349 21.5609C26.8349 20.6484 26.0952 19.9087 25.1827 19.9087C24.2702 19.9087 23.5305 20.6484 23.5305 21.5609C23.5305 22.4733 24.2702 23.213 25.1827 23.213Z" stroke="#505354" stroke-width="0.695652" stroke-miterlimit="10"/>
<path d="M26.1566 28.9347C27.069 28.9347 27.8087 28.195 27.8087 27.2825C27.8087 26.3701 27.069 25.6304 26.1566 25.6304C25.2441 25.6304 24.5044 26.3701 24.5044 27.2825C24.5044 28.195 25.2441 28.9347 26.1566 28.9347Z" stroke="#505354" stroke-width="0.695652" stroke-miterlimit="10"/>
<path d="M20.4453 26.5174C21.3577 26.5174 22.0974 25.7777 22.0974 24.8652C22.0974 23.9527 21.3577 23.213 20.4453 23.213C19.5328 23.213 18.7931 23.9527 18.7931 24.8652C18.7931 25.7777 19.5328 26.5174 20.4453 26.5174Z" stroke="#505354" stroke-width="0.695652" stroke-miterlimit="10"/>
<path d="M25.0609 36.806C30.7202 36.806 35.3079 32.2183 35.3079 26.5591C35.3079 20.8999 30.7202 16.3121 25.0609 16.3121C19.4017 16.3121 14.814 20.8999 14.814 26.5591C14.814 32.2183 19.4017 36.806 25.0609 36.806Z" stroke="#505354" stroke-width="0.695652" stroke-miterlimit="10"/>
</g>
<defs>
<clipPath id="clip0_200_27">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
      {
        value: 'ahorro',
        label: 'Ahorro',
        icon: `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_200_546)">
<path opacity="0.1" d="M20.5801 40.52C31.6258 40.52 40.5801 31.5657 40.5801 20.52C40.5801 9.47433 31.6258 0.52002 20.5801 0.52002C9.53438 0.52002 0.580078 9.47433 0.580078 20.52C0.580078 31.5657 9.53438 40.52 20.5801 40.52Z" fill="#3CDBC0"/>
<path d="M34.027 11.32C33.867 11.32 33.7349 11.2678 33.627 11.16C33.5192 11.0522 33.467 10.9131 33.467 10.7461C33.467 10.5791 33.5192 10.4574 33.627 10.3565C33.7349 10.2557 33.867 10.207 34.027 10.207H38.921C39.081 10.207 39.2131 10.2591 39.321 10.3635C39.4288 10.4678 39.481 10.6035 39.481 10.7705C39.481 10.9235 39.4288 11.0522 39.321 11.16C39.2131 11.2678 39.081 11.32 38.921 11.32H34.027ZM36.4549 13.7374C36.2705 13.7374 36.1175 13.6783 35.9957 13.5565C35.874 13.4348 35.8114 13.2818 35.8114 13.0905V8.29045C35.8114 8.1061 35.874 7.95654 36.0027 7.8348C36.1314 7.71654 36.2844 7.65393 36.4688 7.65393C36.6531 7.65393 36.8131 7.71306 36.9314 7.8348C37.0462 7.95306 37.1053 8.1061 37.1053 8.29045V13.0905C37.1053 13.2818 37.0462 13.4383 36.9244 13.5565C36.8027 13.6748 36.6497 13.7374 36.4583 13.7374H36.4549Z" fill="#3CDBC0"/>
<path d="M9.79747 9.21567C10.4698 9.21567 11.0149 8.67062 11.0149 7.99828C11.0149 7.32593 10.4698 6.78088 9.79747 6.78088C9.12512 6.78088 8.58008 7.32593 8.58008 7.99828C8.58008 8.67062 9.12512 9.21567 9.79747 9.21567Z" fill="#FFD100"/>
<path d="M28.4061 15.0314C28.8409 15.2645 29.2548 15.5462 29.6513 15.8627L31.8322 17.5984C32.5766 18.1862 33.1644 18.9375 33.5679 19.7758C33.9713 20.6245 34.187 21.5497 34.187 22.5097C34.187 24.1618 33.5435 25.7514 32.3957 26.9236L31.8496 27.4801C31.0079 28.3358 30.3435 29.3514 29.8983 30.4505C29.4461 31.5566 29.2096 32.7427 29.2096 33.9601C29.2096 34.854 28.5035 35.574 27.6235 35.574H25.2931C24.42 35.574 23.707 34.8575 23.707 33.9601V32.2836H16.6148V33.9601C16.6148 34.854 15.9018 35.574 15.0287 35.574H12.6322C11.7522 35.574 11.0461 34.8575 11.0461 33.9601V32.4192C11.0461 31.0975 10.5313 29.821 9.60959 28.8853C8.68785 27.9497 7.43568 27.4245 6.13481 27.4245H4.31221C3.87743 27.4245 3.51917 27.0627 3.51917 26.6175V21.261C3.51917 20.8158 3.87743 20.454 4.31221 20.454H5.59569C6.51743 20.454 7.37308 19.9845 7.88786 19.2123C8.43395 18.3636 8.50003 17.2853 8.04786 16.381L5.97133 12.2418C12.8166 10.7497 14.9035 16.3497 14.9035 16.3497C15.5713 15.7375 16.2983 15.2192 17.0844 14.8262" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.7104 20.0888C34.1383 19.0627 35.6165 18.7496 36.4548 19.4662C36.9383 19.8766 37.6131 19.9705 38.1835 19.7027L39.4391 19.1149" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.0774 21.6923C11.8285 21.6923 12.4374 21.0725 12.4374 20.3079C12.4374 19.5434 11.8285 18.9236 11.0774 18.9236C10.3263 18.9236 9.71741 19.5434 9.71741 20.3079C9.71741 21.0725 10.3263 21.6923 11.0774 21.6923Z" fill="#505354"/>
<path d="M16.4966 18.3948C18.0235 17.0175 20.1418 16.1653 22.4827 16.1653C24.8235 16.1653 26.8722 16.9896 28.3922 18.3253" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M26.2252 16.9583C27.0809 16.3044 27.8044 15.6609 28.4061 15.0314C30.3505 13.014 31.1191 11.1914 31.3731 9.77223C31.707 7.88354 30.7539 5.93223 29.0322 5.13223C25.2478 3.36527 22.8444 8.86093 22.8444 8.86093C22.8444 8.86093 20.4409 3.36527 16.6496 5.13223C14.9348 5.93223 13.9852 7.88354 14.3191 9.77223C14.5557 11.1427 15.2792 12.8957 17.0809 14.8227C17.6687 15.4522 18.3644 16.1061 19.2061 16.7601" stroke="#505354" stroke-width="0.695652" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_200_546">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>
`,
      },
    ];
  }
}

customElements.define('preference-survey', PreferenceSurvey);
