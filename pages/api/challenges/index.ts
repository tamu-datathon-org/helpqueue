import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { challenge_name, mentor_guide } = req.body;
    const created = await prisma.challenge.create({
      data: { challenge_name, mentor_guide },
    });
    return res.status(201).json(created);
  }

  const all = await prisma.challenge.findMany();
  return res.status(200).json(all);
}
