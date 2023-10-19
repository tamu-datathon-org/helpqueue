import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma';
import { Ticket } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

/*
 * POST Request: Creates new ticket and assigns it to user
 */

type ResponseData = {
  ticket?: Ticket;
  error?: string;
};

// Function to generate a unique temporary string
function generateTempString(): string {
    return `TEMP_${Date.now()}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const token = await getToken({ req });
  const { issue, location, contact } = req.body;
  const maxIssueLength = 80;
  const maxLocationLength = 60;
  const maxContactLength = 20;

  if (!token) {
    res.status(401);
    res.send({});
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: token?.email || '',
    },
    include: {
      ticket: true,
    },
  });

  if (!user || user?.ticket) {
    res.status(409);
    return;
  }

  if (!issue) {
    res.status(405).json({ error: 'Missing issue' });
    return;
  }


  if(!location) {
    res.status(405).json({ error: 'Missing location' });
  }

  if(!contact) {
    res.status(405).json({ error: 'Missing contact' });
  }

  if (issue.length > maxIssueLength) {
    res
      .status(400)
      .json({ error: 'Issue too long. Max ' + maxIssueLength + ' characters' });
    return;
  }

  if (location.length > maxLocationLength) {
    res.status(400).json({
      error: 'Location too long. Max' + maxLocationLength + ' characters',
    });
    return;
  }

  if (contact.length > maxContactLength) {
    res.status(400).json({
      error: 'Contact too long. Max ' + maxContactLength + ' characters',
    });
    return;
  }

  const ticket = await prisma.ticket.create({
    data: {
      authorName: user.name,
      issue: issue,
      location: location,
      contact: contact,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      claimantName: null,
      claimedTime: null,
      claimantId: generateTempString(),
      resolvedTime: null,
      publishTime: new Date(),
    },
  });

  res.status(200).send({ ticket: ticket });
}
