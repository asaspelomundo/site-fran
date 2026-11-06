# Milhas com Fran Carrillo — site

Página única, institucional e comercial da Fran Carrillo: imersão presencial, curadoria de milhas, curso online, comunidade e e-books.

Site estático: abra `index.html` no navegador ou publique a pasta em qualquer hospedagem (GitHub Pages, Netlify, Vercel, Hostinger…).

## Estrutura

- `index.html` — conteúdo, SEO e dados estruturados (Person + Event de cada turma)
- `css/style.css` — identidade (grafite das fotos, vermelho da marca, branco) e layout
- `js/main.js` — configuração de links e WhatsApp, turmas, curadoria, painel split-flap, checklist, etiquetas, hodômetro, depoimentos e animações (GSAP + Lenis)
- `assets/` — fotos da Fran, selo "Milhas com Fran Carrillo", prints de depoimentos e favicon

## Configurações rápidas (topo do `js/main.js`)

- `WA_NUMBER` — WhatsApp oficial da Fran.
- `LINKS` — checkout/página do **curso**, da **comunidade** e de cada **e-book**. Enquanto um link estiver vazio, o botão abre o WhatsApp da Fran com a mensagem daquele produto (nenhum botão fica sem destino).
- `WA_MESSAGES` — mensagem inicial de cada botão.

Preços do curso, da comunidade e dos e-books **não aparecem** na página até serem aprovados. Ao aprovar, incluir no `index.html` (cartões e painel de produtos).

## Atualizar as turmas da imersão

No `index.html`, procure por "Escolha sua turma". Cada turma é um `<label class="dep">` com:

- `data-date="AAAA-MM-DD"` — a turma **some sozinha** depois dessa data; se todas passarem, aparece "Novas turmas em breve";
- `data-label` — texto que vai na mensagem do WhatsApp (ex.: `sábado, 28/11/2026, das 08h às 12h`);
- `data-short` — texto do bilhete (ex.: `Sáb 28/11 · 08h`);
- a turma com `checked` é a pré-selecionada.

Atualize também os dois blocos `Event` (startDate/endDate) no JSON-LD do `<head>`.

Ao alterar `css/style.css` ou `js/main.js`, aumente o número de versão (`?v=`) nas referências do HTML.

## Pendências (aprovação da Fran)

- Link/checkout e preço do curso online avulso.
- Preço, link de adesão e condições da Comunidade Milhas com Fran.
- Preços e links de compra dos e-books.
- Endereço completo da imersão e capacidade por turma.
- Link oficial da página da Fran e demais canais sociais.
- O vídeo de depoimento ainda é carregado do WordPress antigo (`depoimento_marcelosilverio.mov`, 85 MB): converter para MP4 e hospedar junto com o site antes de desligar o WordPress.
