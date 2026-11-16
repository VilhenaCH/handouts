# Arquivo do Caso v2

Editor de handouts de investigação para Ordem Paranormal (tema da campanha: Assimilação).
Funciona no PC e no celular, tudo em HTML/JS puro, sem build e sem internet.

## Como usar

1. **Abrir:** dê duplo clique em `index.html` (funciona direto do arquivo, sem servidor). No celular, hospede a pasta em qualquer host estático (GitHub Pages, Netlify, Cloudflare Pages) e abra o link.
2. **Escolher um modelo** na lista (PC: coluna da esquerda · celular: botão *Modelos*).
3. **Editar** na aba *Conteúdo*. Tudo que você digita aparece na folha na hora e fica salvo no navegador.
4. **Estilo:** fonte do texto, da letra de mão e dos títulos (36 famílias embutidas), cor da tinta, cor do papel, desgaste, inclinação.
5. **Anexos:** aba *Anexos* — adicione, arraste, cole (Ctrl+V), redimensione, gire; filtros (Original, P&B, Xerox, Sépia, CFTV, Meio-tom) e molduras (Nenhuma, Fita, Clipe, Polaroid).
6. **Exportar:** aba *Exportar* — PNG ou PDF, escala 1×/2×/3×; no PDF, tamanho original ou A4. No celular abre o menu de compartilhar quando o aparelho suporta.
7. **Projeto:** *Salvar projeto* / *Abrir projeto* gera um `.json` com texto, estilo e imagens, para levar entre aparelhos.

## Marcações dentro de qualquer texto

| Digite | Resultado |
|---|---|
| `~~texto~~` | tarja preta (no estado **Mestre** o texto aparece por baixo) |
| `{{texto}}` | nota de margem escrita à mão (camada *Anotações*) |
| `[[texto]]` | tinta UV, invisível para os jogadores (camada *Camada oculta*) |

Os botões *Tarjar / Nota / UV* acima de cada campo aplicam a marcação ao trecho selecionado.

## Camadas

Em vez de um editor de camadas livre (pesado demais para um handout), cada folha é montada em **6 camadas semânticas**, que você liga, desliga e muda a opacidade:

1. **Papel e desgaste** — papel, manchas, dobras, grão, vinheta
2. **Conteúdo** — o texto do modelo e as tarjas
3. **Anotações** — escrita à mão na margem
4. **Carimbos e fitas** — carimbos, selos, fitas, etiquetas
5. **Anexos** — imagens livres e molduras
6. **Camada oculta (UV)** — só aparece no estado Mestre ou se ligada

O botão **Jogador / Mestre** troca o estado de revelação: Jogador mantém tarjas fechadas e UV oculta; Mestre revela tudo. Exporte um de cada para entregar a versão do jogador e guardar a do mestre.

Para dossiês longos (várias páginas) a ideia é uma camada-mestre compartilhada (cabeçalho, papel, numeração) com páginas filhas. **Isso está desenhado no quadro de design, mas ainda não está no app.**

## Assimilação

Na aba *Estilo* o controle **Assimilação** corrompe o texto de forma determinística (mesma semente = mesmo resultado): troca letras e palavras por ruído e por uma palavra intrusa (padrão "ELES", você pode mudar). Nunca altera o texto salvo, só a aparência. *Embaralhar* troca a semente. O modelo **Diário** tem ainda o campo *Degradação*, que piora o texto parágrafo a parágrafo; o **Print de conversa** deteriora só a última mensagem.

## Modelos (17)

Polícia: Boletim de ocorrência (formulário contínuo com furos de trator), Transcrição de interrogatório, Desaparecido.
Perícia: Laudo do IML (corpo com marcadores ligados aos achados), Prontuário (gráfico de temperatura que acompanha os valores), Saco de evidência.
Imprensa: Recorte de jornal.
Organização: Memorando confidencial (mimeógrafo violeta), Relatório paranormal (cor e glifo por elemento, medidor de ameaça 0–5).
Ocultismo: Ritual (círculo ritual gerado: anel de texto e estrela de 3 a 12 pontas).
Pessoal: Carta, Diário, Papel rasgado, Polaroid.
Digital: Print de conversa, Frame de câmera (CFTV).
Objetos: Cupom fiscal (total somado das linhas).

`previa-modelos.jpg` mostra todos exportados.

## O que mudou em relação à v1

- **Exportação:** a v1 só tinha `window.print()`. Agora PNG e PDF reais, gerados no próprio navegador, com as fontes embutidas (a v1 puxava fontes do Google Fonts, então offline ficava tudo na fonte padrão).
- **Imagens:** a v1 não aceitava imagens. Agora há campos de foto nos modelos e anexos livres.
- **Persistência:** texto/estilo no `localStorage`, imagens no IndexedDB, mais salvar/abrir projeto.
- **Responsivo:** painéis viram gavetas no celular, barra inferior, alvos de toque de 44 px, folha reencaixada acima da gaveta.
- **Interface:** preta e branca, minimalista, com modo escuro.
- **Modelos:** 12 → 17 (novos: Prontuário, Relatório paranormal, Ritual, Frame CFTV, Cupom fiscal) e os 12 originais redesenhados, cada um com papel, tipografia e elementos próprios.
- **Tarja segura:** o texto sob a tarja não vaza na exportação. Como o arquivo é imagem, ele nem existe no PDF/PNG.

## Limitações (sendo honesto)

- Testei no Chromium (desktop, emulação de celular 390×844 e abrindo via `file://`). **Não testei em iPhone/Safari nem em Firefox.** O Safari limita o tamanho de canvas; se o PNG 3× falhar no iPhone, use 1× ou 2×.
- PNG e PDF são sempre imagem: o texto não é selecionável nem pesquisável.
- Imagens são reduzidas a no máximo 1600 px de lado ao entrar, para não pesar.
- Dossiê multipágina com camada-mestre ainda não existe no app.
- Os dados ficam só no navegador de cada aparelho; para levar para outro, use *Salvar projeto*.

## Criar um modelo novo

Crie `js/templates/meu-modelo.js` e inclua no `index.html` depois de `utils.js`:

```js
window.TEMPLATES.push({
  id: 'meu-modelo', name: 'Meu modelo', category: 'Pessoal',
  width: 600, height: 800, bleed: 0, paper: '#eee', ink: '#111', wear: 30,
  fonts: { body: 'Courier Prime', hand: 'Caveat', title: 'Oswald' },
  usesFonts: [],
  fields: [{ key: 'texto', label: 'Texto', type: 'textarea', default: 'Olá ~~mundo~~' }],
  css: `.mm{background:var(--u-paper,#eee);color:var(--u-ink,#111);font-family:var(--f-body)}`,
  render(v, h) { return `<div class="tpl mm">${h.fx()}<div data-layer="content">${h.rt(v.texto)}</div></div>`; },
});
```

Use `h.t()` para texto simples e `h.rt()` para texto com marcações. Marque cada bloco com `data-layer="paper|content|notes|stamps|media|uv"` e as camadas funcionam sozinhas. Tipos de campo: `text`, `textarea`, `select`, `range`, `image`.

## Correção de última hora

Memorando, Relatório paranormal e Ritual estavam com categorias que não existiam na lista de modelos e por isso não apareciam no painel (exportavam normal quando chamados pelo id). Agora os três ficam no grupo "Ordem", e a lista passou a mostrar automaticamente qualquer categoria nova. Conferido: 17 modelos listados no desktop e no celular, sem erro no console.
