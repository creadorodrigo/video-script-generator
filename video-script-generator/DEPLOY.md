# 🚀 Guia de Deploy - Video Script Generator

## Deploy na Vercel (Recomendado)

### 1. Preparar o Projeto

```bash
# Certifique-se que está tudo commitado
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 2. Configurar Banco de Dados

#### Opção A: Supabase (Recomendado - Gratuito)

1. Acesse https://supabase.com
2. Crie uma nova organização e projeto
3. Vá em Settings > Database
4. Copie a "Connection string" (mode: Session)
5. Formate como:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

#### Opção B: Neon (Alternativa Gratuita)

1. Acesse https://neon.tech
2. Crie novo projeto
3. Copie a connection string

#### Opção C: Railway

1. Acesse https://railway.app
2. New Project > Provision PostgreSQL
3. Copie a DATABASE_URL

### 3. Deploy na Vercel

#### Via Dashboard:

1. Acesse https://vercel.com
2. Import Git Repository
3. Selecione seu repositório
4. Configure Environment Variables:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=<gerar novo com: openssl rand -base64 32>
ANTHROPIC_API_KEY=sk-ant-api03-...
MAX_GENERATIONS_PER_USER_MONTH=4
MAX_VIDEOS_PER_REQUEST=5
MIN_SCRIPT_VARIATIONS=5
MAX_SCRIPT_VARIATIONS=10
DEFAULT_SCRIPT_VARIATIONS=7
```

5. Deploy!

#### Via CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add ANTHROPIC_API_KEY

# Deploy para produção
vercel --prod
```

### 4. Executar Migrations no Banco de Produção

```bash
# Se DATABASE_URL já está no .env local apontando para produção
npx prisma db push

# OU conectar diretamente
DATABASE_URL="sua-url-de-producao" npx prisma db push
```

### 5. Criar Primeiro Usuário

```bash
# Localmente conectado ao banco de produção
DATABASE_URL="sua-url-de-producao" node scripts/create-user.js admin@email.com "Admin" senha123

# OU via Prisma Studio
DATABASE_URL="sua-url-de-producao" npx prisma studio
```

### 6. Testar Deploy

1. Acesse sua URL da Vercel
2. Faça login com o usuário criado
3. Teste uma geração de roteiros

## Configurações Importantes

### Domínio Customizado

1. No dashboard da Vercel > Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções
4. Atualize `NEXTAUTH_URL` para seu domínio

### Limites e Performance

**Free Tier Vercel:**
- 100GB bandwidth/mês
- Funções serverless: 100GB-hrs
- 10s timeout de execução

**Suficiente para:**
- ~10,000 gerações/mês
- ~50-100 usuários ativos

### Monitoramento

1. Vercel Analytics (ativar no dashboard)
2. Logs em tempo real: `vercel logs`
3. Metrics: dashboard.vercel.com

## Troubleshooting

### Erro: "Can't reach database server"
- Verifique se DATABASE_URL está correta
- Confirme que IP da Vercel está whitelisted (se usar restrição de IP)
- Teste conexão localmente com `npx prisma db push`

### Erro: "NEXTAUTH_URL missing"
- Adicione `NEXTAUTH_URL` nas env vars
- Deve ser https://seu-dominio.vercel.app

### Erro: "Module not found" no deploy
- Verifique se todas deps estão em `dependencies` (não `devDependencies`)
- Rode `npm install` localmente e commite package-lock.json

### Build falha
- Rode `npm run build` localmente
- Corrija erros de TypeScript
- Verifique logs do build na Vercel

## Deploy Alternativo (Railway)

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Inicializar projeto
railway init

# 4. Adicionar PostgreSQL
railway add postgresql

# 5. Configurar env vars
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set ANTHROPIC_API_KEY=sk-ant-api03-...

# 6. Deploy
railway up
```

## Backup e Segurança

### Backup do Banco

```bash
# Supabase: automatic backups diários (plano gratuito)
# Neon: backups automáticos

# Backup manual:
pg_dump $DATABASE_URL > backup.sql

# Restaurar:
psql $DATABASE_URL < backup.sql
```

### Segurança

1. **Secrets**: Nunca commite `.env` ou chaves de API
2. **CORS**: Configurado automaticamente pelo Next.js
3. **Rate Limiting**: Implementado por usuário (4/mês)
4. **HTTPS**: Forçado automaticamente pela Vercel
5. **Auth**: Senhas com bcrypt (12 rounds)

## Custos Mensais Estimados

**Vercel Free:**
- Hosting: $0
- Bandwidth (100GB): $0
- Serverless: $0

**Supabase Free:**
- Database: $0
- 500MB storage: $0
- 2GB bandwidth: $0

**Anthropic Claude:**
- 160k tokens/mês: ~$0.12

**TOTAL: ~$0.12/mês** 🎉

## Escalabilidade

### Quando escalar para plano pago?

**Vercel Pro ($20/mês):**
- \>100GB bandwidth
- \>100 usuários simultâneos
- Analytics avançado

**Supabase Pro ($25/mês):**
- \>500MB storage
- \>50GB bandwidth
- Backups point-in-time

### Otimizações

1. **Cache**: Implementar Redis para transcrições
2. **CDN**: Usar Next.js Image Optimization
3. **Database**: Índices já configurados no Prisma
4. **API**: Rate limiting por IP (adicional ao por usuário)

## Próximos Passos

Após deploy bem-sucedido:

1. ✅ Criar usuários para seu time
2. ✅ Configurar domínio customizado
3. ✅ Ativar analytics
4. ✅ Configurar webhooks (opcional)
5. ✅ Implementar features adicionais

---

**Precisa de ajuda?** Abra uma issue no GitHub!
