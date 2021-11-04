import React from 'react';
import styled from 'styled-components';
import { Exp, Character } from '../components/main';
import Habit from './Habit';
import '../assets/fonts/font.css';

const Main = () => {
  return (
    <React.Fragment>
      <Wrapper className="wrapper">
        <Character />
        <Exp />
        <Habit />
      </Wrapper>
    </React.Fragment>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #7057fc 0%, #7057fc 50.52%, #7f9ae6 100%);
`;

export default Main;
