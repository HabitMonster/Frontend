import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import {
  habitIdListState,
  habitStateWithId,
  habitListState,
  myHabitCountState,
} from '../recoil/states/habit';
import {
  userLevelOneMonsterIdSelector,
  monsterState,
} from '../recoil/states/monster';

import { habitApis, mainApis } from '../api';

import { Trash } from '../assets/icons/common';
import monsters from '../assets/images/monsters/svg';

import {
  SubTitleOuter,
  BottomFixedButton,
  BackButtonHeader,
  Modal,
} from '../components/common';
import { BottomDialog } from '../components/dialog';

import { OK } from '../constants/statusCode';

import { disappearScrollbar, setFlexStyles, setFontStyles } from '../styles';

import { renderDays } from '../utils/date';
import { setFormattedDuration } from '../utils/setFormatDuration';

const HabitDetail = () => {
  const { habitId } = useParams();
  const history = useHistory();

  const habitDetail = useRecoilValue(habitStateWithId(Number(habitId)));
  const levelOneMonsterId = useRecoilValue(userLevelOneMonsterIdSelector);

  const [habitIdList, setHabitIdList] = useRecoilState(habitIdListState);
  const [habitList, setHabitList] = useRecoilState(habitListState);
  const [totalHabitCount, setTotalHabitCount] =
    useRecoilState(myHabitCountState);
  const setMonsterState = useSetRecoilState(monsterState);

  const durationStart = setFormattedDuration(
    habitDetail.durationStart,
    'YMD',
    '.',
  );
  const durationEnd = setFormattedDuration(habitDetail.durationEnd, 'YMD', '.');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const deleteHabit = async (id) => {
    try {
      const { data } = await habitApis.deleteHabit(id);
      if (data.statusCode === OK) {
        history.replace('/');
        const newMonsterState = async () => {
          try {
            const { data } = await mainApis.getMonsterInfo();
            setMonsterState(data.monster);
          } catch (error) {
            console.error(error);
            throw error;
          }
        };
        newMonsterState();
        setHabitList(habitList.filter(({ habitId }) => habitId !== id));
        setHabitIdList(habitIdList.filter((habitId) => habitId !== id));
        setTotalHabitCount(totalHabitCount - 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const progressbarRotationDegree = habitDetail.achievePercentage * 1.8 + 45;
  const MonsterIcon = monsters[levelOneMonsterId];

  return (
    <Container>
      <BackButtonHeader onButtonClick={() => history.push('/')}>
        <MenuBar>
          <span>{habitDetail.title}</span>{' '}
          <Trash
            onClick={() => setDeleteModalOpen(true)}
            className="deleteBtn"
          />
        </MenuBar>
      </BackButtonHeader>
      <Inner>
        <Wrapper>
          <ProgressBarWrapper>
            <ProgressBar achievePercentage={habitDetail.achievePercentage}>
              <div className="left" />
              <div className="right" />
              <div className="text">
                <p>{habitDetail.achievePercentage}%</p>
                <p>
                  {habitDetail.totalCount}번 중 {habitDetail.achieveCount}번
                  완료!
                </p>
              </div>
              <ProgressBarOverflowSection>
                <CircleProgressbar degree={progressbarRotationDegree} />
              </ProgressBarOverflowSection>
              <IconProgressbar degree={progressbarRotationDegree}>
                <MonsterIcon />
              </IconProgressbar>
            </ProgressBar>
          </ProgressBarWrapper>
        </Wrapper>

        <Wrapper>
          <SubTitleOuter subTitle="내용" className="subTitle">
            <p className="content">{habitDetail.description}</p>
          </SubTitleOuter>
        </Wrapper>
        <Wrapper>
          <SubTitleOuter subTitle="기간" className="subTitle">
            <p className="content">
              {durationStart} ~ {durationEnd}
            </p>
          </SubTitleOuter>
        </Wrapper>
        <Wrapper>
          <SubTitleOuter subTitle="요일" className="subTitle">
            {habitDetail.practiceDays.length === 7 ? (
              <p className="content">매일</p>
            ) : (
              <p className="content">
                매주 {renderDays(habitDetail.practiceDays)}
              </p>
            )}
          </SubTitleOuter>
        </Wrapper>
        <Wrapper>
          <SubTitleOuter subTitle="하루에 몇 번 할까요?" clasName="subTitle">
            <p className="content">하루에 {habitDetail.count}번</p>
          </SubTitleOuter>
        </Wrapper>
      </Inner>
      <BottomFixedButton
        condition={null}
        text="수정하기"
        onClick={() => {
          history.push({
            pathname: `/habit/${habitId}/edit`,
            state: {
              habitDetail,
            },
          });
        }}
      />
      {deleteModalOpen && (
        <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <BottomDialog
            title="습관을 정말 삭제할까요?"
            description="한 번 삭제 후에는 복구되지 않아요! 모든건 삼세번인데, 한 번 다시 생각해보는게 어떨까요!"
            activeButtonText="삭제할래요"
            onClose={() => setDeleteModalOpen(false)}
            onActive={() => deleteHabit(Number(habitId))}
          />
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  ${setFlexStyles({
    display: 'flex',
    flexDirection: 'column',
  })}
  width: 100%;
  height: 100%;
  background-color: var(--bg-wrapper);
  font-family: var(--font-name-apple);
  color: var(--color-primary);
  overflow-y: auto;
  ${disappearScrollbar()};

  & .deleteBtn {
    cursor: pointer;
  }
`;

const Inner = styled.div`
  padding: 0 24px;
`;

const MenuBar = styled.div`
  width: 100%;
  ${setFlexStyles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  })}

  & > span {
    ${setFontStyles({
      color: 'primary',
      fontSize: 'l',
      fontWeight: 'regular',
      lineHeight: '21.6px',
    })}
  }
`;
const Wrapper = styled.div`
  margin-bottom: 22px;

  & .subTitle {
    ${setFontStyles({
      customColor: 'var(--bg-selected-light)',
      fontSize: 'xs',
      fontWeight: 'semi-bold',
      lineHeight: '16.8px',
    })}
    margin-bottom: 6px;
  }

  & .content {
    font-weight: var(--weight-semi-regular);
    word-break: break-all;
  }
`;

const ProgressBarWrapper = styled.section`
  width: 100%;
  height: 154px;
  border: none;
  position: relative;
  background: var(--bg-primary);
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & > .left,
  & > .right {
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    bottom: -7px;
    overflow: hidden;
  }
  & > .left {
    left: 0;
    background: ${({ achievePercentage }) =>
      achievePercentage ? 'var(--bg-selected-light)' : '#5a5a5a'};
  }

  & > .right {
    right: 0;
    background: ${({ achievePercentage }) =>
      achievePercentage === 100 ? 'var(--bg-selected-light)' : '#5a5a5a'};
  }

  & > .text {
    ${setFontStyles({
      color: 'primary-deemed',
      fontSize: 'xs',
      lineHeight: '17px',
    })}
    position: absolute;
    bottom: -10px;
    left: 50%;

    transform: translateX(-50%);
    text-align: center;

    & > p:first-child {
      ${setFontStyles({
        color: 'white',
        customFontSize: '36px',
        fontWeight: 'bold',
        lineHeight: '43.2px',
      })}
    }

    & > p:last-child {
      margin-top: 6px;
    }
  }
`;

const ProgressBarOverflowSection = styled.div`
  width: 206px;
  height: 103px;
  position: relative;
  overflow: hidden;
`;

const CircleProgressbar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 206px;
  height: 206px;
  border: 15px solid #5a5a5a;
  margin-top: 3px;
  border-radius: 50%;
  border-bottom-color: var(--bg-selected-light);
  border-right-color: var(--bg-selected-light);
  transform: ${({ degree }) => `rotate(${degree}deg)`};
`;

const IconProgressbar = styled(CircleProgressbar)`
  border: 15px solid transparent;

  & > svg {
    position: absolute;
    bottom: 8px;
    left: 10px;
    width: 24px;
    height: 24px;
    transform: rotate(270deg);
    z-index: 10;
  }
`;

export default HabitDetail;
