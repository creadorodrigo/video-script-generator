# 📹 Video Script Generator

Sistema baseado em Claude AI para analisar vídeos vencedores e gerar roteiros otimizados usando os mesmos padrões de sucesso.

## 🎯 Funcionalidades

- ✅ Análise de até 5 vídeos de referência (YouTube, Instagram, TikTok)
- ✅ Identificação automática de padrões vencedores (ganchos, estrutura, CTAs)
- ✅ Geração de 5-10 variações de roteiros otimizados
- ✅ Biblioteca de padrões salvos para reutilização
- ✅ Rate limiting: 4 gerações por usuário/mês
- ✅ Interface moderna e responsiva
- ✅ Autenticação de usuários
- ✅ Custo API extremamente baixo (~$0.12/mês)

## 🚀 Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 3. Configurar banco de dados
npx prisma generate
npx prisma db push

# 4. Iniciar servidor
npm run dev
```

Acesse: http://localhost:3000

## 📊 Custo Estimado

- 5 usuários × 4 gerações/mês = 20 gerações
- ~8k tokens por geração = 160k tokens/mês
- **Custo total: ~$0.12/mês** (usando Claude Haiku)

## 🏗️ Tecnologias

- Next.js 14 + React + TypeScript
- Tailwind CSS
- Claude Haiku 4 (Anthropic)
- PostgreSQL + Prisma
- NextAuth.js

## 📖 Documentação Completa

Veja instruções detalhadas de:
- Deploy na Vercel
- Configuração de banco de dados
- Criação de usuários
- Troubleshooting

[Leia a documentação completa aqui](./DOCS.md)

## 🔐 Variáveis de Ambiente

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"
ANTHROPIC_API_KEY="sk-ant-api03-..."
MAX_GENERATIONS_PER_USER_MONTH=4
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra issues e PRs.

## 📄 Licença

MIT
