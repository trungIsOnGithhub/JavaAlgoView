import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { LeetCode, RecentSubmission } from "leetcode-query";

const CURRENT_TARGET_BUILD_DIR = __dirname; // may differ between many modules type
const BACK_TO_ROOT = '../../../';
dotenv.config( {path: path.join( CURRENT_TARGET_BUILD_DIR, BACK_TO_ROOT, '.env')} );

export class FileDB {
    private filepath: string;

    constructor() {
        this.filepath = path.join( CURRENT_TARGET_BUILD_DIR, BACK_TO_ROOT, 'data.json' );
        // console.log(this.filepath);
    }

    public write(content: string) {
        fs.writeFile(this.filepath, content, err => {
            if(err) {
              console.error(err);
              return;
            }
            console.log("file written successfully!");
        });
    }

    public read() : string {
        let content: string = "";

        try {
            content = fs.readFileSync(this.filepath, 'utf8');
        } catch (err) {
            console.error(err);
        }

        return content;
    }
}

class ProblemRecord {
    private lastSubmission: number;

    private notes: string[];

    constructor(lastSubmission: number, notes: string[]) {
        this.lastSubmission = lastSubmission;
        this.notes = notes;
    }

    public getLastSubmission(): number {
        return this.lastSubmission;
    }
    public setLastSubmission(timestamp: number) {
        this.lastSubmission = timestamp;
    }
    public addNote(note: string) {
        this.notes.push(note);
    }

    public toString() : string {
        return JSON.stringify({
            lastSubmission: this.lastSubmission,
            notes: this.notes
        });
    }
}

export class ProblemSummary {
    private records: Map<string, ProblemRecord>;

    constructor() {
        const data = new FileDB().read();

        this.records = Utils.toProblemSummary(data);
    }

    public getProblemRecord(titleSlug: string) : ProblemRecord {
        return this.records.get(titleSlug) || new ProblemRecord(-1, []);
    }

    public update(submissions: RecentSubmission[]) {
        submissions.forEach(submission => {
            const timestamp = parseInt(submission.timestamp);
            if(!this.existProblem(submission.titleSlug)) {
                this.addNewProblem(submission.titleSlug, timestamp, []);
            }
            else if(this.records.get(submission.titleSlug)?.getLastSubmission || 0 < timestamp) {
                this.updateLastSubmissionProblem(submission.titleSlug, timestamp);
            }
        });
    }

    public addNewProblem(titleSlug: string, lastSubmission: number, notes: string[]) {
        this.records.set(
            titleSlug,
            new ProblemRecord(lastSubmission, notes)   
        );
        // console.log(this.records.get(titleSlug));
    }

    public updateLastSubmissionProblem(titleSlug: string, timestamp: number) {
        this.records.get(titleSlug)?.setLastSubmission(timestamp);
    }

    public addNoteToProblem(titleSlug: string, noteContent: string) {
        this.records.get(titleSlug)?.addNote(noteContent);
    }

    public existProblem(titleSlug: string) : boolean {
        return this.records.has(titleSlug)
    }

    public toString() : string {
        return JSON.stringify(Object.fromEntries(this.records));
    }

    public toTitleSlugArray() : string[] {
        return Array.from(this.records, ([key, value]) => key);
    }
}

export class ProblemPool {
    private titleSlugs: string[];
    private problemSummary: ProblemSummary;

    public constructor(problemSummary: ProblemSummary) {
        this.problemSummary = problemSummary;
        this.titleSlugs = this.problemSummary.toTitleSlugArray();
    }

    public isEmpty() {
        return this.titleSlugs.length === 0;
    }

    public getFirstSlug() : string {
        if(this.isEmpty()) return "";
        return this.titleSlugs[0];
    }
    public getLastSlug() : string {
        if(this.isEmpty()) return "";
        return this.titleSlugs[this.titleSlugs.length-1];
    }

    public sortAscTimestamp() {
        this.titleSlugs.sort((key1: string, key2: string) => {
            const problem1 = this.problemSummary.getProblemRecord(key1);
            const problem2 = this.problemSummary.getProblemRecord(key2);

            return (problem1.getLastSubmission() > problem2.getLastSubmission())? 1 : -1;
        });
    }
}

class Utils {
    public static toProblemSummary(data: string) : Map<string, ProblemRecord> {
        const generic = JSON.parse(data);

        const problemSummary = new Map<string, ProblemRecord>();

        Object.keys(generic).forEach(key => {
            problemSummary.set(key,
                new ProblemRecord(generic[key].lastSubmission, generic[key].notes)
            );
        });

        return problemSummary;
    }

    public static dateToTimestamp(inputDate: string) {
        // assume input to be validated
        const splited = inputDate.split("/");
        return (new Date( parseInt(splited[2]), parseInt(splited[1]) - 1, parseInt(splited[0]) )).getTime();
    }
}

async function cronUpdateForUsername(username: string) {
    console.log(username)
    const leetcode = new LeetCode();

    const summary = new ProblemSummary();

    const recent_submissions = await leetcode.recent_submissions(username);

    // console.log(recent_submissions);

    if(recent_submissions.length > 0) {
        summary.update(recent_submissions);
        // console.log(summary.toTitleSlugArray());
        new FileDB().write(summary.toString());
    } else {
        console.log("No Data/Empty Data Returned!");
    }
}

cronUpdateForUsername(process.env['MY_LEETCODE_USERNAME'] ?? "");