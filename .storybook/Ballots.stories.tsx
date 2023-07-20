import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { AllBallots } from '../src/pages/Ballots';

storiesOf('Ballots', module)
  .addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>)
  .add('All Ballots', () => <AllBallots />);
