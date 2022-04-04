import { Client } from 'faunadb';

const secret = process.env.FAUNADB_KEY;

export const fauna = new Client({
    secret: secret,
    domain: "db.us.fauna.com",
})