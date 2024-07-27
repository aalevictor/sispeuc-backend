import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const root = await prisma.usuario.upsert({
    where: { login: 'string' },
    create: {
      login: 'string',
      nome: 'Diego',
      email: 'dc3@mailbox.org',
      status: 1,
      permissao: 'DEV',
    },
    update: {
      login: 'string',
      nome: 'Diego',
      email: 'dc3@mailbox.org',
      status: 1,
      permissao: 'DEV',
    },
  });
  console.log(root);
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
