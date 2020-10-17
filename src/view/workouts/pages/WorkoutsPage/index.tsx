import React from 'react';

import { Header } from '../../../common/Header';
import { WorkoutsList } from '../../organisms/WorkoutsList';

export function WorkoutsPage() {
  return (
    <div>
      <Header />
      <WorkoutsList />
    </div>
  );
}
