import React from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.surface.elevated};
  border-radius: ${props => props.theme.radius.lg};
  border: 1px solid ${props => props.theme.border.light};
`;

const Avatar = styled.div`
  width: ${props => props.size === 'large' ? '56px' : '40px'};
  height: ${props => props.size === 'large' ? '56px' : '40px'};
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${props => props.size === 'large' ? '20px' : '16px'};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.text.primary};
  margin-bottom: 4px;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.text.secondary};
  
  svg {
    color: ${props => props.theme.primary.main};
    font-size: 12px;
  }
`;

const ContactActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => props.theme.primary.main};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.radius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.primary.dark};
    transform: translateY(-1px);
  }

  svg {
    font-size: 12px;
  }
`;

const UserProfile = ({ 
  user, 
  showContactInfo = false, 
  showJoinDate = false, 
  size = 'medium',
  className 
}) => {
  if (!user) return null;

  return (
    <ProfileContainer className={className}>
      <Avatar size={size}>
        {user.username.charAt(0).toUpperCase()}
      </Avatar>
      
      <UserInfo>
        <UserName>{user.username}</UserName>
        <UserMeta>
          {showJoinDate && (
            <MetaItem>
              <FaCalendarAlt />
              <span>Member since {formatDistanceToNow(new Date(), { addSuffix: true })}</span>
            </MetaItem>
          )}
          {showContactInfo && user.email && (
            <MetaItem>
              <FaEnvelope />
              <span>{user.email}</span>
            </MetaItem>
          )}
          {showContactInfo && user.phoneNumber && (
            <MetaItem>
              <FaPhone />
              <span>{user.phoneNumber}</span>
            </MetaItem>
          )}
        </UserMeta>
      </UserInfo>

      {showContactInfo && (
        <ContactActions>
          {user.email && (
            <ContactLink href={`mailto:${user.email}`}>
              <FaEnvelope />
              Email
            </ContactLink>
          )}
          {user.phoneNumber && (
            <ContactLink href={`tel:${user.phoneNumber}`}>
              <FaPhone />
              Call
            </ContactLink>
          )}
        </ContactActions>
      )}
    </ProfileContainer>
  );
};

export default UserProfile;