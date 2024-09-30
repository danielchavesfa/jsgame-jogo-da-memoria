export default class Cards {
  static #emojisForTest = [
    '🍌',
    '🍌',
    '🍕',
    '🍕',
    '⌚',
    '⌚',
    '🌽',
    '🌽',
    '📱',
    '📱',
    '🚀',
    '🚀',
    '⚽',
    '⚽',
    '🐢',
    '🐢',
    '🎧',
    '🎧',
    '🍇',
    '🍇',
    '🧳',
    '🧳',
    '😀',
    '😀',
  ];

  static getAllEmojis(emojiTypes = []) {
    return Object.values(emojiTypes).reduce((acc, emojis) => {
      emojis.forEach((item) => acc.push(item.emoji));
      return acc;
    }, []);
  }

  static shuffleEmojis(emojis = []) {
    return emojis.sort(() => Math.random() - 0.5);
  }

  static getScrambledEmojisForCards(quantityCards = 24, emojiList = [], options = { test: false }) {
    if (options.test) return this.#emojisForTest;

    const emojis = this.shuffleEmojis(this.getAllEmojis(emojiList));
    const halfEmojisForCards = emojis.slice(0, quantityCards / 2);

    return [...halfEmojisForCards, ...halfEmojisForCards];
  }
}
