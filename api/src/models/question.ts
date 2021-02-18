import { createClient } from 'contentful';
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_API_KEY,
});

export const ADDTIONAL_KEYS_PER_ANSWER = 5;
export const MAX_KEYS_PER_ANSWER = 14;
const ASCII_RANGE_START = 'a'.charCodeAt(0);
const ASCII_RANGE_SIZE = 'z'.charCodeAt(0) - ASCII_RANGE_START;

const random = (n: number) => Math.floor(Math.random() * n);

export interface Question {
  answer: string;
  logo: string;
}

let cache: Question[];

export const refreshLocalQuestionsCache = async (): Promise<void> => {
  const response = await client.getEntries<Question>({
    content_type: 'question',
    limit: 1000,
  });
  cache = response.items.map((item) => item.fields);
};

export const getQuestionsCount = async (): Promise<number> => {
  return cache.length;
};

export const getNextQuestion = async (
  total: number,
  exclude: string[],
): Promise<Question> => {
  const skip = random(total);
  const filtered = cache.filter((item) => exclude.indexOf(item.answer) < 0);
  return filtered[skip];
};

export const generateLettersFromAnswer = (answer: string): string[] => {
  const answerNoSpaces = answer.replace(/ /g, '');
  const randomCharsCount = Math.min(
    MAX_KEYS_PER_ANSWER - answerNoSpaces.length,
    ADDTIONAL_KEYS_PER_ANSWER,
  );
  const randomChars = [...new Array(randomCharsCount)].map(() =>
    String.fromCharCode(random(ASCII_RANGE_SIZE) + ASCII_RANGE_START),
  );
  const keys = [...answerNoSpaces, ...randomChars].map((str) =>
    str.toUpperCase(),
  );
  return keys.sort(() => 0.5 - Math.random());
};

export const getWordsLengths = (answer: string): number[] =>
  answer.split(' ').map((str) => str.length);
