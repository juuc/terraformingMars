import React, { useState } from 'react';
import './App.css';
import Counter from './Counter';
function App() {
  const [generation, setGeneration] = useState(1);

  const previousGeneration = () => {
    setGeneration(prevGeneration => prevGeneration - 1);
  }

  const nextGeneration = () => {
    setGeneration(prevGeneration => prevGeneration + 1);
  }

  // 다음 세대 버튼이 눌리면 모든 Counter의 증가량만큼 증가시킨다.
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>신나는 테라포밍 마스 시간</h1>
      <div className="App">
        <div className='team1'>
          <h1>우철이팀</h1>
          <div className='team'>
            <Counter name="메가크레딧" generation={generation} initialIncrease={21} initialValue={30} />
            <Counter name="강철" generation={generation} initialValue={20} />
            <Counter name="티타늄" generation={generation} />
          </div>
          <div className='team'>
            <Counter name="식물" generation={generation} />
            <Counter name="에너지" generation={generation} />
            <Counter name="열" generation={generation} />
          </div>
          <div className='team'>
            <Counter name="동물" generation={generation} initialIncrease={0} />
            <Counter name="미생물" generation={generation} initialIncrease={0} />
            <Counter name="과학" generation={generation} initialIncrease={0} />
          </div>
        </div>
        <div style={{ height: 580, width: '1px', backgroundColor: 'gray' }}></div>
        <div className='team2'>
          <h1>져니팀</h1>
          <div className='team'>
            <Counter name="메가크레딧" generation={generation} initialValue={60} initialIncrease={21} />
            <Counter name="강철" generation={generation} />
            <Counter name="티타늄" generation={generation} />
          </div>
          <div className='team'>
            <Counter name="식물" generation={generation} />
            <Counter name="에너지" generation={generation} />
            <Counter name="열" generation={generation} />
          </div>
          <div className='team'>
            <Counter name="동물" generation={generation} initialIncrease={0} />
            <Counter name="미생물" generation={generation} initialIncrease={0} />
            <Counter name="과학" generation={generation} initialIncrease={0} />
          </div>
        </div>
      </div>
      <div>
        <h1>세대 : {generation}</h1>
        <button onClick={previousGeneration}>이전 세대</button>
        <button onClick={nextGeneration}>다음 세대</button>
      </div>
    </div>
  );
}

export default App;
