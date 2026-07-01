import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Chunq';
    src: url('/fonts/Chunq.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  *, *::before, *::after { box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  html, body { margin: 0; padding: 0; }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.charcoal};
    background: ${({ theme }) => theme.colors.cream};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  img { display: block; max-width: 100%; }
  a   { color: inherit; text-decoration: none; }

  /* ── Keyframes ─────────────────────────── */
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }

  @keyframes hero-fade-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes polaroid-in-1 {
    0%   { opacity: 0; transform: rotate(-7deg) translate(-120px, -80px) scale(0.7); }
    100% { opacity: 1; transform: rotate(-7deg) translate(0, 0) scale(1); }
  }
  @keyframes polaroid-in-2 {
    0%   { opacity: 0; transform: rotate(5deg) translate(100px, -60px) scale(0.7); }
    100% { opacity: 1; transform: rotate(5deg) translate(0, 0) scale(1); }
  }
  @keyframes polaroid-in-3 {
    0%   { opacity: 0; transform: rotate(-3deg) translate(80px, 100px) scale(0.7); }
    100% { opacity: 1; transform: rotate(-3deg) translate(0, 0) scale(1); }
  }
  @keyframes polaroid-in-4 {
    0%   { opacity: 0; transform: rotate(8deg) translate(-100px, 60px) scale(0.7); }
    100% { opacity: 1; transform: rotate(8deg) translate(0, 0) scale(1); }
  }
  @keyframes polaroid-in-5 {
    0%   { opacity: 0; transform: rotate(-5deg) translate(-60px, 120px) scale(0.7); }
    100% { opacity: 1; transform: rotate(-5deg) translate(0, 0) scale(1); }
  }

  @keyframes fade-in {
    to { opacity: 1; }
  }

  /* ── Scroll reveal ─────────────────────── */
  [data-reveal] {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  [data-reveal].in {
    opacity: 1;
    transform: translateY(0);
  }
`

export default GlobalStyles
