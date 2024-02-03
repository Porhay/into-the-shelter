import './styles/App.css';
import Navigation from './components/Navigation';
import { BrowserRouter } from "react-router-dom";
import Router from './components/Router';


function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Router />
    </BrowserRouter>
  );
}

export default App;
