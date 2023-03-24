import { FlexBox } from "@/styles/GlobalStyle";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
// import { getToken } from "@/components/test/api";
import { authenTicate, clearAuthError } from "@/components/redux/Auth/actions";
import { RootReducerType } from "@/components/redux/store";
import { InitiaState } from "@/components/redux/Auth/reducer";

const LoginStyle = styled.div`
  ${FlexBox};
  height: 100vh;
  width: 100vw;
  background-color: #31404e;
  color: ${({ theme }) => theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border-radius: 8px;
  background-color: #15202b;
  box-shadow: 0 4px 8px rgba(14, 13, 13, 0.2);
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 8px 16px;
  width: 100%;
  background-color: #2ecc71;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border-radius: 4px;
  border: none;
  margin: 5px auto;
  cursor: pointer;
`;

const ERROR = styled.div`
  color: red;
`;

const LoginPage = () => {
  const [loginInfo, setLoginInfo] = useState({
    loginId: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("")
  const dispatch = useDispatch();
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const authReducer: InitiaState = useSelector(
    (state: RootReducerType) => state.auth,
  );
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(loginInfo);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginInfo(cur => ({
      ...cur,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    if(loginInfo.loginId.trim() === ""){
      setErrorMsg("아이디를 입력해주세요")
      loginRef.current?.focus()
      return
    }
    if(loginInfo.password.trim() === ""){
      setErrorMsg("비밀번호를 입력해주세요")
      passwordRef.current?.focus()
      return
    }
    const loginData = {
      loginId: loginInfo.loginId,
      password: loginInfo.password,
    };
    dispatch(authenTicate(loginData));
  };

  useEffect(() => {
    if (authReducer.success) {
      dispatch(clearAuthError());
      router.replace("/");
    }
    if (authReducer.error) { 
      setErrorMsg("아이디나 비밀번호가 일치하지않습니다.")
    }
  }, [authReducer.error,authReducer.success]);

  return (
    <LoginStyle>
      <Form onSubmit={handleSubmit}>
        <Label>아이디</Label>
        <Input
          ref= {loginRef}
          type="text"
          name="loginId"
          value={loginInfo.loginId}
          onChange={handleChange}
        />
        <Label>비밀번호</Label>
        <Input
          ref= {passwordRef}
          type="password"
          name="password"
          value={loginInfo.password}
          onChange={handleChange}
        />
        {authReducer.error && <ERROR> {errorMsg} </ERROR>}
        <Button type="submit" onClick={handleLogin}>
          로그인
        </Button>
        <Button onClick={() => router.replace("/join")}>회원가입</Button>
      </Form>
    </LoginStyle>
  );
};

export default LoginPage;
