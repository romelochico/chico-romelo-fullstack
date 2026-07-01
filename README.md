# Chico Romelo — Next.js

Transposição do site estático para **Next.js 14** com **styled-components 6**.

## Estrutura

```
src/
├── lib/
│   ├── theme.js          # Design tokens (cores, fontes, breakpoints)
│   └── data.js           # Dados estáticos (membros, setlist, shows, news)
├── styles/
│   ├── GlobalStyles.js   # Estilos globais (reset, @font-face, keyframes)
│   └── pages/            # Estilos específicos de cada página
├── hooks/
│   ├── useScrollReveal.js
│   ├── useNavDrawer.js
│   └── useStreamingModal.js
├── components/           # Componentes reutilizáveis (cada um com .styles.js)
│   ├── Icons/
│   ├── Nav/
│   ├── Footer/
│   ├── Marquee/
│   ├── PageHero/
│   ├── EyeMarqueeGroup/
│   ├── SectionLabel/
│   ├── StreamBtn/
│   ├── StreamingModal/
│   ├── MemberCard/
│   ├── ShowCard/
│   ├── Clipping/
│   └── TrackList/
└── pages/                # Rotas Next.js
    ├── _app.jsx
    ├── _document.jsx
    ├── index.jsx         → /
    ├── sobre.jsx         → /sobre
    ├── lancamentos.jsx   → /lancamentos
    ├── novidades.jsx     → /novidades
    ├── agenda.jsx        → /agenda
    ├── imprensa.jsx      → /imprensa
    └── contatos.jsx      → /contatos
```

## Assets

Copie as pastas `assets/` e `uploads/` do site original para `public/`:

```
public/
├── fonts/
│   └── Chunq.ttf         # Copie de chico-romelo-site/uploads/Chunq.ttf
├── assets/               # Copie de chico-romelo-site/assets/
├── uploads/              # Copie de chico-romelo-site/uploads/ (só imagens)
└── favicon.ico
```

## Instalação

```bash
npm install
npm run dev
```

## Formulário de contato

O formulário usa [Formspree](https://formspree.io/). O ID atual é `mykvzjkj`.  
Troque em `src/pages/contatos.jsx` se necessário.
