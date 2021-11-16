import React from 'react';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { BackButtonHeader, BottomFixedButton } from '../components/common';
import { NewHabitPresetItem } from '../components/newHabit';

import { useHabitPresets } from '../hooks';
import { PencilIcon } from '../assets/icons/habits';

const NewHabitPresetList = () => {
  const { state: selectedHabitCategory } = useLocation();
  const history = useHistory();

  const { presetList, onPresetClicked, selectedPresetId, onSaveButtonClicked } =
    useHabitPresets();

  if (!selectedHabitCategory) {
    return <Redirect to="/new" />;
  }

  return (
    <>
      <Wrapper>
        <Inner>
          <Header>
            <BackButtonHeader
              pageTitleText={selectedHabitCategory.name}
              onButtonClick={() => history.replace('/new')}
            />
          </Header>
          <HelperText>이런 습관은 어때요?</HelperText>
          {presetList.map(
            ({ count, description, period, practiceDays, title, presetId }) => (
              <NewHabitPresetItem
                key={presetId}
                frequency={count}
                description={description}
                period={period}
                days={practiceDays}
                title={title}
                id={presetId}
                onClick={() => onPresetClicked(presetId)}
                isSelected={selectedPresetId === presetId}
              />
            ),
          )}
          <Hands
            isSelected={Boolean(selectedPresetId)}
            onClick={() =>
              history.push({
                pathname: 'detail',
                state: selectedHabitCategory,
              })
            }
          >
            <span>
              <PencilIcon />
              직접 작성하기
            </span>
          </Hands>
        </Inner>
      </Wrapper>
      <BottomFixedButton
        text="저장하기"
        condition={() => selectedPresetId}
        onClick={onSaveButtonClicked}
      />
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--bg-wrapper-gradient);
`;

const Inner = styled.div`
  padding: 0 24px;
  background: inherit;
`;

const Header = styled.div`
  margin-top: 24px;
  margin-bottom: 12px;
`;

const HelperText = styled.h2`
  color: var(--color-primary);
  font-size: var(--font-xxl);
  font-weight: var(--weight-semi-regular);
  line-height: 32px;
  margin-bottom: 20px;
`;

const Hands = styled.div`
  width: 312px;
  background: var(--bg-primary);
  border: none;
  border-radius: 4px;
  margin-bottom: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all var(--animation-duration) cubic-bezier(0.42, 0, 0.58, 1);
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);

  & span {
    padding: 14px 0px;
    color: var(--color-primary);
    font-weight: var(--weight-regular);
    font-size: var(--font-l);
    line-height: 22px;
    position: relative;

    & svg {
      position: absolute;
      left: -30px;
    }
  }
`;

export default NewHabitPresetList;
