import React from 'react';
import useSWR from 'swr';
import { fetcher } from '../../lib/common';
import { getTimeDifferenceString } from '../../lib/common';
import { Ticket } from '@prisma/client';
import ClaimButton from '../mentor/ClaimButton';

export default function TicketStream(props: {
  filter: string;
  challengeFilter: string;
  mentorPreferences: string[];
}) {
  const {
    data: ticketsData,
    error: ticketError,
    isLoading: isTicketLoading,
  } = useSWR(`/api/tickets/${props.filter || 'all'}`, fetcher, {
    refreshInterval: 5000,
  });

  const {
    data: challengeData,
    error: challengeError,
    isLoading: challengeLoading,
  } = useSWR('/api/challenges', fetcher);

  if (isTicketLoading || challengeLoading) {
    return (
      <div className="flex justify-center p-8 bg-white border border-gray-100 shadow-md rounded-xl my-8">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  if (ticketError || challengeError) {
    return (
      <div className="flex justify-center p-8 bg-white border border-gray-100 shadow-md rounded-xl my-8">
        <p className="text-xl font-bold">Error!</p>
      </div>
    );
  }

  const filteredTickets = ticketsData.tickets.filter((ticket: Ticket) => {
    if (
      props.challengeFilter === 'All Challenges' ||
      props.challengeFilter === ticket.challenge
    ) {
      return true;
    }
    return false;
  });

  const sortedTickets = filteredTickets.sort((a: Ticket, b: Ticket) => {
    const indexA = props.mentorPreferences.indexOf(a.challenge);
    const indexB = props.mentorPreferences.indexOf(b.challenge);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const ticketList: JSX.Element[] = [];
  sortedTickets.forEach((ticket: Ticket, index: number) => {
    const challengeInfo = challengeData.find(
      (c: { challenge_name: string }) => c.challenge_name === ticket.challenge
    );
    const mentorGuidePath = challengeInfo?.mentor_guide;
    const isValidMentorGuide = mentorGuidePath?.startsWith('https://');
    ticketList.push(
      <div
        key={index}
        className="relative block p-4 sm:p-8 bg-white border border-gray-100 shadow-md rounded-xl my-8 md:w-[90vw] lg:w-[35vw] 2xl:w-[500px]"
      >
        <span className="absolute right-4 top-4 rounded-full px-3 py-1.5 bg-green-100 text-green-600 font-medium text-xs">
          {getTimeDifferenceString(ticket.publishTime)}
        </span>
        <div className=" text-gray-500 sm:pr-8">
          <h5 className="w-3/4 text-xl font-bold text-gray-900">
            {ticket.issue}
          </h5>
          <p className="mt-2 text-sm">
            {ticket.authorName}&nbsp;(Contact: {ticket.contact})
          </p>
          <p className="mt-2 text-sm">Located at: {ticket.location}</p>
          <p className="mt-2 text-sm">Challenge: {ticket.challenge}</p>
          {isValidMentorGuide && (
            <p className="mt-2 text-sm">
              <a
                href={mentorGuidePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Mentor Guide
              </a>
            </p>
          )}
        </div>
        <ClaimButton ticket={ticket} />
      </div>
    );
  });

  return (
    <div>
      {ticketList.length == 0 ? (
        <div className="flex justify-center p-8 bg-white border border-gray-100 shadow-md rounded-xl my-8">
          <p className="text-xl font-bold">No Tickets!</p>
        </div>
      ) : (
        ticketList
      )}
    </div>
  );
}
