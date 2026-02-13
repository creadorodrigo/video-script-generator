# 🚀 Guia de Início Rápido

## Setup em 5 Minutos

### 1. Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL rodando (ou conta Supabase gratuita)
- Chave da API do Claude (Anthropic)

### 2. Instalação

```bash
# Clone e instale
git clone <seu-repo>
cd video-script-generator
npm install

# Configure ambiente
cp .env.example .env
# Edite .env com suas credenciais
```

### 3. Configurar Banco

#### Opção A: Supabase (Mais Fácil)
1. Crie conta em supabase.com
2. Novo projeto > Copie connection string
3. Cole em `DATABASE_URL` no .env

#### Opção B: PostgreSQL Local
```bash
# Criar banco local
createdb video_script_generator

# DATABASE_URL no .env:
DATABASE_URL="postgresql://localhost:5432/video_script_generator"
```

### 4. Inicializar Banco

```bash
npm run prisma:push
```

### 5. Criar Primeiro Usuário

```bash
node scripts/create-user.js admin@email.com Admin senha123
```

### 6. Iniciar Aplicação

```bash
npm run dev
```

Acesse: http://localhost:3000

## ✅ Checklist Pós-Instalação

- [ ] Consegue acessar http://localhost:3000
- [ ] Consegue fazer login
- [ ] Banco de dados conectado
- [ ] Variáveis de ambiente configuradas
- [ ] API do Claude funcionando

## 🎯 Primeiro Teste

1. Faça login
2. Cole um link do YouTube: `https://youtube.com/watch?v=dQw4w9WgXcQ`
3. Descreva um produto: "Curso online de programação"
4. Clique em "Gerar Roteiros"
5. Aguarde ~45-60 segundos
6. Veja os roteiros gerados!

## ❓ Problemas Comuns

**Erro de conexão com banco:**
```bash
# Verifique se PostgreSQL está rodando
psql -U postgres -c "SELECT 1"

# Teste a connection string
npm run prisma:studio
```

**Erro "ANTHROPIC_API_KEY missing":**
```bash
# Verifique se .env tem a chave
cat .env | grep ANTHROPIC_API_KEY

# Deve mostrar:
# ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Erro ao criar usuário:**
```bash
# Certifique-se que rodou prisma push
npm run prisma:push

# Tente criar novamente
node scripts/create-user.js email@test.com "Nome" senha
```

## 📚 Próximos Passos

- Leia [README.md](./README.md) - Documentação completa
- Veja [DEPLOY.md](./DEPLOY.md) - Guia de deploy
- Explore o código em `/src`

## 🎓 Estrutura do Código

```
src/
├── app/
│   ├── api/generate/      ← Lógica principal de geração
│   └── page.tsx           ← Interface do usuário
├── lib/
│   ├── claude-service.ts  ← Integração com Claude
│   └── transcript-extractor.ts ← Extração de vídeos
└── components/            ← Componentes React
```

## 💡 Dicas

1. **Custo baixo**: Use sempre Claude Haiku (já configurado)
2. **Rate limit**: 4 gerações/usuário/mês (ajuste em .env se necessário)
3. **Videos**: YouTube funciona melhor (tem transcrições nativas)
4. **Qualidade**: Descreva produtos com detalhes para melhores roteiros

Divirta-se gerando roteiros incríveis! 🎬
