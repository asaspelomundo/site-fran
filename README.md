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

Preços do curso e da comunidade **não aparecem** na página até serem aprovados. Ao aprovar, incluir no `index.html` (cartões e painel de produtos).

## E-books

Cada cartão tem o botão **Pegar meu e-book**: abre um formulário no próprio cartão (nome, e-mail e telefone). Ao enviar, os dados vão para o **Google Forms** "Pedidos de e-book" da conta **voeasaspelomundo@gmail.com** (aba Respostas, ou a planilha ligada a ele) e aparece o botão **Baixar e-book**.

- **Configuração obrigatória do Google Forms:** em Configurações → Respostas, "Coletar endereços de e-mail" precisa estar em **Não coletar**. Se o formulário exigir login, as respostas vindas do site **não são salvas** (e o site não tem como perceber).
- **Aviso de novos pedidos:** no Google Forms, aba Respostas → ⋮ → "Receber notificações por e-mail para novas respostas".
- **Não apague nem recrie as perguntas** (nome, email, telefone, ebook): cada uma tem um código (`entry.…`) usado em `LEAD_FIELDS`, no topo de `js/main.js`. Mudar o texto da pergunta não tem problema.
- **PDFs:** ficam em `assets/ebooks/` e são indicados em `arquivo`, em `EBOOKS` (mesmo arquivo). Se `arquivo` ficar vazio, depois do formulário o botão leva ao WhatsApp da Fran.
- **Atualizar um e-book:** substitua o PDF em `assets/ebooks/` mantendo o mesmo nome de arquivo; não é preciso mexer no código. A Vercel não deixa o PDF antigo guardado no navegador, então a versão nova vale assim que a publicação termina. Versão atual: edição revisada de novembro de 2026, 8 páginas cada (atualizada em 09/11/2026).

## Ícone e prévia no WhatsApp

- **Ícone (aba e iPhone):** `assets/favicon.png` (redondo) e `assets/apple-touch-icon.png` (quadrado). Usam as cores do site: o carvão `#1f2121` com o selo branco. O vermelho forte saiu a pedido da Fran (09/11).
- **Prévia ao compartilhar o link:** `og:image` é `assets/og-icone.png` (256×256, redonda), e `twitter:card` é `summary`. Com imagem pequena e quadrada, o WhatsApp mostra a "bolinha" com o texto ao lado. A `og:image` antiga apontava para o WordPress, que saiu do ar.
- O WhatsApp guarda a prévia de um link já enviado. Para conferir uma mudança, mande o link com algo no final (ex.: `https://www.francarrillo.com.br/?v=2`).
- **Pendente:** o vídeo de depoimento (Marcelo Silvério) ainda aponta para o WordPress antigo (`wp-content/.../depoimento_marcelosilverio.mov`), que não existe mais. Falta o arquivo do vídeo, convertido para MP4, para hospedar no próprio site.

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
- Endereço completo da imersão e capacidade por turma.
- Link oficial da página da Fran e demais canais sociais.
- O vídeo de depoimento ainda é carregado do WordPress antigo (`depoimento_marcelosilverio.mov`, 85 MB): converter para MP4 e hospedar junto com o site antes de desligar o WordPress.
