import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { Button, Form, Input, InputGroup } from "react-daisyui";
import { useForm } from "react-hook-form";
import { userIdAtom } from ".";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Waiting: NextPage = () => {
  const [userId] = useAtom(userIdAtom);
  const router = useRouter();
  const findUserQuery = trpc.useQuery(["users.findUserForMatch", { userId }], {
    refetchOnWindowFocus: false,
    cacheTime: 0,
    staleTime: 0,
  });
  const getMatchQuery = trpc.useQuery(
    ["users.checkIfyouAssignMatch", { userId }],
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );
  const changeStatusMutation = trpc.useMutation("users.changeStatus");

  useEffect(() => {
    if (!userId) return;
    changeStatusMutation.mutate({
      userId,
      status: "waiting",
    });
  }, []);

  useEffect(() => {
    const match = findUserQuery.data;
    if (match) {
      router.push(`/chat/${match.id}`);
    }
  }, [findUserQuery.data, router]);

  useEffect(() => {
    const match = getMatchQuery.data;
    if (match) {
      router.push(`/chat/${match.id}`);
    }
  }, [getMatchQuery.data, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      getMatchQuery.refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [getMatchQuery]);

  return (
    <>
      <Head>
        <title>Waiting...</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h3>Waiting for the user to connect with...</h3>
      </main>
    </>
  );
};

export default Waiting;
