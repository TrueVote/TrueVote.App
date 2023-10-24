import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Ballot } from './pages/Ballot';
import { BallotView } from './pages/BallotView';
import { Ballots } from './pages/Ballots';
import { Elections } from './pages/Elections';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';
import { SignIn } from './pages/SignIn';
import { Status } from './pages/Status';
import { Thanks } from './pages/Thanks';

export const ROUTES: ReactElement = (
  <Routes>
    <Route path='/' element={<MainLayout />}>
      <Route path='' element={<Home />} />
      <Route path='/ballots' element={<Ballots />} />
      <Route path='/ballot/:electionId' element={<Ballot />} />
      <Route path='/ballotview/:ballotId' element={<BallotView />} />
      <Route path='/elections' element={<Elections />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/thanks' element={<Thanks />} />
      <Route path='/status' element={<Status />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/register' element={<Register />} />
    </Route>
    <Route path='*' element={<Navigate to='/' replace />} />
  </Routes>
);
