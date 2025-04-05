import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Session, getServerSession } from 'next-auth';
import authOptions from './api/auth/[...nextauth]';
import { Nullable } from '../lib/common';
import prisma from '../lib/prisma';
import { useToast } from '@chakra-ui/react';

type Challenge = {
  id: string;
  challenge_name: string;
  mentor_guide: string;
};

type Props = {
  challenges: Challenge[];
};

export default function ChallengeEditor({ challenges }: Props) {
  const [items, setItems] = useState<Challenge[]>(challenges);
  const toast = useToast();

  const handleAdd = async () => {
    const name = prompt('Enter challenge name:');
    const guide = prompt('Enter mentor guide:');
    if (!name || !guide) return;

    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challenge_name: name, mentor_guide: guide }),
    });

    if (res.ok) {
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]);
      toast({
        title: 'Challenge created.',
        description: `"${name}" was added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    const res = await fetch(`/api/challenges/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: 'Challenge deleted.',
        description: `"${name}" was removed.`,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  const handleUpdate = async (challenge: Challenge) => {
    const newName = prompt('Update challenge name:', challenge.challenge_name);
    const newGuide = prompt('Update mentor guide:', challenge.mentor_guide);
    if (!newName || !newGuide) return;

    const res = await fetch(`/api/challenges/${challenge.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challenge_name: newName, mentor_guide: newGuide }),
    });

    if (res.ok) {
      const updated = await res.json();
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      toast({
        title: 'Challenge updated.',
        description: `"${newName}" was updated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="h-full py-10">
      <div className="flex justify-center mt-8 mx-4 md:mt-24">
        <div className="p-8 bg-white border border-gray-100 shadow-md rounded-xl md:w-[90vw] lg:w-[35vw] 2xl:w-[500px] mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Challenge Manager
          </h1>
          <button
            onClick={handleAdd}
            className="w-full bg-blue-500 border-blue-500 text-center py-2 border-2 rounded-lg text-md font-bold text-white"
          >
            Add
          </button>
          <ul className="mt-6 space-y-6">
            {items.map((challenge) => (
              <li
                key={challenge.id}
                className="border p-4 rounded-lg shadow bg-white"
              >
                <p className="text-lg font-semibold text-gray-700">
                  {challenge.challenge_name}
                </p>
                <p className="text-sm text-gray-500 break-all">
                  {challenge.mentor_guide}
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleUpdate(challenge)}
                    className="bg-yellow-400 text-white px-4 py-1 rounded-md font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(challenge.id, challenge.challenge_name)
                    }
                    className="bg-red-500 text-white px-4 py-1 rounded-md font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Nullable<Session> = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email || '',
    },
  });

  if (!user?.mentor && !user?.admin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const challenges = await prisma.challenge.findMany();

  return {
    props: { challenges },
  };
};
