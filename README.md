# Milhas com Fran Carrillo — site 2.0

Landing page da Imersão presencial "Milhas com Fran Carrillo" (São Roque/SP).

Site estático: abra `index.html` no navegador ou publique a pasta em qualquer hospedagem (GitHub Pages, Netlify, Vercel, Hostinger…).

## Estrutura

- `index.html` — conteúdo, SEO e dados estruturados (Event)
- `css/style.css` — identidade (grafite das fotos, vermelho da marca, branco) e layout
- `js/main.js` — painel split-flap, contador de milhas, checklist, etiquetas de bagagem, hodômetro, depoimentos arrastáveis, bilhete e animações (GSAP + Lenis)
- `assets/` — fotos da Fran, selo "Milhas com Fran Carrillo", prints de depoimentos e favicon

## Atualizar as turmas

No `index.html`, procure por "Escolha sua turma". Cada turma é um `<label class="dep">`:

- `value` = data (ex.: `29/09`) e `data-time` = horário (ex.: `18h30 às 22h30`) — usados na mensagem de WhatsApp;
- turma esgotada: adicione `is-soldout` na classe do label e `disabled` no input;
- a turma marcada com `checked` é a pré-selecionada.

## Observações

- O vídeo de depoimento é carregado do WordPress atual (`wp-content/uploads/.../depoimento_marcelosilverio.mov`, 85 MB). Ao desligar o WordPress, converta para MP4 e hospede junto com o site.
- Fontes (Big Shoulders Display, Fraunces, Manrope, JetBrains Mono) e bibliotecas de animação são carregadas por CDN.
