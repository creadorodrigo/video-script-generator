async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    return null;
  }

  // Verifica se precisa resetar o contador mensal
  const now = new Date();
  const lastReset = new Date(user.lastReset);
  const shouldReset = 
    now.getMonth() !== lastReset.getMonth() || 
    now.getFullYear() !== lastReset.getFullYear();

  if (shouldReset) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        generationsUsed: 0,
        lastReset: now,
      },
    });
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: 'user', // Adiciona role padrão para satisfazer NextAuth
  } as any; // Type assertion para evitar erro
},
