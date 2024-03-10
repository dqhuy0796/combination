import * as dotenv from "dotenv";
import express from "express";

import { PrismaClient as MongodbClient } from "../dist/@prisma/client/mongodb";
import { PrismaClient as MysqlClient } from "../dist/@prisma/client/mysql";

const app = express();
const mysqlPrisma = new MysqlClient();
const mongodbPrisma = new MongodbClient();

dotenv.config();

app.use(express.json());

// Routes
app.get("/comments", async (req, res) => {
  const comments = await mongodbPrisma.comment.findMany();
  res.json(comments);
});

app.get("/comments/:id", async (req, res) => {
  const id = req.params.id;
  const comments = await mongodbPrisma.comment.findUnique({
    where: { id },
    include: { replies: true },
  });
  res.json(comments);
});

app.post("/comments/:id", async (req, res) => {
  const id = req.params.id;
  const comments = await mongodbPrisma.comment.findUnique({
    where: { id },
    include: { replies: true },
  });
  res.json(comments);
});

app.get("/replies", async (req, res) => {
  try {
    const { page, limit } = req.query;

    const take = limit ? Number(limit) : 10;
    const skip = page ? (Number(page) - 1) * take : 0;

    const [count, replies] = await mongodbPrisma.$transaction([
      mongodbPrisma.reply.count(),
      mongodbPrisma.reply.findMany({
        take,
        skip,
      }),
    ]);

    res.json({ replies, count });
  } catch (error) {
    res.json(error);
  }
});

app.get("/replies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const comments = await mongodbPrisma.comment.findMany({
      where: {
        replies: {
          some: {
            text: {
              contains: id,
            },
          },
        },
      },
      include: {
        replies: true,
      },
    });
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

app.get("/filter", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      throw new Error("missing");
    }

    const startAt = new Date(from as string);
    const endAt = new Date(to as string);

    const replies = await mongodbPrisma.reply.findMany({
      where: {
        createdAt: {
          gte: startAt,
          lte: endAt,
        },
      },
    });
    res.json(replies);
  } catch (error) {
    res.json(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
