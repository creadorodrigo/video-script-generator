import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash da senha
  const hashedPassword = await bcrypt.hash('demo123', 10);

  // Cria usuário demo
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      role: 'user',
      monthlyGenerations: 0,
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Cria mais 4 usuários para o time
  for (let i = 1; i <= 4; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        password: hashedPassword,
        name: `Team User ${i}`,
        role: 'user',
        monthlyGenerations: 0,
      },
    });
    console.log(`✅ User ${i} created:`, user.email);
  }

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('Email: demo@example.com');
  console.log('Password: demo123');
  console.log('\nOr use: user1@example.com through user4@example.com with same password');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
