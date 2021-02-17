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

interface ContentfulQuestion {
  answer: string;
  logo: { original_secure_url: string };
}

export const getQuestionsCount = async (): Promise<number> => {
  const response = await client.getEntries({
    content_type: 'question',
    limit: 1,
  });
  return response.total;
};

export const getNextQuestion = async (
  total: number,
  exclude: string[],
): Promise<Question> => {
  const skip = random(total) - exclude.length;
  const response = await client.getEntries<ContentfulQuestion>({
    content_type: 'question',
    limit: 1,
    skip,
    'fields.answer[nin]': exclude.join(','),
  });

  return {
    answer: response.items[0].fields.answer,
    logo: response.items[0].fields.logo[0].original_secure_url,
  };
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
