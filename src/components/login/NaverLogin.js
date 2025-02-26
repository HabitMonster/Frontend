import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import { auth } from '../../api';

import { NaverSymbol } from '../../assets/icons/loginSymbol';

import { OK } from '../../constants/statusCode';

import { useRefreshUser } from '../../hooks';

import { loginBtnStyle } from '../../styles';

import { setCookie } from '../../utils/cookie';

const { naver } = window;

const NaverLogin = () => {
  const history = useHistory();
  const naverRef = useRef();
  const socialName = 'naver';
  const refresher = useRefreshUser();

  useEffect(() => {
    const initializeNaverLogin = () => {
      const naverLogin = new naver.LoginWithNaverId({
        clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
        callbackUrl: process.env.REACT_APP_LOGIN_REDIRECT_URI,
        isPopup: isMobile ? true : false,
        loginButton: {
          color: 'green',
          type: 3,
          height: 55,
        },
      });

      naverLogin.init();
      naverLogin.logout();
    };
    const getNaverAuthCode = () => {
      if (!window.location.hash) {
        return;
      }

      const naverAuthCode = window.location.hash.split('=')[1].split('&')[0];

      async function getTokenWithNaver() {
        try {
          const { data } = await auth.getSocialLogin(socialName, naverAuthCode);
          setCookie('habit-A-Token', data.accessToken);
          setCookie('habit-R-Token', data.refreshToken);
          refresher();
          if (data.statusCode === OK) {
            history.replace(data.isFirstLogin ? '/select' : '/');
          }
        } catch (err) {
          console.error(err);
        }
      }

      getTokenWithNaver();
    };

    initializeNaverLogin();
    getNaverAuthCode();
  }, [history, refresher]);

  const handleClick = (e) => {
    e.preventDefault();
    naverRef.current.children[0].click();
  };

  return (
    <>
      <LoginBtn className="naverLogin" onClick={handleClick}>
        <div ref={naverRef} id="naverIdLogin" className="hide"></div>
        <NaverSymbol />
        <SocialTitle>네이버로 시작하기</SocialTitle>
      </LoginBtn>
    </>
  );
};

const LoginBtn = styled.div`
  ${loginBtnStyle('naver')}
  color: var(--color-white);

  & .hide {
    display: none;
  }

  & > svg {
    width: 20px;
    height: 20px;
    margin-left: 19px;
    position: absolute;
  }
`;

const SocialTitle = styled.span`
  height: 24px;
  margin: 0px 83px 0px 103px;
`;

export default NaverLogin;
