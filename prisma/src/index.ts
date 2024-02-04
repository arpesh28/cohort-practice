import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function insertUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const user = await prisma.user.create({
    data: {
      email,
      password,
      firstName,
      lastName,
    },
  });
  console.log(user);
}

interface UpdateParams {
  firstName: string;
  lastName: string;
}

async function updateUser(
  email: string,
  { firstName, lastName }: UpdateParams
) {
  const newUser = await prisma.user.update({
    where: {
      email,
    },
    data: {
      firstName,
      lastName,
    },
  });
  console.log(newUser);
}

async function getUser(email: string) {
  const user = await prisma.user.findFirst({ where: { email } });
  console.log(user);
}

async function deleteUser(email: string) {
  const user = await prisma.user.delete({ where: { email } });
  console.log(user);
}

// getUser("arpesh@gmail.com");
// insertUser("arpesh1@gmail.com", "arpesh123", "Arpesh", "Gadekar");
// updateUser("arpesh@gmail.com", { firstName: "AP", lastName: "GAD" });
// deleteUser("arpesh1@gmail.com");
