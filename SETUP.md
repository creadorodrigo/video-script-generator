# 🚀 GUIA RÁPIDO DE SETUP

## Passo a Passo para Rodar o Projeto

### 1️⃣ Requisitos

- Node.js 18+ instalado
- Conta no Anthropic (Claude API) - https://console.anthropic.com
- Banco de dados PostgreSQL (recomendo Neon.tech - grátis)

### 2️⃣ Configuração do Banco de Dados (Neon)

1. Acesse https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a `DATABASE_URL` (Connection String)
   - Deve ser algo como: `postgresql://user:pass@ep-xxx.neon.tech/neondb`

### 3️⃣ API Key do Anthropic

1. Acesse https://console.anthropic.com
2. Vá em "API Keys"
3. Clique em "Create Key"
4. Copie a chave (começa com `sk-ant-api03-...`)

### 4️⃣ Instalar e Configurar

```bash
# 1. Entre na pasta do projeto
cd video-script-generator

# 2. Instale as dependências
npm install

# 3. Copie o arquivo de exemplo
cp .env.example .env

# 4. Edite o .env e adicione suas credenciais
# Use seu editor favorito (VSCode, nano, vim, etc)
nano .env
```

**Preencha o .env assim:**

```env
# Cole a URL do Neon aqui
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb"

# Para desenvolvimento local
NEXTAUTH_URL="http://localhost:3000"

# Gere com: openssl rand -base64 32
NEXTAUTH_SECRET="cole-aqui-um-secret-aleatorio"

# Cole sua API key do Anthropic
ANTHROPIC_API_KEY="sk-ant-api03-..."

# Configurações (pode deixar como está)
MAX_GENERATIONS_PER_USER_MONTH=4
```

### 5️⃣ Setup do Banco

```bash
# Gera o cliente Prisma
npx prisma generate

# Cria as tabelas no banco
npx prisma db push

# Cria usuários de teste
npx tsx prisma/seed.ts
```

**Você verá:**
```
✅ Demo user created: demo@example.com
✅ User 1 created: user1@example.com
...
```

### 6️⃣ Rodar o Projeto

```bash
# Modo desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

### 7️⃣ Fazer Login

Use as credenciais de teste:

```
Email: demo@example.com
Senha: demo123
```

## ✅ Checklist de Validação

Antes de usar, verifique:

- [ ] Node.js instalado (`node -v` deve mostrar v18+)
- [ ] PostgreSQL configurado (Neon ou local)
- [ ] `.env` criado com todas as variáveis
- [ ] `npm install` executado sem erros
- [ ] `npx prisma db push` criou as tabelas
- [ ] `npx tsx prisma/seed.ts` criou os usuários
- [ ] `npm run dev` rodando sem erros
- [ ] Login funcionando em http://localhost:3000

## 🐛 Erros Comuns

### "Cannot find module '@prisma/client'"

**Solução:**
```bash
npx prisma generate
```

### "Invalid `prisma.user.findUnique()` invocation"

**Solução:** Banco não está configurado corretamente
```bash
npx prisma db push
```

### "NEXTAUTH_SECRET is not defined"

**Solução:** Gere um secret
```bash
openssl rand -base64 32
# Cole o resultado no .env
```

### Página em branco após login

**Solução:** Certifique-se que o seed foi executado
```bash
npx tsx prisma/seed.ts
```

## 🎯 Teste Rápido

1. Faça login com `demo@example.com` / `demo123`
2. Cole um link do YouTube (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)
3. Adicione uma descrição de produto (mínimo 50 caracteres)
4. Clique em "Gerar Roteiros"
5. Aguarde ~45 segundos
6. Veja os roteiros gerados!

## 📞 Precisa de Ajuda?

- Verifique o README.md completo
- Abra uma issue no GitHub
- Confira a seção Troubleshooting no README

---

**Pronto! Agora você tem o sistema rodando! 🎉**
