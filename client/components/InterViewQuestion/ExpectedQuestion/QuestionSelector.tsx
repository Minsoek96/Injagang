import React from "react";

import styled from "styled-components";

import ControlMenu from "@/components/UI/ControlMenu";

import { QuestionType } from "@/types/InterViewQuestion/InterViewQuestionType";

const InterViewSelectData = [
  { title: QuestionType.CS, id: 1 },
  { title: QuestionType.SITUATION, id: 2 },
  { title: QuestionType.JOB, id: 3 },
  { title: QuestionType.PERSONALITY, id: 4 },
  { title: "ALL", id: 5 },
];

interface IQuestionSelectorProps {
  selectedType: QuestionType | string;
  onChange: (type: QuestionType | string) => void;
}

const QuestionSelector = ({
  selectedType,
  onChange,
}: IQuestionSelectorProps) => {
  return (
    <Container>
      <ControlMenu
        value={selectedType}
        optionList={InterViewSelectData}
        onChange={onChange}
        Size={{ width: "100%", height: "30px" }}
      ></ControlMenu>
    </Container>
  );
};

export default React.memo(QuestionSelector);

const Container = styled.div`
  margin-bottom: 15px;
`;
