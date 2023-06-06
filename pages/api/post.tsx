import { connectToDatabase } from '../../lib/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { authorId, username, content, success, publicity, words } = data;

  const client = await connectToDatabase();

  const db = client.db("starterData");

  const result = await db.collection('posts').insertOne({
    date: new Date(),
    text: content,
    reactions: {
        laughs: [],
        cries: [],
        screams: [],
        plots: [],
        crafts: []
    },
    authorID: authorId,
    author: username,
    postSucess: success,
    public: publicity,
    words: words,
  });

  res.status(201).json(result);
  client.close();
}

export default handler;