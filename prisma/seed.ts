import { PrismaClient as MysqlClient } from "../dist/@prisma/client/mysql";
import { PrismaClient as MongodbClient } from "../dist/@prisma/client/mongodb";

const mysqlPrisma = new MysqlClient();
const mongodbPrisma = new MongodbClient();

async function main() {
  // Seed data for MySQL
  const user = await mysqlPrisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      posts: {
        create: [
          {
            title: "Hello World",
            content: "This is my first post",
            published: true,
          },
          {
            title: "My Second Post",
            content: "This is my second post",
            published: false,
          },
        ],
      },
    },
  });

  console.log("Created user:", user);

  // Seed data for MongoDB
  const comment = await mongodbPrisma.comment.create({
    data: {
      text: "Great post!",
      replies: {
        createMany: {
          data: [
            { text: "reply 001" },
            { text: "reply 002" },
            { text: "reply 003" },
            { text: "reply 004" },
            { text: "reply 005" },
            { text: "reply 006" },
            { text: "reply 007" },
            { text: "reply 008" },
            { text: "reply 009" },
            { text: "reply 010" },
            { text: "reply 011" },
            { text: "reply 012" },
            { text: "reply 013" },
            { text: "reply 014" },
            { text: "reply 015" },
            { text: "reply 016" },
            { text: "reply 017" },
            { text: "reply 018" },
            { text: "reply 019" },
            { text: "reply 020" },
          ],
        },
      },
    },
  });

  console.log("Created comment:", comment);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await mysqlPrisma.$disconnect();
    await mongodbPrisma.$disconnect();
  });
