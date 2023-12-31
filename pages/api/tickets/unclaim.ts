import type { NextApiRequest, NextApiResponse } from 'next';

import { Nullable } from '../../../lib/common';
import prisma from '../../../lib/prisma';
import { Ticket } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

// Function to generate a unique temporary string
function generateTempString(): string {
    return `TEMP_${Date.now()}`;
}

/*
 * POST Request: Unclaims ticket
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ ticket: Nullable<Ticket> }>
) {
  const token = await getToken({ req });
  const { ticketId } = req.body;

  if (!token) {
    res.status(401);
    res.send({ ticket: null });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: token?.email || '',
    },
    include: {
      claimedTicket: true,
      ticket: true,
    },
  });

  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!user || !ticket || (!user.admin && !user.mentor)) {
    res.status(401);
    res.send({ ticket: null });
    return;
  }

  if (user.claimedTicket?.id != ticket.id) {
    res.send({ ticket: null });
    return;
  }

  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      claimantName: null,
      claimedTime: null,
      claimantId: generateTempString(),
      publishTime: new Date(),
    },
  });

  res.status(200);
  res.send({ ticket: ticket });
}
