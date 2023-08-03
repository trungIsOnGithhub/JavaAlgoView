import * as path from 'path';
import * as express from 'express';
import { Express, Request, Response } from 'express';

export default function createApp() : Express {
    const app = express();

    app.use(express.static(path.join(__dirname, '../dist/client'))); 

    app.get('/home', async (req: Request, res: Response) => {
        res.sendFile('index.html');
    });

    app.get('/api/:name', async (req: Request, res: Response) => {
        const name = req.params['name'];
        const greeting = { greeting: `Hello, ${ name }` };
        res.send(greeting);
    });

    return app;
}