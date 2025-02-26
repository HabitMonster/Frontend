import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { auth } from '../../api';

import { GoogleSymbol } from '../../assets/icons/loginSymbol';

import { OK } from '../../constants/statusCode';

import { useRefreshUser } from '../../hooks/';

import { loginBtnStyle } from '../../styles';

import { loadGoogleScript } from '../../utils/loadGoogleScript';
import { setCookie } from '../../utils/cookie';

const GoogleLogin = () => {
  const history = useHistory();
  const googleLoginBtn = useRef(null);
  const socialName = 'google';

  const refresher = useRefreshUser();

  useEffect(() => {
    window.onGoogleScriptLoad = () => {
      window.gapi.load('auth2', () => {
        (async () => {
          const googleAuth2 = await window.gapi.auth2.init({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: 'profile email',
          });
          googleAuth2.attachClickHandler(
            googleLoginBtn.current,
            {},
            (googleUser) => {
              async function getTokenWithGoogle() {
                try {
                  const { data } = await auth.getSocialLogin(
                    socialName,
                    googleUser.getAuthResponse().id_token,
                  );
                  setCookie('habit-A-Token', data.accessToken);
                  setCookie('habit-R-Token', data.refreshToken);
                  refresher();
                  if (data.statusCode === OK) {
                    history.replace(data.isFirstLogin ? '/select' : '/');
                  }
                } catch (err) {
                  console.error(err.response);
                }
              }

              getTokenWithGoogle();
            },
            (error) => {
              return Promise.reject(error);
            },
          );
        })();
      });
    };

    loadGoogleScript();
  }, [history, refresher]);

  return (
    <>
      <LoginBtn ref={googleLoginBtn} className="googleLogin">
        <GoogleSymbol />
        <SocialTitle>Google로 시작하기</SocialTitle>
      </LoginBtn>
    </>
  );
};

const LoginBtn = styled.div`
  ${loginBtnStyle('white')}

  & > svg {
    width: 20px;
    height: 20px;
    margin-left: 19px;
    position: absolute;
  }
`;

const SocialTitle = styled.span`
  height: 24px;
  margin: 0px 78px 0px 99px;
`;

export default GoogleLogin;
