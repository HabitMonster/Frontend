import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { whiteOpacity } from '../../styles/Mixin';

const NotiContent = ({ id }) => {
  if (id === 1) {
    return (
      <NotiBox>
        <p>반갑습니다, HabitMonster입니다 !</p>
        <p>
          저희 팀은 많은 분이 좋은 습관을 생성하고 유지하여 성장하는 습관을 기를
          수 있게 도와주는 서비스를 만들기 위해 지난 한 달간 열심히
          달려왔습니다.
        </p>
        <p>
          우리들의 삶은 습관으로 이루어져 있다고 생각합니다. 오늘 하루 우리는
          습관대로 생각하고, 말하고 행동해왔을 겁니다. 이렇게 습관은 항상 우리
          곁에 있으며 우리의 정체성을 결정하며 삶의 방향에 영향을 미칩니다.
          Habit Monster와 함께 좋은 습관을 생성하고 유지하는 일상이 하루하루
          쌓이다 보면 매일 성장하고 발전하는 여러분들을 보실 수 있을 거라
          확신합니다.
        </p>
        <p>
          저희 팀은 Habit Monster를 사용해 주시는 많은 분이 좋은 습관을 지속해서
          유지할 수 있게 도와주는 서비스를 만들기 위해 남은 기간 더욱 열심히
          노력하겠습니다.
        </p>
        <p>
          아직 부족한 점이 많겠지만 앞으로 보내주시는 소중한 의견들을 모아 더
          나은 서비스를 제공하기 위해 노력하겠습니다.
        </p>
        <p>Habit Monster 많은 사랑 부탁드리겠습니다!</p> <p>감사합니다.</p>
      </NotiBox>
    );
  }
  if (id === 2) {
    return (
      <NotiBox>
        <p>여러분 다들 약속한 습관 잘 지키고 계신가요?</p>
        <p>
          저희 팀은 헤빗몬스터를 이용해주시는 많은 분께 더 나은 서비스를
          제공하기 위해 사용 경험에 대한 피드백을 받고 있어요, 이렇게
          작성해주시는 것이 손이 많이 가는 일인 만큼 여러분이 정성스럽게
          작성해주신 내용을 발판 삼아 저희 헤빗 몬스터는 쑥쑥 자라날 거예요!
        </p>
        <p>
          그래서 저희의 감사한 마음을 담아 작은 이벤트를 준비했습니다! 피드백을
          작성해주신 분들께 추첨을 통해 저희의 마음이 담긴 선물을 드리려고
          합니다.
        </p>
        <p>참여방법은 아래 글을 참고해주세요!</p>
        <br />
        <ListNumbering>* 참여방법 첫번째!</ListNumbering>
        <ListText>
          1. HabitMonster 페이지에서 서비스 이용 후 메인페이지의 “FeedBack”
          아이콘을 누른 후 구글 폼을 사용해 피드백을 제출한다.
        </ListText>{' '}
        <ListText>
          2. 0월 0일 추첨을 통해 스타벅스 기프티콘을 받아 맛있게 마신다.
        </ListText>
        <ListNumbering>* 참여방법 두번째!</ListNumbering>
        <ListText>
          1. HabitMonster 페이지에서 서비스 이용 후 인스타그램에 접속한다.
        </ListText>
        <ListText>
          2. HabitMonster를 이용하며 느끼신 장점 혹은 불편한 점을 #HabitMonster
          #습관 #몬스터 태그와 함께 게시글로 작성한다.
        </ListText>
        <ListText>
          3. 0월 0일 추첨을 통해 베스킨라빈스 파인트 기프티콘을 받아 맛있게
          먹는다.
        </ListText>
        <br />
        <p>여러분의 많은 참여와 지속적인 관심과 사랑 부탁드립니다.</p>
        <p> 감사합니다.</p>
      </NotiBox>
    );
  }
};

export default NotiContent;

const NotiBox = styled.div`
  color: var(--color-primary);
  line-height: 22px;
  padding: 18px;

  & p {
    font-size: var(--font-xs);
    ${whiteOpacity('0.8')};
    font-weight: var(--weight-semi-regular);
    white-space: pre-wrap;
    margin-bottom: 10px;
  }
  & :first-child {
    margin-bottom: 15px;
  }
`;

const ListNumbering = styled.h6`
  font-size: var(--font-xs);
  ${whiteOpacity('0.8')};
  font-weight: var(--weight-semi-regular);
  white-space: pre-wrap;
  margin-bottom: 10px;
`;

const ListText = styled.p`
  font-size: var(--font-xs);
  ${whiteOpacity('0.8')};
  font-weight: var(--weight-semi-regular);
  white-space: pre-wrap;
  padding-left: 15px;
`;

NotiContent.propTypes = {
  id: PropTypes.number.isRequired,
};
