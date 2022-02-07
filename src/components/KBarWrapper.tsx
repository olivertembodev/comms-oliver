import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
} from 'kbar';
import RenderResults from './RenderResults';
import Login from 'pages/login';
import Channel from 'pages/channel';
import Post from 'pages/post';
import Message from 'pages/message';
import Inbox from 'pages/inbox';

const searchStyle = {
  padding: '16px',
  fontSize: '17px',
  width: '100%',
  boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
  outline: 'none',
  border: 'none',
  borderBottom: '1px solid black',
  background: 'white',
  zIndex: '9999',
  color: 'black',
  boxShadow: 'none8',
};

const animatorStyle = {
  maxWidth: '600px',
  width: '100%',
  background: 'white',
  color: 'black',
  fontSize: '17px',
  zIndex: '9999',
  overflow: 'hidden',
  border: '1px solid black',
  boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.15)',
};
const initialActions = [];
const KBarWrapper = () => {
  return (
    <KBarProvider
      actions={initialActions}
      options={{
        enableHistory: true,
      }}
    >
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator style={animatorStyle}>
            <KBarSearch style={searchStyle} />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/:domain" element={<Channel />} />
        <Route path="/:domain/:channel" element={<Post />} />
        <Route path="/:domain/:channel/:post" element={<Message />} />
        <Route path="/:domain/inbox/:userId" element={<Inbox />} />
      </Routes>
    </KBarProvider>
  );
};
export default KBarWrapper;
