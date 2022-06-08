import { updateEntry } from '../../database/database';

// POST: api/send
export default async function handler(req, res) {
    const item = req.body;
    const databaseResult = await updateEntry(item);
    res.status(200).json(databaseResult);
}