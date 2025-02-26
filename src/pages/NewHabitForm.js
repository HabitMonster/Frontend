import React, { useState } from 'react';
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import { useRecoilState } from 'recoil';
import {
  habitIdListState,
  habitListState,
  myHabitCountState,
} from '../recoil/states/habit';

import { addHabitApis } from '../api';

import { BackButtonHeader, BottomFixedButton } from '../components/common';
import {
  NewHabitDetailTitle,
  NewHabitDetailDescription,
  NewHabitDetailDueDatePicker,
  NewHabitDayPicker,
  NewHabitFrequencySection,
} from '../components/newHabit';

import { OK } from '../constants/statusCode';

import { disappearScrollbar } from '../styles';

const NewHabitForm = () => {
  const history = useHistory();
  const { state: broughtHabitState } = useLocation();

  const [title, setTitle] = useState(broughtHabitState?.title ?? '');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState({
    start: null,
    end: null,
  });

  const [practiceDays, setPracticeDays] = useState('');
  const [frequency, setFrequency] = useState(0);
  const [habitList, setHabitList] = useRecoilState(habitListState);
  const [habitIdList, setHabitIdList] = useRecoilState(habitIdListState);
  const [habitCount, setHabitCount] = useRecoilState(myHabitCountState);

  const condition =
    title &&
    title.length <= 10 &&
    description &&
    description.length <= 120 &&
    duration.start &&
    duration.end &&
    practiceDays &&
    frequency;

  const handleSaveButtonClick = async () => {
    const body = {
      title,
      description,
      durationStart: duration.start,
      durationEnd: duration.end,
      count: frequency,
      categoryId: broughtHabitState.categoryId,
      practiceDays: practiceDays,
    };

    const currentDay = new Date().getDay() === 0 ? 7 : new Date().getDay();

    try {
      const { data } = await addHabitApis.saveHabitWithHands(body);

      if (
        data.statusCode === OK &&
        data.habit.practiceDays.includes(String(currentDay))
      ) {
        setHabitIdList([data.habit.habitId, ...habitIdList]);
        setHabitList([data.habit, ...habitList]);
      }
      setHabitCount(habitCount + 1);
      history.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (!broughtHabitState) {
    return <Redirect to="/new" />;
  }

  return (
    <Wrapper className="newHabitWrapper">
      <Header>
        <BackButtonHeader
          onButtonClick={() => history.goBack()}
          pageTitleText="직접 작성하기"
        />
      </Header>
      <Inner>
        <MarginInterval mb="24">
          <NewHabitDetailTitle
            isEditMode={false}
            title={title}
            update={setTitle}
            disabled={Boolean(broughtHabitState.title)}
          />
        </MarginInterval>
        <MarginInterval mb="24">
          <NewHabitDetailDescription
            isEditMode={false}
            description={description}
            update={setDescription}
          />
        </MarginInterval>
        <MarginInterval mb="24">
          <NewHabitDetailDueDatePicker
            isEditMode={false}
            duration={duration}
            onDurationChecked={setDuration}
          />
        </MarginInterval>
        <MarginInterval mb="24">
          <NewHabitDayPicker
            isEditMode={false}
            days={practiceDays}
            onDayPicked={setPracticeDays}
          />
        </MarginInterval>
        <MarginInterval>
          <NewHabitFrequencySection
            frequency={frequency}
            onChange={setFrequency}
          />
        </MarginInterval>
      </Inner>
      <BottomFixedButton
        condition={() => condition}
        text="저장하기"
        onClick={handleSaveButtonClick}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  position: ${isMobile ? 'fixed' : 'relative'};
  ${isMobile && `top: 0; left: 0; right: 0; bottom: 0;`};
  background: var(--bg-wrapper);
  overflow-y: scroll;
  ${disappearScrollbar()};
`;

const Inner = styled.div`
  padding: 0 24px;
  padding-bottom: 100px;
`;

const Header = styled.section`
  margin-bottom: 40px;
`;

const MarginInterval = styled.div`
  margin-bottom: ${({ mb }) => (mb ? mb : '0')}px;
`;

export default NewHabitForm;
