# 🏗️ ARQUITETURA DO SISTEMA

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Video      │  │    Theme     │  │  Generation  │     │
│  │   Input      │  │    Input     │  │   Settings   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Script Results Display                 │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API ROUTES (Next.js)                      │
│                                                              │
│  /api/auth/[...nextauth]  →  Autenticação (NextAuth.js)    │
│  /api/generate            →  Geração de Roteiros            │
│  /api/patterns            →  Biblioteca de Padrões          │
│  /api/user/me             →  Info do Usuário/Quota          │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────┐    ┌──────────────────────┐
│  SERVIÇOS EXTERNOS   │    │  BANCO DE DADOS      │
│                      │    │    (PostgreSQL)      │
│  ┌────────────────┐ │    │                      │
│  │ YouTube API    │ │    │  ┌────────────────┐ │
│  │ (Transcrições) │ │    │  │  Users         │ │
│  └────────────────┘ │    │  │  Patterns      │ │
│                      │    │  │  Generations   │ │
│  ┌────────────────┐ │    │  └────────────────┘ │
│  │ Claude API     │ │    │                      │
│  │ (Análise/Gen)  │ │    └──────────────────────┘
│  └────────────────┘ │
└──────────────────────┘
```

## Fluxo de Dados Completo

### 1. USUÁRIO FAZ LOGIN

```
Usuario → Frontend → /api/auth → NextAuth.js → PostgreSQL
                                      ↓
                              Retorna sessão JWT
```

### 2. USUÁRIO ENTRA COM DADOS

```
Frontend (5 inputs):
├─ 5 URLs de vídeos
├─ Descrição/Link do produto
├─ Público-alvo (opcional)
├─ Objetivo (opcional)
└─ Configurações (variações, duração, plataforma)
```

### 3. PROCESSAMENTO BACKEND

```
POST /api/generate
    ↓
1. Validação (Zod schema)
    ↓
2. Verifica quota do usuário
    ↓
3. Extrai transcrições (YouTube API)
    ├─ Em paralelo para os 5 vídeos
    └─ Limita a 3000 chars cada (~500 tokens)
    ↓
4. Analisa padrões (Claude Haiku)
    ├─ Identifica ganchos
    ├─ Identifica estrutura do corpo
    └─ Identifica CTAs
    ↓
5. Gera N roteiros (Claude Haiku)
    ├─ Aplica padrões ao novo produto
    └─ Cria variações com ângulos diferentes
    ↓
6. Salva no banco
    ├─ ScriptGeneration record
    └─ Incrementa monthlyGenerations
    ↓
7. Retorna JSON ao frontend
```

### 4. EXIBIÇÃO DE RESULTADOS

```
Frontend recebe:
├─ Análise consolidada
└─ Array de N roteiros
    ├─ Ordenados por score
    └─ Com opções de copiar/exportar
