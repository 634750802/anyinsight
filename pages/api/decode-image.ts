import { NextApiRequest, NextApiResponse } from 'next';

export default function handler (
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = req.query.data;
  console.log(data);
  if (!data) {
    res.status(404).send({});
  } else {
    const img = atob(String(data));
    console.log(img)
    res.setHeader('content-type', 'image/svg+xml');
    res.status(200).send(img);
  }
}