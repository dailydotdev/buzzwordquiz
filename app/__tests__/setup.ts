import '@testing-library/jest-dom';
import { matchers } from '@emotion/jest';
import nodeFetch from 'node-fetch';

expect.extend(matchers);

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

/* eslint-disable @typescript-eslint/no-explicit-any */
global.fetch = (nodeFetch as any) as typeof fetch;
/* eslint-enable @typescript-eslint/no-explicit-any */
