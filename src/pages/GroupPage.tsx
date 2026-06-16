import { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

// Components
import Header from '../components/common/Header';
import Modal from '../components/common/Modal';
import { ScreenContent, Btn, InputGroup, InputLabel, InputField, SectionTitle } from '../styles/commonComponents';
import GroupCard from '../components/group/GroupCard';
import MemberList from '../components/group/MemberList';
import type { Member } from '../components/group/MemberList';
import InviteSection from '../components/group/InviteSection';

const HeaderBtn = styled(Btn)`
  padding: 5px 8px;
  font-size: 13px;
  border-radius: 8px;
  width: auto;
`;

const ModalTitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const ModalEmoji = styled.div`
  font-size: 32px;
`;

const ModalName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ModalDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

export function GroupPage() {
  const { showToast } = useApp();
  const [activeModal, setActiveModal] = useState<'create' | 'family' | 'running' | null>(null);
  const [newGroupName, setNewGroupName] = useState('');

  const familyMembers: Member[] = [
    { avatar: '👨', name: '아빠 (나)', region: '서울 강남구', level: 'bad', levelLabel: '나쁨' },
    { avatar: '👩', name: '엄마', region: '서울 서초구', level: 'normal', levelLabel: '보통' },
    { avatar: '👧', name: '딸', region: '경기 수원시', level: 'good', levelLabel: '좋음' },
    { avatar: '👦', name: '아들', region: '서울 송파구', level: 'good', levelLabel: '좋음' },
  ];

  const runningMembers: Member[] = [
    { avatar: '🧑', name: '김러너 (방장)', region: '서울 종로구', level: 'normal', levelLabel: '보통' },
    { avatar: '👩‍🦱', name: '이조깅', region: '인천 남동구', level: 'bad', levelLabel: '나쁨' },
    { avatar: '👨', name: '박마라톤', region: '경기 성남시', level: 'good', levelLabel: '좋음' },
  ];

  const handleCreateGroupSubmit = (e: FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    showToast(`✨ 새 그룹 '${newGroupName}'이 생성되었습니다!`);
    setNewGroupName('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://dustmate.page.link/invite');
    showToast('🔗 초대 링크가 클립보드에 복사되었습니다!');
  };

  const handleAlertSend = (groupName: string) => {
    showToast(`🔔 '${groupName}' 그룹원들에게 경보를 전송했습니다!`);
  };

  return (
    <>
      <Header
        title="친구·가족 그룹"
        rightSlot={
          <HeaderBtn $variant="primary" onClick={() => setActiveModal('create')}>
            + 그룹 만들기
          </HeaderBtn>
        }
      />
      <ScreenContent>
        <SectionTitle>내 그룹</SectionTitle>
        <GroupCard
          emoji="👨‍👩‍👧"
          name="우리 가족"
          count={4}
          status="안전"
          badgeVariant="normal"
          avatars={['👨', '👩', '👧', '👦']}
          onCardClick={() => setActiveModal('family')}
          onAlertClick={() => handleAlertSend('우리 가족')}
        />
        <GroupCard
          emoji="🏃‍♂️"
          name="러닝 동호회"
          count={12}
          status="주의"
          badgeVariant="bad"
          avatars={['🧑', '👩‍🦱', '👨']}
          extraCount={9}
          iconBg="linear-gradient(135deg, rgba(165,214,167,0.2), rgba(27,94,32,0.2))"
          onCardClick={() => setActiveModal('running')}
          onAlertClick={() => handleAlertSend('러닝 동호회')}
        />
        <InviteSection onCopyClick={handleCopyLink} />
      </ScreenContent>

      {/* CREATE GROUP MODAL */}
      <Modal isOpen={activeModal === 'create'} onClose={() => setActiveModal(null)}>
        <ModalName style={{ marginBottom: '20px' }}>새 그룹 만들기</ModalName>
        <form onSubmit={handleCreateGroupSubmit}>
          <InputGroup>
            <InputLabel>그룹 이름</InputLabel>
            <InputField
              type="text"
              placeholder="예: 우리 가족, 등산 크루"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              required
            />
          </InputGroup>
          <ButtonRow>
            <Btn type="button" $variant="outline" style={{ flex: 1 }} onClick={() => setActiveModal(null)}>
              취소
            </Btn>
            <Btn type="submit" $variant="primary" style={{ flex: 1 }}>
              만들기
            </Btn>
          </ButtonRow>
        </form>
      </Modal>

      {/* FAMILY GROUP MODAL */}
      <Modal isOpen={activeModal === 'family'} onClose={() => setActiveModal(null)}>
        <ModalTitleBlock>
          <ModalEmoji>👨‍👩‍👧</ModalEmoji>
          <div>
            <ModalName>우리 가족</ModalName>
            <ModalDesc>멤버 4명 · 모두 안전</ModalDesc>
          </div>
        </ModalTitleBlock>
        <MemberList members={familyMembers} />
        <ButtonRow>
          <Btn
            $variant="outline"
            style={{ flex: 1 }}
            onClick={() => {
              setActiveModal(null);
              showToast('⚙️ 그룹 설정은 준비 중입니다');
            }}
          >
            ⚙️ 그룹 관리
          </Btn>
          <Btn
            $variant="danger"
            style={{ flex: 1 }}
            onClick={() => {
              setActiveModal(null);
              handleAlertSend('우리 가족');
            }}
          >
            📢 알림 전송
          </Btn>
        </ButtonRow>
      </Modal>

      {/* RUNNING GROUP MODAL */}
      <Modal isOpen={activeModal === 'running'} onClose={() => setActiveModal(null)}>
        <ModalTitleBlock>
          <ModalEmoji>🏃‍♂️</ModalEmoji>
          <div>
            <ModalName>러닝 동호회</ModalName>
            <ModalDesc>멤버 12명 · 외출 주의</ModalDesc>
          </div>
        </ModalTitleBlock>
        <MemberList members={runningMembers} />
        <ButtonRow>
          <Btn
            $variant="outline"
            style={{ flex: 1 }}
            onClick={() => {
              setActiveModal(null);
              showToast('⚙️ 그룹 설정은 준비 중입니다');
            }}
          >
            ⚙️ 그룹 관리
          </Btn>
          <Btn
            $variant="danger"
            style={{ flex: 1 }}
            onClick={() => {
              setActiveModal(null);
              handleAlertSend('러닝 동호회');
            }}
          >
            📢 알림 전송
          </Btn>
        </ButtonRow>
      </Modal>
    </>
  );
}

export default GroupPage;
