import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
  height: ${({ theme }) => theme.dimensions.headerHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(13, 17, 23, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  z-index: 10;

  h2 {
    font-size: 17px;
    font-weight: 700;
  }
`;

interface HeaderProps {
  children?: ReactNode;
  title?: string;
  rightSlot?: ReactNode;
}

export function Header({ children, title, rightSlot }: HeaderProps) {
  return (
    <StyledHeader>
      {children ? (
        children
      ) : (
        <>
          <h2>{title}</h2>
          {rightSlot && <div>{rightSlot}</div>}
        </>
      )}
    </StyledHeader>
  );
}

export default Header;
