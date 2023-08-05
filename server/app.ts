import path from 'path';
import express from 'express';
import { LeetCode } from "leetcode-query";
import { FileDB, ProblemPool, ProblemSummary } from '../cron/job';
import { Express, Request, Response } from 'express';

const PORT = 3000;

// export default function createApp() : Express {
    const app = express();
    const leetcode = new LeetCode(); 

    let summary: ProblemSummary;

    app.get('/', async (req: Request, res: Response) => {
        res.sendFile((path.join(__dirname, '../../client/', 'index.html')));

        summary = new ProblemSummary();
    });

    app.get('/:username', async (req: Request, res: Response) => {
        const recent_submissions = await leetcode.recent_submissions("pkpawan");

        summary.update(recent_submissions);

        const timeAscPool = new ProblemPool(summary);
        timeAscPool.sortAscTimestamp();

        const { content, title } = (await leetcode.problem(timeAscPool.getLastSlug()));
        const notes = summary.getProblemRecord(timeAscPool.getLastSlug());

        res.json({
            title: title,
            content: content,
            notes: notes
        })
    });

    app.get('/end', async (req: Request, res: Response) => {
        new FileDB('data.json').write(summary.toString());
        res.json("Saved Session. You can leave page now");
    });

    app.listen(PORT, () => {
        console.log(`running on port: ${PORT}`)
    })
//     return app;
// }