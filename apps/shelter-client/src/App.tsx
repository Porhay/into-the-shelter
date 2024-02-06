import './styles/App.scss';
import Navigation from './components/Navigation';
import { BrowserRouter } from "react-router-dom";
import Router from './components/Router';


function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navigation />
        <Router />
      </BrowserRouter>
    </div>
    
  );
}

export default App;
