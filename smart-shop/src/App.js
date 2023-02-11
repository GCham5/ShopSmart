import logo from './logo.svg';
import './App.css';
import { SessionList } from './Components/SessionList/SessionList';
import { HeatMapContainer } from './Components/HeatMapContainer/HeatMapContainer';

function App() {
  return (
    <div className="App">
      <header className='appheader'>Dashboard</header>
      <div className='appbody'>
          <SessionList></SessionList>
          <HeatMapContainer></HeatMapContainer>
      </div>
    </div>
  );
}

export default App;
