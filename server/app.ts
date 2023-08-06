import path from 'path';
import express from 'express';
import { LeetCode } from "leetcode-query";
import { FileDB, ProblemPool, ProblemSummary } from '../cron/job';
import { Express, Request, Response } from 'express';

const PORT = 3000;

const app = express();
app.use(express.json());

const leetcode = new LeetCode(); 

let summary: ProblemSummary = new ProblemSummary();

app.get('/', async (req: Request, res: Response) => {
    res.sendFile((path.join(__dirname, '../../client/', 'index.html')));
});

app.get('/:username', async (req: Request, res: Response) => {
    const recent_submissions = await leetcode.recent_submissions(req.params['username']);

    if(recent_submissions.length <= 0) {
        res.status(404).json("User Not Found");
        return;
    }

    summary.update(recent_submissions);

    const timeAscPool = new ProblemPool(summary);
    timeAscPool.sortAscTimestamp();

    let currentLastSlug = timeAscPool.getLastSlug();

    const { content, title } = (await leetcode.problem(currentLastSlug));
    const notes = summary.getProblemRecord(currentLastSlug);

    res.status(200).json({
        slug: currentLastSlug,
        title: title,
        content: content,
        notes: notes
    })
});

app.post('/:titleSlug/note', async (req: Request, res: Response) => {
    let noteContent = req.body.content;

    if(!summary.existProblem(req.params['titleSlug'])) {
        res.status(404).json("Unavailable Problem!");
        return;
    }

    summary.addNoteToProblem(req.params['titleSlug'], noteContent);

    res.status(200).json("Note Added Successfully!");
});

app.get('/end', async (req: Request, res: Response) => {
    new FileDB().write(summary.toString());
    res.status(200).json("Saved Session. You can leave page now");
});

app.listen(PORT, () => {
    console.log(`running on port: ${PORT}`)
})