import { deleteItem } from '../../database/database';

// DELETE: api/delete
export default async function handler(req, res) {

    const deleteHandle = async (item) => {
        const res = await deleteItem(item);
        return res;
    }

    if(req.method === "DELETE") {
        const reqBody = req.body;

        try {
            const data = await deleteHandle(reqBody);
            res.status(200).json({success: true, data: data});
        } catch(e) {
            res.status(500).json({
                error: e,
                success: false,
            })
        }
    }
}