import React from 'react';

import { Header } from '../common/Header';

export function BaseTemplate({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
