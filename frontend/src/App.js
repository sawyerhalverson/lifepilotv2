import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Home';
import Track from './Track';
import Insights from './Insights';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path ="/" element = {<Home/>}></Route>
          <Route path = "/track" element = {<Track/>}></Route>
          <Route path = "/insights" element = {<Insights/>}></Route>

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
