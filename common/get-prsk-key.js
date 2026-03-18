const PRSK_KEY_MAP = {
  1: 'miku',
  2: 'rin',
  3: 'len',
  4: 'luka',
  5: 'meiko',
  6: 'kaito',
  7: 'ichika',
  8: 'saki',
  9: 'honami',
  10: 'shiho',
  11: 'minori',
  12: 'haruka',
  13: 'airi',
  14: 'shizuku',
  15: 'kohane',
  16: 'an',
  17: 'akito',
  18: 'toya',
  19: 'tsukasa',
  20: 'emu',
  21: 'nene',
  22: 'rui',
  23: 'kanade',
  24: 'mafuyu',
  25: 'ena',
  26: 'mizuki',
};

function getRandomPrskKey() {
  const values = Object.values(PRSK_KEY_MAP);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

module.exports = { getRandomPrskKey, PRSK_KEY_MAP };
