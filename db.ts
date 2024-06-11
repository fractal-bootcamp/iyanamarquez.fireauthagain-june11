import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function main() {
export const createNewUser = async (user: any) => {
  await prisma.user.create({
    data: {
      email: user.email,
      name: "default name",
      password: user.password,
      firebaseId: user.firebaseId,
    },
  });
};

const findExistingUser = async () => {
  await prisma.user.findUniqueOrThrow({
    where: {
      email: "yayakix",
    },
  });
};

const findUserPosts = async () => {
  await prisma.post.findMany({
    where: {
      author: {
        email: "yaya",
      },
    },
  });
};

// const signupUser = (email, name, password) => {
//   // User
// };
// const loginUser = (email, password) => {
//   // User
// };
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
