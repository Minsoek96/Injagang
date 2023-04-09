import QuestionItem from "@/components/Edit/QuestionItem";
import ControlMenu from "@/components/UI/ControlMenu";
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import AddQustionList from "@/components/Edit/AddQustionList";
import CustomButton from "@/components/UI/CustomButton";
import { BiPlus } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootReducerType } from "@/components/redux/store";
import templateReducer, {
  InitiaState,
} from "@/components/redux/Template/reducer";
import { addEssay, updateEssay } from "@/components/redux/Essay/actions";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { ColBox } from "@/styles/GlobalStyle";
import QnAListTitle from "./QnAListTitle";
import essayReducer from "../redux/Essay/reducer";
import QuestionContent from "../QNA/Question/QuestionContent";

const QnAEditorStyle = styled.div`
  text-align: center;
  width: 100%;
  .content-container {
    ${ColBox}
    width: 100%;
    margin: 15px auto;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    text-decoration-line: underline;
  }

  select {
    width: 50%;
    height: 40px;
  }

  .button_container {
    ${ColBox}
    margin: 13px auto;
    width: 50%;
    .flex-end {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    svg {
      font-size: 50px;
      cursor: pointer;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  margin: 20px auto;
  padding: 20px;
  /* border: 1px solid #ccc; */
  border-radius: 10px;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); */
`;

const TitleInput = styled.input`
  width: 50%;
  height: 40px;
  border-radius: 5px;
  border-color: black;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0px 1px 0.5px rgba(0, 0, 0, 09);
  margin-bottom: 15px;
`;

type qna = {
  qnaId: number;
  question: string;
  answer: string;
};

interface QnAList {
  essayId?: number;
  templateId?: number;
  title: string;
  qnaList: Array<qna | string>;
}

interface qnaListItem {
  question: string;
  answer: string;
}

interface qnaList extends Array<qnaListItem> {}

type QnAEditorProps = {
  isEdit: boolean;
};

const QnAEditor = ({ isEdit }: QnAEditorProps) => {
  {
    /**리덕스에 대한 선언 */
  }
  const router = useRouter();
  const dispatch = useDispatch();
  /**나의 자소서를 호출중 판단여부 */
  const readEssayLoading = useSelector(
    (state: RootReducerType) => state.essay.loading,
  );
  /**나의 자소서 리스트 */
  const readEssayList = useSelector(
    (state: RootReducerType) => state.essay.readEssayList,
  );
  /**관리자의 샘플 리스트 */
  const templateReducer: InitiaState = useSelector(
    (state: RootReducerType) => state.template,
  );

  const [mainTitle, setMainTitle] = useState("");
  const [qnaLists, setQnALists] = useState<QnAList[]>([]);
  const [templateTitle, setTemplateTitle] = useState<string>("커스텀자소서");
  const [qnaContent, setQnAContent] = useState<qnaList>([]);
  const [couter, setCounter] = useState(5);

  /** ESSAY의 로딩이 완료가되면 useState에 반영한다. */
  useEffect(() => {
    if (!readEssayLoading) {
      if (readEssayList[0].title === "") {
        return;
      }
      setQnALists(readEssayList);
      setTemplateTitle(readEssayList[0]?.title);
    }
  }, [readEssayLoading]);

  /** 템플릿의 로딩이 완료가되면 useState에 반영한다. */
  useEffect(() => {
    if (!templateReducer.loading) {
      const customTemplate = {
        essayId: 10000,
        title: "커스텀자소서",
        qnaList: [],
      };
      setQnALists(cur => [customTemplate, ...templateReducer.templateList]);
    }
  }, [templateReducer.templateList]);

  /** 수정모드에서는 기존의 리스트를 반환, 작성모드에서는 선택된 템플릿 리스트를 반환 */
  const getQuestionItem = useCallback(() => {
    if (isEdit) {
      return qnaLists;
    }
    const filteItem = qnaLists.filter(list => list.title === templateTitle);
    console.log({ qnaLists });
    console.log({ filteItem });
    return filteItem;
  }, [templateTitle, qnaLists]);

  const handleChangeMainTitle = (title: string) => {
    setMainTitle(title);
  };

  
  /**질문FORM 추가 함수 */
  const handleAddQnA = () => {
    if (templateTitle === "") {
      return;
    }
    setQnALists(prevLists => {
      const newLists = [...prevLists];
      const filterIndex = newLists.findIndex(a => a.title === templateTitle);
      const newContent = [...newLists[filterIndex].qnaList, " "];
      newLists[filterIndex].qnaList = newContent;
      return newLists;
    });
  };

  const handleChangeText = (
    index: number,
    question: string,
    answer: string,
  ) => {
    const filterList = qnaContent[index];
    if(filterList) {
      const newList = [...qnaContent];
      newList[index].question = question;
      newList[index].answer = answer;
      setQnAContent(newList);     
    } else {
      setQnAContent(curList => [...curList, {question: "", answer: ""}])
    }
    console.log(qnaContent)
  };

  const handleSubmit = () => {};

  return (
    <QnAEditorStyle>
      <h2>{isEdit ? "자소서 수정하기" : "자소서 작성하기"}</h2>
      <Container>
        <QnAListTitle handleChangeMainTitle={handleChangeMainTitle} />
        <ControlMenu
          Size={{ width: "10", height: "10" }}
          value={templateTitle}
          optionList={qnaLists}
          onChange={setTemplateTitle}
        />
        {qnaLists &&
          getQuestionItem().map((list, index) => (
            <div className="content-container" key={list.essayId}>
              {list.qnaList.map((list, idx) => (
                <QuestionItem
                  key={idx}
                  content={list}
                  templateTitle={templateTitle}
                  onChange={handleChangeText}
                  index={idx}
                ></QuestionItem>
              ))}
            </div>
          ))}
      </Container>
      <div className="button_container">
        <BiPlus onClick={handleAddQnA}></BiPlus>
        <div className="flex-end">
          <CustomButton
            Size={{ width: "150px", font: "20px" }}
            onClick={() => router.push("/myEssay")}
            text="뒤로가기"
          />
          <CustomButton
            Size={{ width: "150px", font: "20px" }}
            onClick={handleSubmit}
            text={isEdit ? "수정완료" : "작성완료"}
          />
        </div>
      </div>
    </QnAEditorStyle>
  );
};

export default QnAEditor;