// POST /api/new-meetup
import { MongoClient } from 'mongodb';

async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;
        const { title, image, address, description } = data;

        const client = await MongoClient.connect(
            'mongodb+srv://user:12321@cluster0.pqx8t.mongodb.net/meetups?retryWrites=true&w=majority'
        );
        const db = client.db();
        const meetupsCollection = db.collection('meetups');

        const result = await meetupsCollection.insertOne(data); //insert one document into meetupsCollection colleciton
        console.log('result');

        // some error handler

        res.status(201).json({ message: 'meetup inserted' });
    }
}

export default handler;
