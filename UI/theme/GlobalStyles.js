import { createGlobalStyle } from 'styled-components'

export const DesignSystemGlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Chunq';
    src: url('/fonts/Chunq.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  *, *::before, *::after { box-sizing: border-box; }

  html { overflow-x: hidden; }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.charcoal};
    background: ${({ theme }) => theme.colors.cream};
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
  }

  img { display: block; max-width: 100%; }
  a   { color: inherit; text-decoration: none; }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0;
    margin: -1px; overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }

  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  [data-reveal] {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.2,0.7,0.2,1);
  }
  [data-reveal].in { opacity: 1; transform: translateY(0); }
`
