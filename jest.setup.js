require('dotenv').config();
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();