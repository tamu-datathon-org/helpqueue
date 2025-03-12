import Head from 'next/head';
import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';

import Navbar from '../components/common/Navbar';
import { Select } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import { Session, getServerSession } from 'next-auth';
import authOptions from './api/auth/[...nextauth]';
import { Nullable } from '../lib/common';

import prisma from '../lib/prisma';
import TicketStream from '../components/tickets/TicketStream';
import PreferenceEditor from '../components/mentor/PreferenceEditor';

export default function Home() {
  const [filter, setFilter] = useState('');
  const [challengeFilter, setChallengeFilter] = useState('All Challenges');
  const challengeOptions = ['PushBattle', 'Connections', 'Roni\'s Analysis', 'SQL Murder Mystery', 'Rev\'s Hotel', 'Capital One', 'TAMIDS Challenge', 'Baker Hughes Downsampling Challenge'];
  
  // load preferences from local storage
  const [mentorPreferences, setMentorPreferences] = useState<string[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  useEffect(() => {
    const storedPreferences = localStorage.getItem('mentorPreferences');
    if (storedPreferences) {
      setMentorPreferences(JSON.parse(storedPreferences));
    } else {
      setMentorPreferences(challengeOptions);
    }
  }, []);

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
          href="/favicon.ico"
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
                <option value="all">Unresolved Tickets</option>
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

            <div className="mt-8 w-[90vw] lg:w-[35vw] 2xl:w-[500px]">
              <button
                className="w-full flex items-center justify-between pl-4 pr-2 py-2 border border-gray-200 rounded-md hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                onClick={() => setShowPreferences(!showPreferences)}
              >
                Challenge Preferences
                {showPreferences ? <ChevronUpIcon boxSize={5} /> : <ChevronDownIcon boxSize={5} />}
              </button>
            </div>
            <div className={`transition-all duration-300 ${showPreferences ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className={`mt-1 p-4 border border-gray-200 rounded-md`}>
                  <PreferenceEditor preferences={mentorPreferences} setPreferences={setMentorPreferences} />
                </div>
            </div>
            
            <TicketStream filter={filter} challengeFilter={challengeFilter} mentorPreferences={mentorPreferences} />
          </div>
        </div>
      </div>
    </>
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

  // if (!user?.mentor && !user?.admin) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {},
  };
};
