import emojiTypes from '../emojisTypes.js';
import Cards from './Cards.js';
import Confetti from './Confetti.js';

export default class Game {
  constructor() {
    this.card = {
      listContainer: () => document.querySelector('.card-list'),
      buttonList: () => document.querySelectorAll('.card-list [data-button]'),
      front: (card) => card.querySelector('.front'),
    };
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  #clickedCards = [];
  #emojiList = Cards.getScrambledEmojisForCards(24, emojiTypes, { test: false });
  #confettis = [];

  getEmojiText(index) {
    return this.#clickedCards[index]?.children[1].innerText;
  }

  renderEmojiOnCard(element, index) {
    element.textContent = this.#emojiList[index];
  }

  createEl(tagName) {
    return document.createElement(tagName);
  }

  createCardWithEmoji(emoji, index) {
    const li = this.createEl('li');
    const button = this.createEl('button');
    const divBack = this.createEl('div');
    const divFront = this.createEl('div');

    button.classList.add('card');
    button.setAttribute('data-button', String(index + 1));
    divBack.classList.add('back');
    divBack.textContent = '❓';
    divFront.classList.add('front');
    divFront.appendChild(document.createTextNode(emoji));

    button.append(divBack, divFront);
    li.appendChild(button);

    return li;
  }

  renderStarterCards(emojiList) {
    const cardListContainer = this.card.listContainer();
    const newCards = emojiList.map(this.createCardWithEmoji.bind(this));

    cardListContainer.append(...newCards);
  }

  checkIfAllCardsAreMatches() {
    return [...this.card.buttonList()].every((item) => item.classList.contains('match'));
  }

  createModalEndgame(message = 'Parabéns! 🎉') {
    const modal = this.createEl('div');
    const p = this.createEl('p');
    const button = this.createEl('button');
    const modalStylesOpt = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '4rem',
      color: '#fff',
      fontWeight: 'bolder',
      padding: '1rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
    };
    const buttonStylesOpt = {
      backgroundColor: '#fff',
      color: '#333',
      padding: '.75rem 1.5rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '1.2rem',
      borderRadius: '10px',
      boxShadow: '2px 4px 8px rgba(0, 0, 0, .1)',
      border: 'none',
      cursor: 'pointer',
    };
    const setStylesInTheElement = (element, styles) =>
      Object.entries(styles).forEach(([prop, value]) => (element.style[prop] = value));
    setStylesInTheElement(modal, modalStylesOpt);
    setStylesInTheElement(button, buttonStylesOpt);

    p.innerHTML = message;
    button.innerText = 'Jogar Novamente 🤩';
    button.addEventListener('click', () => {
      location.reload();
    });

    modal.append(p, button);
    document.body.appendChild(modal);
  }

  gameover() {
    // adiciona todas as cartas match, remover depois de testar
    // this.card.buttonList().forEach((item) => item.classList.add('match'));
    if (this.checkIfAllCardsAreMatches()) {
      this.createConfetti();
      this.animateConfetti();
      this.createModalEndgame();
    }
  }

  matchEmojis() {
    if (this.getEmojiText(0) === this.getEmojiText(1)) {
      this.#clickedCards.forEach((card) => card.classList.add('match'));
      this.#clickedCards = [];
      this.gameover();
      return;
    }

    this.#clickedCards.forEach((card) => {
      card.classList.remove('flip');
      setTimeout(() => {
        card.children[1].textContent = null;
      }, 100);
    });

    this.#clickedCards = [];
  }

  emojisHandleClick({ currentTarget }) {
    const card = currentTarget;
    const cardNumber = card.dataset.button - 1;
    const front = card.children[1];
    const cardHasFlipOrMatchClass = ['match', 'flip'].some((className) =>
      card.classList.contains(className)
    );

    if (cardHasFlipOrMatchClass) {
      return;
    }

    if (this.#clickedCards.length < 2) {
      this.#clickedCards.push(card);
      card.classList.add('flip');
      this.renderEmojiOnCard(front, cardNumber);
    }

    if (this.#clickedCards.length === 2) {
      setTimeout(this.matchEmojis.bind(this), 600);
    }
  }

  createConfetti() {
    for (let i = 0; i < 100; i++) {
      const size = Math.random() * 20 + 15; // Tamanho aleatório entre 15px e 35px
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speed = Math.random() * 3 + 1;
      const emoji = this.#emojiList[Math.floor(Math.random() * this.#emojiList.length)]; // Emoji aleatório
      this.#confettis.push(new Confetti(this.canvas, x, y, size, emoji, speed));
    }
  }

  animateConfetti() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.#confettis.forEach((confetti) => {
      confetti.update();
      confetti.draw();
    });
    requestAnimationFrame(this.animateConfetti.bind(this));
  }

  init() {
    this.renderStarterCards(this.#emojiList);
    this.card.buttonList().forEach((button) => {
      button.addEventListener('click', this.emojisHandleClick.bind(this));
    });

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