```

## Stack Tecnológica Detalhada

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Hooks (useState, useEffect)
- **Auth:** NextAuth.js (client)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Next.js API Routes
- **ORM:** Prisma
- **Validation:** Zod
- **Auth:** NextAuth.js (server)

### Database
- **Primary:** PostgreSQL
- **Schema:** Prisma
- **Hosting:** Neon.tech (recomendado para dev/prod)

### APIs Externas
- **Anthropic Claude API:**
  - Model: claude-haiku-4-20250514
  - Uso: Análise de padrões + Geração de roteiros
  - Custo: ~$0.12/mês (20 gerações)

- **YouTube Transcript:**
  - Library: youtube-transcript
  - Gratuito
  - Limitação: Apenas vídeos com legendas

### Deploy
- **Hosting:** Vercel (recomendado)
- **CI/CD:** Vercel Git Integration
- **Env Vars:** Vercel Dashboard

## Segurança

### Autenticação
- NextAuth.js com Credentials Provider
- Senhas hash com bcryptjs (salt rounds: 10)
- JWT tokens (não stored em DB)
- Session strategy: JWT

### Autorização
- Middleware em todas as API routes
- Verificação de sessão via `getServerSession()`
- User ownership check em patterns/generations

### Rate Limiting
- Quota mensal por usuário (DB-based)
- Reset automático todo mês
- Verifica antes de processar

### Validação
- Zod schemas em todas as APIs
- Type-safe inputs/outputs
- Sanitização de URLs

## Otimizações de Performance

### Frontend
- React memoization onde necessário
- Loading states em todas operações async
- Lazy loading de componentes pesados

### Backend
- Extração de transcrições em paralelo (Promise.all)
- Limite de tamanho de transcrições (3000 chars)
- Cache de padrões salvos (evita reprocessamento)

### Database
- Índices em userId, patternId
- Queries otimizadas (select apenas campos necessários)
- Connection pooling (Prisma)

### API
- Uso de Claude Haiku (5x mais barato que Sonnet)
- Truncamento de respostas muito longas
- Timeout de 60s em requests

## Escalabilidade

### Atual (MVP)
- Suporta: 5 usuários simultâneos
- Gerações: 20/mês total
- Custo: ~$0.12/mês

### Escala Média (50 usuários)
- Gerações: 200/mês
- Custo Claude: ~$1.20/mês
- Banco: Neon Free tier (OK)
- Vercel: Hobby plan (OK)

### Escala Alta (500 usuários)
- Gerações: 2000/mês
- Custo Claude: ~$12/mês
- Banco: Neon Pro ($20/mês)
- Vercel: Pro plan ($20/mês)
- **Total: ~$52/mês**

## Próximos Desenvolvimentos

### FASE 1 - Transcrições Completas (2-3 dias)

**Problema atual:** Só funciona com YouTube

**Solução:**
1. Integrar OpenAI Whisper API
2. Download de vídeo → Extração de áudio → Transcrição
3. Suporte a Instagram e TikTok

**Implementação:**
```typescript
// src/lib/whisper-service.ts
async function transcribeVideo(url: string): Promise<string> {
  // 1. Download vídeo (youtube-dl ou similar)
  // 2. Extrai áudio (ffmpeg)
  // 3. Envia para Whisper API
  // 4. Retorna transcrição
}
```

**Custo adicional:**
- Whisper: $0.006/minuto
- ~60s de vídeo = $0.006
- 20 gerações × 5 vídeos = 100 vídeos/mês
- Total: ~$0.60/mês

### FASE 2 - Biblioteca Avançada (1-2 dias)

**Funcionalidades:**
- Página `/library` dedicada
- Busca por nome/tags
- Filtros por plataforma/data
- Edição de padrões salvos
- Compartilhamento entre usuários (opcional)

**Componentes:**
```
src/app/library/
├── page.tsx              # Página principal
├── components/
│   ├── PatternCard.tsx   # Card de padrão
│   ├── SearchBar.tsx     # Busca
│   └── FilterPanel.tsx   # Filtros
```

### FASE 3 - Exports (1 dia)

**Formatos:**
- TXT (atual - só falta implementar)
- PDF (usar jsPDF)
- DOCX (usar docx.js)
- CSV (para planilhas)

**API:**
```typescript
// src/app/api/export/route.ts
POST /api/export
Body: { generationId, format: 'pdf' | 'docx' | 'txt' | 'csv' }
Response: File download
```

### FASE 4 - Analytics (2-3 dias)

**Dashboard:**
- Total de gerações
- Padrões mais usados
- Roteiros com melhor score
- Uso por usuário (admin only)

**Gráficos:**
- Gerações ao longo do tempo
- Distribuição de scores
- Plataformas mais usadas

### FASE 5 - Melhorias de UX (contínuo)

**Quick Wins:**
- [ ] Salvar rascunhos
- [ ] Histórico de gerações
- [ ] Preview de vídeos
- [ ] Tooltips explicativos
- [ ] Keyboard shortcuts
- [ ] Dark mode

**Advanced:**
- [ ] A/B testing de roteiros
- [ ] Sugestões de melhoria
- [ ] Templates prontos
- [ ] Integração com editores de vídeo

## Métricas de Sucesso

### Técnicas
- Uptime: >99%
- Latência média: <60s
- Taxa de erro: <1%

### Negócio
- Usuários ativos mensais
- Gerações por usuário
- Padrões salvos (reuso)
- NPS/Satisfação

### Custos
- Custo por geração: <$0.01
- ROI do produto
- Churn rate

---

## 🎯 Próximos Passos Imediatos

1. **Teste o MVP completo**
   - Rode localmente
   - Teste com vídeos reais do YouTube
   - Valide os roteiros gerados

2. **Deploy em staging**
   - Vercel preview deployment
   - Teste com time de 5 pessoas
   - Colete feedback

3. **Implemente Whisper** (Fase 1)
   - Adicionar suporte a Instagram/TikTok
   - Essencial para produção

4. **Launch limitado**
   - 10-20 usuários beta
   - Monitorar uso e custos
   - Iterar baseado em feedback

5. **Escala gradual**
   - 50 → 100 → 500 usuários
   - Otimizar conforme necessário

---

**Sistema pronto para uso! 🚀**

Qualquer dúvida sobre implementação ou próximos passos, é só avisar!
