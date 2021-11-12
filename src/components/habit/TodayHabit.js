import React, { memo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { habitState, habitsState } from '../../recoil/states/habit';
import { monsterState } from '../../recoil/states/monster';
import { setFormattedDuration } from '../../utils/setFormatDuration';
import CategoryImage from '../../assets/images/habit';

import { habitApis } from '../../api';
import { mainApis } from '../../api';
import { OK } from '../../constants/statusCode';

const TodayHabit = ({ id }) => {
  const history = useHistory();
  const habitDetail = useRecoilValue(habitState(id));
  const setHabitList = useSetRecoilState(habitsState);
  const setMonster = useSetRecoilState(monsterState);

  const durationStart = setFormattedDuration(
    habitDetail.durationStart,
    'MD',
    '.',
  );

  const durationEnd = setFormattedDuration(habitDetail.durationEnd, 'MD', '.');

  const clickHandler = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await habitApis.checkHabit(id);
      if (data.statusCode === OK) {
        setHabitList((prev) => {
          const copy = prev.slice();
          const index = prev.findIndex((habit) => habit.habitId === id);
          copy[index] = data.habit;
          if (data.habit.isAccomplished) {
            copy.splice(index, 1);
          }
          return copy;
        });

        if (data.habit.isAccomplished) {
          try {
            const { data } = await mainApis.getMonsterInfo();
            setMonster(data.monster);
          } catch (error) {
            console.error(error);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onHabitClicked = () => {
    history.push(`/habit/${id}`);
  };

  return (
    <>
      <Card onClick={onHabitClicked}>
        <DetailContainer>
          <CategoryIcon category={habitDetail.category} />
          <Info>
            <HabitTitle>{habitDetail.title}</HabitTitle>
            <Period>
              {durationStart}~{durationEnd}
            </Period>
          </Info>
          <CountContainer>
            <Count>
              {habitDetail.current}/{habitDetail.count}
            </Count>
          </CountContainer>
        </DetailContainer>
        <CheckBtn onClick={clickHandler}>완료하기</CheckBtn>
      </Card>
    </>
  );
};

TodayHabit.propTypes = {
  id: PropTypes.number.isRequired,
};

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 24px 24px 17px;
  margin-bottom: 16px;
  font-family: var(--font-name-apple);
  background-color: var(--bg-primary);
  color: var(--color-primary);
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  z-index: 1;
`;

const DetailContainer = styled.div`
  display: flex;
  align-self: flex-start;
  width: 100%;
  box-sizing: border-box;
`;

const CategoryIcon = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 13px;
  background-image: url(${(props) => CategoryImage[props.category].src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  /* height: 42px; */
`;

const HabitTitle = styled.span`
  line-height: 19.2px;
  font-size: var(--font-m);
  font-weight: var(--weight-bold);
`;

const Period = styled.p`
  width: 256px;
  height: 14px;
  font-size: var(--font-xxs);
  font-weight: var(--weight-regular);
  opacity: 0.6;
`;

const CountContainer = styled.div`
  width: 28px;
  height: 17px;
`;

const Count = styled.span`
  line-height: 16.8px;
  font-family: var(--font-name-apple);
  font-size: var(--font-xs);
  font-weight: var(--weight-semi-bold);
`;

const CheckBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 264px;
  height: 40px;
  margin: 16px auto 0 auto;
  background-color: var(--bg-active);
  border-radius: 4px;
  box-sizing: border-box;
  z-index: 5;
  cursor: pointer;
`;

export default memo(TodayHabit);
