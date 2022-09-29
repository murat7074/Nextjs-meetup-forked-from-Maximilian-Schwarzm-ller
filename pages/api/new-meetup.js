// /api/new-meetup    bu address e "POST", "PATCH" vb. yapılmalı ki burada yakalayalım

import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    // const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      'USE YOUR MONGODB ACCOUNT'
    );
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const result = await meetupsCollection.insertOne(data);
    console.log(result)
    client.close();
    res.status(201).json({message:"Meetup inserted!"})
  }
}

export default handler;