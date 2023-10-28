import Head from 'next/head';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';

import Navbar from '../components/common/Navbar';
import { Select } from '@chakra-ui/react';

import { Session, unstable_getServerSession } from 'next-auth';
import authOptions from './api/auth/[...nextauth]';
import { Nullable } from '../lib/common';

import prisma from '../lib/prisma';
import TicketStream from '../components/tickets/TicketStream';

export default function Home() {
  const [filter, setFilter] = useState('');
  const [challengeFilter, setChallengeFilter] = useState('All Challenges');
  const challengeOptions = ['TD Hospital Exploration', 'TD Pictionary Purge', 'TD Bots Race', 'TD Build Your Own', 'Marky Challenge', 'MLH Challenge', 'Miscellaneous'];
  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setFilter(value);
  };

  const handleDropdownChange2 = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setChallengeFilter(value);
  };

  return (
    <>
      <Head>
        <title>Datathon Help Queue</title>
        <meta
          name="description"
          content="Online Mentorship Queue For Hackathon Participants"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://tamudatathon.com/static/img/favicons/favicon.ico"
        />
      </Head>
      <div className="h-full py-10">
        <div className="flex justify-center mt-8 mx-4 md:mt-24">
          <div className="w-[90vw] lg:w-[35vw] 2xl:w-[500px]">
            <div className="flex justify-center mb-6 ">
              <Navbar page="mentor" />
            </div>
            <div className="mt-8 w-[90vw] lg:w-[35vw] 2xl:w-[500px]">
              <Select onChange={handleDropdownChange} bg="white">
                <option defaultValue="unresolved" value="unresolved">
                  Active Tickets
                </option>
                <option value="all">All Unresolved Tickets</option>
                <option value="claimedunresolved">Claimed Tickets</option>
                <option value="resolved">Resolved Tickets</option>
              </Select>
            </div>
            <div className="mt-8 w-[90vw] lg:w-[35vw] 2xl:w-[500px]">
              <Select onChange={handleDropdownChange2} bg="white">
                <option value="All Challenges">All Challenges</option>
                {challengeOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>

            <TicketStream filter={filter} challengeFilter={challengeFilter} />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Nullable<Session> = await unstable_getServerSession(
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

  return {
    props: {},
  };
};
