import React from 'react';
import styled from 'styled-components';
import { Card, SectionTitle, Badge, BadgeVariant } from '../../styles/commonComponents';

const StyledCard = styled(Card)`
  cursor: pointer;
  
  &:first-of-type {
    margin-bottom: 8px;
  }
`;

const ContentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Emoji = styled.div`
  font-size: 28px;
`;

const GroupInfo = styled.div`
  flex: 1;
`;

const GroupName = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const GroupDesc = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface GroupMiniViewProps {
  onGroupClick: () => void;
}

export function GroupMiniView({ onGroupClick }: GroupMiniViewProps) {
  const mockGroups = [
    {
      id: 1,
      emoji: '👨‍👩‍👧',
      name: '우리 가족',
      desc: '멤버 4명 · 모두 안전',
      status: '안전',
      badgeVariant: 'normal' as BadgeVariant,
    },
    {
      id: 2,
      emoji: '🏃‍♂️',
      name: '러닝 동호회',
      desc: '멤버 12명 · 외출 주의',
      status: '주의',
      badgeVariant: 'bad' as BadgeVariant,
    },
  ];

  return (
    <>
      <SectionTitle>내 그룹</SectionTitle>
      {mockGroups.map((group) => (
        <StyledCard key={group.id} onClick={onGroupClick}>
          <ContentRow>
            <Emoji>{group.emoji}</Emoji>
            <GroupInfo>
              <GroupName>{group.name}</GroupName>
              <GroupDesc>{group.desc}</GroupDesc>
            </GroupInfo>
            <Badge $variant={group.badgeVariant}>{group.status}</Badge>
          </ContentRow>
        </StyledCard>
      ))}
    </>
  );
}

export default GroupMiniView;
