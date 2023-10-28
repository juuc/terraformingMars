import React, { useEffect, useState, useCallback } from "react";

const Counter = ({ name, generation, initialValue = 0, initialIncrease = 1 }) => {
  const [count, setCount] = useState(initialValue);
  const [increase, setIncrease] = useState(initialIncrease);
  const [currentGeneration, setCurrentGeneration] = useState(1);
  const onIncrease = () => {
    setCount(prevCount => prevCount + 1);
  }
  const onDecrease = () => {
    setCount(prevCount => prevCount - 1);
  };
  useEffect(() => {
    if (generation > currentGeneration) {
      setCount(prevCount => prevCount + increase);
    } else if (generation < currentGeneration) {
      setCount(prevCount => prevCount - increase)
    }
    setCurrentGeneration(generation);
  }, [generation]);
  return (
    <div>
      <h4>{name}</h4>
      <h3>보유 개수 : {count}</h3>
      <h3>증가량 : {increase}</h3>
      <button onClick={onIncrease}>+</button>
      <button onClick={onDecrease}>-1</button>
      <button onClick={() => setIncrease(prevIncrease => prevIncrease + 1)}>증가량+</button>
      <button onClick={() => setIncrease(prevIncrease => prevIncrease - 1)}>증가량-</button>
    </div>
  );
};

export default Counter;
