import React from 'react';

import { BaseTemplate } from '../../../templates';
import { WorkoutsList } from '../../organisms/WorkoutsList';

export function WorkoutsPage() {
  return (
    <BaseTemplate>
      <WorkoutsList />
    </BaseTemplate>
  );
}
