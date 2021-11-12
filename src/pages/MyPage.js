import React, { useEffect } from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { fontSize, whiteOpacity } from '../styles';
import { UserInformation, History } from '../components/myPage';

const MyPage = () => {
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('isFirstLogin') === 'true') {
      return history.replace('/monster');
    }
  }, []);

  return (
    <AcheiveContainer>
      <NavButtonWrap>
        <NavButtonItem>
          <NavButton to="/mypage/information" activeClassName="active">
            마이페이지
          </NavButton>
        </NavButtonItem>
        <NavButtonItem>
          <NavButton to="/mypage/history" activeClassName="active">
            히스토리
          </NavButton>
        </NavButtonItem>
      </NavButtonWrap>
      <Switch>
        <Route exact path="/mypage/information" component={UserInformation} />
        <Route exact path="/mypage/history" component={History} />
        <Redirect from="*" to="/mypage/information" />
      </Switch>
    </AcheiveContainer>
  );
};

export default MyPage;

const AcheiveContainer = styled.div`
  background-color: var(--bg-wrapper);
  font-family: var(--font-name-apple);
  width: 100%;
`;

const NavButtonWrap = styled.ul`
  background-color: var(--color-background);
  border-bottom: 0.7px solid rgba(248, 248, 248, 0.1);
  display: flex;
  list-style: none;
  margin: 0;
  padding-top: 52px;
`;

const NavButtonItem = styled.li`
  color: var(--color-primary-deemed);
  display: flex;
  justify-content: center;
  list-style: none;
  width: 50%;
  height: 34px;
  ${fontSize('16px')};
  position: relative;
`;

const NavButton = styled(NavLink)`
  background-color: transparent;
  border: 0;
  border: 1px solid transparent;
  color: var(--color-deemed3);
  cursor: pointer;
  ${fontSize('16px')};
  ${whiteOpacity('0.6')};
  font-weight: var(--font-weight-normal);
  outline: 0;
  line-height: 19px;
  text-decoration: none;

  &:hover {
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
  }

  &.active {
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
  }
`;
