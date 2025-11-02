import { Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ImportScreen from './screens/ImportScreen';
import Layout from './components/Layout/Layout';
import NotFoundScreen from './screens/NotFoundScreen';
import DetailCourseScreen from './screens/DetailCourseScreen';
import CreateScreen from './screens/CreateScreen'
import EditCourseScreen from './screens/EditCourseScreen';
import ExamScreen from './screens/ExamScreen';
import {ListeningScreen, LearningScreen} from './screens/LearnScreen';
import LearnPmgScreen from './screens/LearnPmgScreen';
import ExamScreenPmg from './screens/ExamPmgScreen';
import MessageScreen from './screens/MessageScreen';

import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import MergeScreen from './screens/MergeScreen';
import Shutdown from './screens/Shutdown';
ReactGA.initialize('G-FLXKD35453');

function App() {
  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  return (
    <Routes>
      <Route path={'/'} element={<Layout />}>
        <Route path={'/'} element={<HomeScreen title={'Home'} />} />        
        <Route
          path={'/create'}
          element={<CreateScreen title={'Create module'} />}
        />
        <Route
          path={'/import'}
          element={<ImportScreen title={'Import course'} />}
        />
        <Route
          path={'/course/:id'}
          element={<DetailCourseScreen title={'Detail course'} />}
        />
        <Route
          path={'/edit/course/:id'}
          element={<EditCourseScreen title={'Edit module'} />}
        />
        <Route
          path={'/learn/:id'}
          element={<LearningScreen title={'Learn course'} />}
        />
        <Route
          path={'/listening/:id'}
          element={<ListeningScreen title={'Listening course'} />}
        />
        <Route
          path={'/learn/pmg/:id'}
          element={<LearnPmgScreen title={'Learn PMG course'} />}
        />
        <Route
          path={'/merge'}
          element={<MergeScreen title={'Merge course'} />}
        />
      </Route>
      <Route
        path={'/course/:id/exam'}
        element={<ExamScreen title={'Exam Pmg Screen'} />}
      />
      <Route
        path={'/message'}
        element={<MessageScreen title={'Message'} />}
      />
      <Route
        path={'/course/pmg/:id/exam'}
        element={<ExamScreenPmg title={'Exam Pmg Screen'} />}
      />
      <Route
        path={'*'}
        element={<NotFoundScreen title={'Not found'} />}
      />
      {/*<Route
        path={'*'}
        element={<MessageScreen title={'Shutdown '} />}
      />
  */}
    </Routes>
  );
}

export default App;
