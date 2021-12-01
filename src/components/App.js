import React, { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Switch, Redirect } from 'react-router-dom';

import Loading from '../pages/Loading';
// import ErrorLog from './ErrorLog';
import PrivateRoute from '../components/PrivateRoute';
import Login from '../pages/Login';
// import Main from '../pages/Main';
// import Achievement from '../pages/Achievement';
// import New from '../pages/New';
// import MyPage from '../pages/MyPage';
// import HabitDetail from '../pages/HabitDetail';
// import HabitEdit from '../pages/HabitEdit';
// import Notice from '../pages/Notice';
// import Select from '../pages/Select';
// import Search from '../pages/Search';
// import SearchDetail from '../pages/SearchDetail';
// import SearchDetailHabit from '../pages/SearchDetailHabit';
// import Follow from '../pages/Follow';

// const Loading = lazy(() => import('./Loading'));
const ErrorLog = lazy(() => import('./ErrorLog'));
const Main = lazy(() => import('../pages/Main'));
const Achievement = lazy(() => import('../pages/Achievement'));
const New = lazy(() => import('../pages/New'));
const MyPage = lazy(() => import('../pages/MyPage'));
const HabitDetail = lazy(() => import('../pages/HabitDetail'));
const HabitEdit = lazy(() => import('../pages/HabitEdit'));
const Notice = lazy(() => import('../pages/Notice'));
const Select = lazy(() => import('../pages/Select'));
const Search = lazy(() => import('../pages/Search'));
const SearchDetail = lazy(() => import('../pages/SearchDetail'));
const SearchDetailHabit = lazy(() => import('../pages/SearchDetailHabit'));
const Follow = lazy(() => import('../pages/Follow'));

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorLog}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path={['/login', '/#']} component={Login} />
          <PrivateRoute path="/select" component={<Select />} />
          <PrivateRoute exact path="/" component={<Main />} />
          <PrivateRoute path="/new" component={<New />} />
          <PrivateRoute path="/achievement" component={<Achievement />} />
          <PrivateRoute path="/mypage" component={<MyPage />} />
          <PrivateRoute exact path="/search" component={<Search />} />
          <PrivateRoute
            exact
            path="/search/:monsterCode"
            component={<SearchDetail />}
          />
          <PrivateRoute
            exact
            path="/search/:monsterCode/:habitId"
            component={<SearchDetailHabit />}
          />
          <PrivateRoute
            exact
            path="/habit/:habitId"
            component={<HabitDetail />}
          />
          <PrivateRoute
            exact
            path="/habit/:habitId/edit"
            component={<HabitEdit />}
          />
          <PrivateRoute path="/notice" component={<Notice />} />
          <PrivateRoute
            exact
            path="/follow/:monsterCode"
            component={<Follow />}
          />
          <Redirect from="*" to="/" />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
