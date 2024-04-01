import './styles/App.scss';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './components/Navigation';
import Router from './components/Router';
import { RootState } from './redux/store';
import Loader from './libs/loader';

function App() {
  const app = useSelector((state: RootState) => state.app);
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        {app.loading ? (
          <div className="app-loader">
            <Loader />
          </div>
        ) : (
          <Router />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
