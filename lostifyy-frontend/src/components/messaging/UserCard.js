import React from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.surface.elevated};
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid ${props => props.theme.border.light};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  font-size: 14px;
  margin-bottom: 2px;
`;

const UserMeta = styled.div`
  font-size: 12px;
  color: ${props => props.theme.text.secondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 8px;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.theme.primary.main};
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary.dark};
    transform: scale(1.1);
  }

  svg {
    font-size: 12px;
  }
`;

const UserCard = ({ user, showContactInfo = false }) => {
  if (!user) return null;

  return (
    <Card>
      <Avatar>
        {user.username.charAt(0).toUpperCase()}
      </Avatar>
      
      <UserInfo>
        <UserName>{user.username}</UserName>
        <UserMeta>
          <span>Active user</span>
        </UserMeta>
      </UserInfo>

      {showContactInfo && (
        <ContactInfo>
          {user.email && (
            <ContactLink href={`mailto:${user.email}`} title="Send Email">
              <FaEnvelope />
            </ContactLink>
          )}
          {user.phoneNumber && (
            <ContactLink href={`tel:${user.phoneNumber}`} title="Call">
              <FaPhone />
            </ContactLink>
          )}
        </ContactInfo>
      )}
    </Card>
  );
};

export default UserCard;