import { useState, type FormEvent, type MouseEvent } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Btn, InputField, InputGroup } from '../styles/commonComponents';
import { floatAnimation } from '../styles/animations';

const LoginContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  height: 100%;
`;

const FloatLogo = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  ${floatAnimation}
`;

const AppTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #fff, #8b949e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: 40px;
`;

const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SignupPrompt = styled.div`
  margin-top: 24px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.good};
    text-decoration: none;
    font-weight: 700;
  }
`;

export function LoginPage() {
  const { setLoggedIn, navigate, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoggedIn(true);
    navigate('home');
    showToast('👋 DustMate에 오신 것을 환영합니다!');
  };

  const handleKakaoLogin = () => {
    setLoggedIn(true);
    navigate('home');
    showToast('💬 카카오 계정으로 로그인했습니다.');
  };

  const handleDemoSignup = (e: MouseEvent) => {
    e.preventDefault();
    setLoggedIn(true);
    navigate('home');
    showToast('✨ 데모 계정으로 자동 가입 및 로그인되었습니다.');
  };

  return (
    <LoginContainer>
      <FloatLogo>🌪️</FloatLogo>
      <AppTitle>DustMate</AppTitle>
      <Subtitle>미세먼지 경보 알림 & 건강 관리 메이트</Subtitle>

      <LoginForm onSubmit={handleLoginSubmit}>
        <InputGroup style={{ textAlign: 'left' }}>
          <InputField
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup style={{ textAlign: 'left', marginBottom: '16px' }}>
          <InputField
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        <Btn type="submit" $variant="primary">
          로그인
        </Btn>
        <Btn type="button" $variant="kakao" onClick={handleKakaoLogin}>
          <span style={{ fontSize: '16px' }}>💬</span> 카카오 계정으로 시작하기
        </Btn>
      </LoginForm>
      <SignupPrompt>
        아직 회원이 아니신가요?{' '}
        <a href="#" onClick={handleDemoSignup}>
          지금 가입하기
        </a>
      </SignupPrompt>
    </LoginContainer>
  );
}

export default LoginPage;
