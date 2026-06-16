import React from 'react';
import styled from 'styled-components';
import { Card, SectionTitle, Btn } from '../../styles/commonComponents';

const InviteCard = styled(Card)`
  text-align: center;
  padding: 28px 20px;
`;

const Icon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const Title = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
`;

interface InviteSectionProps {
  onCopyClick: () => void;
}

export function InviteSection({ onCopyClick }: InviteSectionProps) {
  return (
    <>
      <SectionTitle>친구 초대</SectionTitle>
      <InviteCard>
        <Icon>🔗</Icon>
        <Title>초대 링크 공유</Title>
        <Subtitle>링크를 복사해 친구에게 보내세요</Subtitle>
        <Btn $variant="outline" onClick={onCopyClick}>
          🔗 초대 링크 복사
        </Btn>
      </InviteCard>
    </>
  );
}

export default InviteSection;
