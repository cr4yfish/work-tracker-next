import { getAll } from '../../database/database';

// GET: api/database/get

export default async function handler(req, res) {
    console.log("Got get request");

    if(req.method === "GET") {
        let data;
        try {
            data = await  getAll();
        } catch(e) {
            console.error("could not retrieve data",e);
            data = [];
        }
        
        console.log("Sending data:", data);

        if(data.length === 0) {
            console.log("Database is empty");
            data = [];
        }
        res.status(200).json(data);
    }
}