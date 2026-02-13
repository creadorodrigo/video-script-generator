// Script para criar novos usuários no sistema
// Uso: node scripts/create-user.js email nome senha

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser(email, name, password) {
  try {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('❌ Erro: Usuário com este email já existe');
      process.exit(1);
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    console.log('✅ Usuário criado com sucesso!');
    console.log('');
    console.log('Detalhes:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Nome: ${user.name}`);
    console.log('');
    console.log('Você pode fazer login com este usuário agora.');
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ler argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log('Uso: node scripts/create-user.js <email> <nome> <senha>');
  console.log('');
  console.log('Exemplo:');
  console.log('  node scripts/create-user.js usuario@email.com "Nome do Usuário" minhasenha123');
  process.exit(1);
}

const [email, name, password] = args;

// Validações básicas
if (!email.includes('@')) {
  console.error('❌ Erro: Email inválido');
  process.exit(1);
}

if (name.length < 2) {
  console.error('❌ Erro: Nome deve ter pelo menos 2 caracteres');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ Erro: Senha deve ter pelo menos 6 caracteres');
  process.exit(1);
}

// Criar usuário
createUser(email, name, password);
