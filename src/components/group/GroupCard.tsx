import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { Card, Badge, BadgeVariant, Btn, Avatar } from '../../styles/commonComponents';

const StyledGroupCard = styled(Card)`
  margin-bottom: 12px;
  cursor: pointer;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;

const GroupIcon = styled.div<{ $bg?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ $bg }) => $bg || 'linear-gradient(135deg, rgba(79, 195, 247, 0.2), rgba(2, 136, 209, 0.2))'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`;

const GroupName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const GroupCount = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const AvatarRow = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const GroupAvatar = styled(Avatar)`
  margin-right: -8px;
  border: 2px solid ${({ theme }) => theme.colors.bgSecondary};
`;

const PlusAvatar = styled(GroupAvatar)`
  background: rgba(255, 255, 255, 0.05);
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface GroupCardProps {
  emoji: string;
  name: string;
  count: number;
  status: string;
  badgeVariant: BadgeVariant;
  avatars: string[];
  extraCount?: number;
  iconBg?: string;
  onCardClick: () => void;
  onAlertClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function GroupCard({
  emoji,
  name,
  count,
  status,
  badgeVariant,
  avatars,
  extraCount,
  iconBg,
  onCardClick,
  onAlertClick,
}: GroupCardProps) {
  const handleAlertBtnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAlertClick(e);
  };

  return (
    <StyledGroupCard onClick={onCardClick}>
      <GroupHeader>
        <GroupIcon $bg={iconBg}>{emoji}</GroupIcon>
        <div>
          <GroupName>{name}</GroupName>
          <GroupCount>멤버 {count}명</GroupCount>
        </div>
        <Badge $variant={badgeVariant} style={{ marginLeft: 'auto' }}>
          {status}
        </Badge>
      </GroupHeader>
      <AvatarRow>
        {avatars.map((av, idx) => (
          <GroupAvatar key={idx}>{av}</GroupAvatar>
        ))}
        {extraCount !== undefined && extraCount > 0 && (
          <PlusAvatar>+{extraCount}</PlusAvatar>
        )}
      </AvatarRow>
      <Btn $variant="danger" $size="sm" onClick={handleAlertBtnClick}>
        📢 위험 알림 전송
      </Btn>
    </StyledGroupCard>
  );
}

export default GroupCard;
