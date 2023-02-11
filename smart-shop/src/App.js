import logo from './logo.svg';
import './App.css';
import { SessionList } from './Components/SessionList/SessionList';
import { HeatMapContainer } from './Components/HeatMapContainer/HeatMapContainer';
import test from './Services/test.js';

import testData from './testData.json';
import { useEffect } from 'react';

function App() {
  useEffect(()=>{
    console.log(testData)
  },[])
  return (
    <div className="App">
      <header className='appheader'>Dashboard</header>
      <div className='appbody'>
          <SessionList></SessionList>
          <HeatMapContainer pagesData={testData.domains[0].sessions[0].pages} bWidth={testData.domains[0].sessions[0].bWidth}></HeatMapContainer>
      </div>
    </div>
  );
}

export default App;
