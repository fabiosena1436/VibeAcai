// src/pages/Admin/AdminLayout/styles.js
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const AdminWrapper = styled.div`
  display: flex;
  position: relative;
  min-height: calc(100vh - 70px);
`;

export const Sidebar = styled.div`
  width: 240px;
  background-color: #4a044e;
  color: #e0d6ff;
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  z-index: 1000;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

export const SidebarTitle = styled.h2`
  color: #fff;
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 1.4em;
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

export const StyledNavLink = styled(NavLink)`
  display: block;
  color: #e0d6ff;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: #7c3aed;
    color: #fff;
    font-weight: bold;
  }
`;

export const ContentArea = styled.main`
  flex-grow: 1;
  padding: 30px;
  background-color: #f8fafc;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1100;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 80px;
    right: 15px;
    background-color: #7c3aed;
    color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

export const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.show ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;