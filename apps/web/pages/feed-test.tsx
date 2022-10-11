import { PrismaClient } from "@prisma/client";
import React from "react";

const AuthPage = ({ allThreads }) => {
  return (
    <div className="p-6">
      <p>feed test</p>
      <p className="whitespace-pre">{JSON.stringify(allThreads, null, 4)}</p>
    </div>
  );
};

export async function getServerSideProps() {
  const prisma = new PrismaClient();

  const allThreads = await prisma.thread.findMany({
    include: {
      messages: true,
    },
  });
  return { props: { allThreads } };
}

export default AuthPage;
