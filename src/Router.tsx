import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Channel from './pages/channel';
import Post from 'pages/post';
import Message from 'pages/message';
import Inbox from 'pages/inbox';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/:domain" element={<Channel />} />
        <Route path="/:domain/:channel" element={<Post />} />
        <Route path="/:domain/:channel/:post" element={<Message />} />
        <Route path="/:domain/inbox/:userId" element={<Inbox />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
