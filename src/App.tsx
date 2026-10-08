import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Footer } from './components/Footer';
import { GlobalStyle, Message } from './styles';
export function App() { const { pathname } = useLocation(); useEffect(()=>{window.scrollTo(0,0);},[pathname]); return <><GlobalStyle /><Routes><Route path="/" element={<Home />} /><Route path="/restaurante/:id" element={<Profile />} /><Route path="*" element={<Message><h1>Página não encontrada</h1><Link to="/">Voltar aos restaurantes</Link></Message>} /></Routes><Footer /></>; }
