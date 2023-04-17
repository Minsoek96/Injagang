package com.injagang.docs;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.injagang.domain.ExpectedQuestion;
import com.injagang.domain.QuestionType;
import com.injagang.domain.User;
import com.injagang.helper.TestHelper;
import com.injagang.repository.ExpectedQuestionRepository;
import com.injagang.repository.UserRepository;
import com.injagang.request.DeleteIds;
import com.injagang.request.QuestionWrite;
import com.injagang.request.RandomRequest;
import com.injagang.service.QuestionService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.restdocs.mockmvc.MockMvcRestDocumentation;
import org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders;
import org.springframework.restdocs.mockmvc.RestDocumentationResultHandler;
import org.springframework.restdocs.payload.PayloadDocumentation;
import org.springframework.restdocs.request.RequestDocumentation;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import static org.springframework.http.MediaType.*;
import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.requestHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.*;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.*;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@AutoConfigureRestDocs(uriScheme = "https",uriHost = "api.injagang.com",uriPort = 443)
@ExtendWith(RestDocumentationExtension.class)
public class QuestionControllerDocsTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    QuestionService questionService;

    @Autowired
    ExpectedQuestionRepository questionRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    TestHelper testHelper;


    @AfterAll
    void after() {
        questionRepository.deleteAll();
        userRepository.deleteAll();

    }

    @BeforeEach
    void clean() {
        questionRepository.deleteAll();
        userRepository.deleteAll();
    }


    @Test
    @DisplayName("질문 추가")
    void test() throws Exception {

        User user = User.builder()
                .loginId("test")
                .nickname("test")
                .password("test")
                .email("test@test.com")
                .role("ADMIN")
                .build();

        userRepository.save(user);

        String jws = testHelper.makeAccessToken(user.getId());

        QuestionWrite questionWrite = new QuestionWrite(QuestionType.CS);

        questionWrite.addQuestion("CS QUESTION1");
        questionWrite.addQuestion("CS QUESTION2");
        questionWrite.addQuestion("CS QUESTION3");
        questionWrite.addQuestion("CS QUESTION4");

        String json = objectMapper.writeValueAsString(questionWrite);

        mockMvc.perform(post("/questions/add")
                        .contentType(APPLICATION_JSON)
                        .header("Authorization", jws)
                        .content(json))
                .andDo(document("question-add", requestHeaders(
                        headerWithName("Authorization").description("ADMIN 인증")
                ), requestFields(
                        fieldWithPath("questions[]").description("질문 리스트"),
                        fieldWithPath("questionType").description("질문의 타입(CS, SITUATION, JOB, PERSONALITY)")
                        )
                ));

    }

    @Test
    @DisplayName("랜덤 리스트")
    void test2() throws Exception {

        saveQuestions();

        List<RandomRequest> requests = new ArrayList<>();

        RandomRequest csRequest = RandomRequest.builder()
                .size(5)
                .questionType(QuestionType.CS)
                .build();

        RandomRequest jobRequest = RandomRequest.builder()
                .size(6)
                .questionType(QuestionType.JOB)
                .build();

        RandomRequest situationRequest = RandomRequest.builder()
                .size(7)
                .questionType(QuestionType.SITUATION)
                .build();

        RandomRequest personalityRequest = RandomRequest.builder()
                .size(8)
                .questionType(QuestionType.PERSONALITY)
                .build();

        requests.add(csRequest);
        requests.add(jobRequest);
        requests.add(situationRequest);
        requests.add(personalityRequest);

        String json = objectMapper.writeValueAsString(requests);


        mockMvc.perform(post("/questions/random")
                .contentType(APPLICATION_JSON)
                .content(json)
        ).andDo(document("question-random",

                requestFields(
                        fieldWithPath("[].size").description("가져올 질문의 수"),
                        fieldWithPath("[].questionType").description("질문의 타입(CS, SITUATION, JOB, PERSONALITY)")
                ),

                responseFields(
                        fieldWithPath("[].id").description("질문 ID"),
                        fieldWithPath("[].questions").description("질문 내용")
                )));



    }

    @Test
    @DisplayName("질문 리스트")
    void test3() throws Exception {

        saveQuestions();


        mockMvc.perform(get("/questions?questionType=SITUATION"))
                .andDo(document("question-list", requestParameters(
                        parameterWithName("questionType").description("질문의 타입(CS, SITUATION, JOB, PERSONALITY) 없을 시 모든 질문 리스트")
                ),responseFields(
                        fieldWithPath("[].id").description("질문 ID"),
                        fieldWithPath("[].questions").description("질문 내용")
                )));

    }

    @Test
    @DisplayName("질문 삭제")
    void test4() throws Exception {

        User user = User.builder()
                .loginId("test")
                .nickname("test")
                .password("test")
                .email("test@test.com")
                .role("ADMIN")
                .build();

        userRepository.save(user);

        String jws = testHelper.makeAccessToken(user.getId());


        saveQuestions();

        DeleteIds ids = new DeleteIds();

        ids.addId(1L);
        ids.addId(2L);
        ids.addId(3L);
        ids.addId(4L);

        String json = objectMapper.writeValueAsString(ids);

        mockMvc.perform(delete("/questions")
                .contentType(APPLICATION_JSON)
                .content(json)
                .header("Authorization", jws))
                .andDo(document("question-delete",requestHeaders(
                        headerWithName("Authorization").description("ADMIN 인증")
                ),requestFields(
                        fieldWithPath("ids[]").description("삭제할 질문 ID")
                )));

    }

    private void saveQuestions() {
//        CS, SITUATION, JOB, PERSONALITY;

        List<ExpectedQuestion> save = new ArrayList<>();

        IntStream.rangeClosed(0,9)
                .forEach(
                        i->{
                            save.add(
                                    ExpectedQuestion.builder()
                                            .question("CS" + i)
                                            .questionType(QuestionType.CS)
                                            .build()
                            );


                        }

                );

        IntStream.rangeClosed(0,9)
                .forEach(
                        i->{
                            save.add(
                                    ExpectedQuestion.builder()
                                            .question("SITUATION" + i)
                                            .questionType(QuestionType.SITUATION)
                                            .build()
                            );


                        }

                );

        IntStream.rangeClosed(0,9)
                .forEach(
                        i->{
                            save.add(
                                    ExpectedQuestion.builder()
                                            .question("JOB" + i)
                                            .questionType(QuestionType.JOB)
                                            .build()
                            );


                        }

                );

        IntStream.rangeClosed(0,9)
                .forEach(
                        i->{
                            save.add(
                                    ExpectedQuestion.builder()
                                            .question("PERSONALITY" + i)
                                            .questionType(QuestionType.PERSONALITY)
                                            .build()
                            );


                        }

                );

        questionRepository.saveAll(save);


    }

}
