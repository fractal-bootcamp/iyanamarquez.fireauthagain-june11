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

export const findExistingUser = async (user: any) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      password: user.password,
    },
  });
};

export const findExistingUserWithEmailOnly = async (user: any) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
};

export const createNewPostOnUser = async (userId: string, postData: any) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      posts: {
        create: [postData],
      },
    },
  });
};

export const getUsersPosts = async (userId: string) => {
  return await prisma.post.findMany({
    where: {
      authorId: userId,
    },
  });
};

export const updateUserDisplayName = async (email: string, name: string) => {
  return await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      name: name,
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
