import styled, { createGlobalStyle, keyframes } from 'styled-components';

export const colors = { coral: '#e66767', cream: '#ffebd9', background: '#fff8f2', white: '#fff', text: '#4b4b4b' };
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; background: ${colors.background}; color: ${colors.coral}; font-family: 'Roboto', sans-serif; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
  h1, h2, h3, p { margin: 0; }
  button, input { font: inherit; }
  button, a { -webkit-tap-highlight-color: transparent; }
  button { cursor: pointer; }
  button:disabled { cursor: wait; opacity: .7; }
  a { color: inherit; }
  img { display: block; max-width: 100%; }
  :focus-visible { outline: 3px solid #4b4b4b; outline-offset: 3px; }
  dialog { border: 0; }
  dialog::backdrop { background: rgba(0,0,0,.8); }
  body:has(dialog[open]) { overflow: hidden; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
`;
export const Container = styled.div`width: min(1024px, calc(100% - 32px)); margin: 0 auto;`;
export const Button = styled.button<{ $light?: boolean; $full?: boolean }>`
  border: 0; padding: 4px 6px; min-height: 24px; font-size: 14px; line-height: 16px; font-weight: 700;
  color: ${({ $light }) => $light ? colors.coral : colors.cream};
  background: ${({ $light }) => $light ? colors.cream : colors.coral};
  width: ${({ $full }) => $full ? '100%' : 'auto'}; transition: filter .15s;
  &:hover:not(:disabled) { filter: brightness(.93); }
  @media (pointer: coarse) { min-height: 44px; }
`;
export const ActionLink = styled.a`display: inline-block; background: ${colors.coral}; color: ${colors.cream}; padding: 4px 6px; font-size: 14px; font-weight: 700; line-height: 16px; text-decoration: none; &:hover { filter: brightness(.93); } @media (pointer: coarse) { padding: 14px 8px; }`;
const rotate = keyframes`to { transform: rotate(360deg); }`;
export const Loader = styled.div`width: 32px; height: 32px; border: 3px solid ${colors.cream}; border-top-color: ${colors.coral}; border-radius: 50%; animation: ${rotate} .8s linear infinite; margin: 0 auto 16px;`;
export const Message = styled.div`max-width: 600px; text-align: center; padding: 64px 16px; margin: auto; h1, h2 { font-size: 22px; margin-bottom: 16px; } p { line-height: 1.6; margin-bottom: 24px; }`;
