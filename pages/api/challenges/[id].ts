import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  if (req.method === 'DELETE') {
    await prisma.challenge.delete({ where: { id } });
    return res.status(204).end();
  }

  if (req.method === 'PUT') {
    const { challenge_name, mentor_guide } = req.body;
    const updated = await prisma.challenge.update({
      where: { id },
      data: { challenge_name, mentor_guide },
    });
    return res.status(200).json(updated);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
