import {
  generateLettersFromAnswer,
  getWordsLengths,
  KEYS_PER_ANSWER,
} from '../../src/models/question';

describe('generateLettersFromAnswer', () => {
  it('should generate random uppercase letters for a given answer', () => {
    const answer = 'redis';
    const letters = generateLettersFromAnswer(answer);
    expect(letters.length).toEqual(KEYS_PER_ANSWER);
    [...answer.toUpperCase()].map((char) => expect(letters).toContain(char));
    letters.map((letter) => expect(letter).toMatch(/[A-Z]/));
  });

  it('should ignore spaces', () => {
    const answer = 'product hunt';
    const letters = generateLettersFromAnswer(answer);
    expect(letters.length).toEqual(KEYS_PER_ANSWER);
    [...answer.toUpperCase().replace(/ /g, '')].map((char) =>
      expect(letters).toContain(char),
    );
    letters.map((letter) => expect(letter).toMatch(/[A-Z]/));
  });
});

describe('getWordsLengths', () => {
  it('should return number of letters for a given answer', () => {
    const answer = 'product hunt';
    const words = getWordsLengths(answer);
    expect(words).toEqual([7, 4]);
  });

  it('should support a single word case', () => {
    const answer = 'redis';
    const words = getWordsLengths(answer);
    expect(words).toEqual([5]);
  });
});
