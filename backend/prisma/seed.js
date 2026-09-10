const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('Admin@1234', salt);

  // Create the admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storerating.com' },
    update: {},
    create: {
      name: 'System Administrator User',
      email: 'admin@storerating.com',
      password: password,
      address: 'Admin Office, Headquarters, Mumbai, Maharashtra',
      role: 'ADMIN'
    }
  });

  // Create a store owner
  const owner = await prisma.user.upsert({
    where: { email: 'karan@storerating.com' },
    update: {},
    create: {
      name: 'Karan Mehta Store Owner',
      email: 'karan@storerating.com',
      password: password,
      address: 'Shop No 5, MG Road, Nagpur, Maharashtra',
      role: 'STORE_OWNER'
    }
  });

  // Create a normal user
  const normalUser = await prisma.user.upsert({
    where: { email: 'rohit@storerating.com' },
    update: {},
    create: {
      name: 'Rohit Sharma Normal User',
      email: 'rohit@storerating.com',
      password: password,
      address: 'Flat 201, Green Park Society, Wardha, Maharashtra',
      role: 'NORMAL_USER'
    }
  });

  // Create a store for the owner
  const store = await prisma.store.upsert({
    where: { ownerId: owner.id },
    update: {},
    create: {
      name: 'D-Mart',
      email: 'dmart@store.com',
      address: 'Nagpur, Maharashtra',
      ownerId: owner.id
    }
  });

  console.log('Seeded users:', { admin: admin.email, owner: owner.email, normalUser: normalUser.email });
  console.log('Seeded store:', store.name);
  console.log('Default password for all users: Admin@1234');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
