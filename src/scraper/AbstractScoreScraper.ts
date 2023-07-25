import chalk from 'chalk';
import fetch from 'node-fetch';

export enum cricketFormats {
    test, odi, t20, other
}

export class MatchDetails {
    matchType: cricketFormats
    matchName: string
    matchStatus: string

    scoreSet1: Map<String, String>
    scoreSet2: Map<String, String>

    constructor(
        matchType: cricketFormats,
        matchName: string,
        matchStatus: string,
        scoreSet1?: Map<string, string>,
        scoreSet2?: Map<string, string>
    ) {
        this.matchType = matchType;
        this.matchName = matchName;
        this.matchStatus = matchStatus;
        this.scoreSet1 = scoreSet1 || new Map<string, string>();
        this.scoreSet2 = scoreSet2 || new Map<string, string>();
    }


    public prettyPrintMatchDetails(): void {
        console.log(this.getTeamColours(this.matchName) + " " + this.matchName)
        this.displayScores()
        console.log(this.matchStatus)
        console.log("\n")
    }

    public getTeamColours(matchName: string): string {

        let colouredString = "";
        if (matchName.toLowerCase().includes("india")) {
            colouredString += chalk.bgCyan("  ")
        }

        if (matchName.toLowerCase().includes("west indies")) {
            colouredString += chalk.bgRed("  ")
        }

        if (matchName.toLowerCase().includes("england")) {
            colouredString += chalk.bgBlue("  ")
        }

        if (matchName.toLowerCase().includes("pakistan")) {
            colouredString += chalk.bgGreen("  ")
        }

        if (matchName.toLowerCase().includes("ireland")) {
            colouredString += chalk.bgGreenBright("  ")
        }

        if (matchName.toLowerCase().includes("australia")) {
            colouredString += chalk.bgYellow("  ")
        }

        if (matchName.toLowerCase().includes("sri lanka")) {
            colouredString += chalk.bgYellowBright("  ")
        }

        return colouredString;
    }

    private displayScores(): void {
        this.scoreSet1.forEach((score, team) => [
            console.log(`${team}: ${score}`)
        ])

        this.scoreSet2.forEach((score, team) => [
            console.log(`${team}: ${score ? score : "Yet to Bat"}`)
        ])
    }

}


export abstract class AbstractScoreScraper {
    abstract scorePageUrl: string;

    // function which scrapes the data from the above mentioned url. 
    protected async scrapeScoreData(): Promise<string> {
        const response = await fetch(this.scorePageUrl);
        const data = await response.text();
        return data;
    };

    // function which takes in scraped data, cleans it up & then returns the data that has all the scores. 
    // this could be then displayed to the user. 
    abstract getFormattedMatchDetails(): Promise<MatchDetails[]>;
}
