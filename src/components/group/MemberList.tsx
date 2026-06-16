import React from 'react';
import styled from 'styled-components';
import { Avatar, Badge, BadgeVariant, SectionTitle } from '../../styles/commonComponents';

const MemberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoCol = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Region = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export interface Member {
  avatar: string;
  name: string;
  region: string;
  level: BadgeVariant;
  levelLabel: string;
}

interface MemberListProps {
  members: Member[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <>
      <SectionTitle style={{ marginTop: 0 }}>멤버 현황</SectionTitle>
      <div>
        {members.map((member, idx) => (
          <MemberRow key={idx}>
            <Avatar>{member.avatar}</Avatar>
            <InfoCol>
              <Name>{member.name}</Name>
              <Region>{member.region}</Region>
            </InfoCol>
            <Badge $variant={member.level}>{member.levelLabel}</Badge>
          </MemberRow>
        ))}
      </div>
    </>
  );
}

export default MemberList;
