import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Documents from '../client/components/Documents.jsx';
import '@testing-library/jest-dom';
import {jest} from '@jest/globals'

test('simple test', () => {
    expect(false).toBe(true);
  });