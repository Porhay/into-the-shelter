import './styles/App.scss';
import Navigation from './components/Navigation';
import { BrowserRouter } from "react-router-dom";
import Router from './components/Router';
import { Provider } from 'react-redux';
import store from './redux/store';


function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <BrowserRouter>
          <Navigation />
          <Router />
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
