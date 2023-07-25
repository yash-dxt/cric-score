import { AbstractScoreScraper, MatchDetails, cricketFormats } from "./AbstractScoreScraper";
import { parse, HTMLElement } from 'node-html-parser';

export class CricbuzzScraper extends AbstractScoreScraper {
    scorePageUrl = "https://www.cricbuzz.com/";

    errorMessage = "something went wrong - maybe cricbuzz is down, maybe some internet issue";

    /*
    Selectors for the scraper. 
    */
    selectorMatchCard = ".cb-view-all-ga.cb-match-card";

    selectorMatchHeader = ".cb-mtch-crd-hdr"
    selectorMatchStatus = ".cb-mtch-crd-state";
    selectorTeamAndScore = ".cb-col-50.cb-ovr-flo";
    selectorMatchType = ".cb-card-match-format";

    async getFormattedMatchDetails(): Promise<MatchDetails[]> {
        const scorePageData = await super.scrapeScoreData();
        return this.getMatchDetails(scorePageData);
    }

    private getMatchDetails(scorePageData: string): MatchDetails[] {
        const scorePageDataHtmlEle = parse(scorePageData);
        const matchCards = scorePageDataHtmlEle.querySelectorAll(this.selectorMatchCard)
        return this.getDetailsFromMatchCards(matchCards);
    }

    private getDetailsFromMatchCards(matchCards: HTMLElement[]): MatchDetails[] {
        const matchDetails: MatchDetails[] = []
        matchCards.forEach((matchCard) => {
            const details = this.getDetailFromMatchCard(matchCard);
            if (details != null) {
                matchDetails.push(details)
            }
        })
        return matchDetails;
    }

    public getDetailFromMatchCard(matchCard: HTMLElement): MatchDetails | null {

        const matchStatusDetails = this.getMatchStatus(matchCard);
        if (!matchStatusDetails) {
            return null;
        }

        const matchScores = this.getMatchScores(matchCard);

        const matchDetails: MatchDetails =
            new MatchDetails(
                this.getMatchTypeFromMatchCard(matchCard),
                this.getMatchName(matchCard),
                matchStatusDetails,
                matchScores[0],
                matchScores[1],
            )

        return matchDetails;
    }

    getMatchStatus(matchCard: HTMLElement): string {
        return matchCard.querySelector(this.selectorMatchStatus)?.textContent ?? "";
    }

    getMatchName(matchCard: HTMLElement): string {
        const matchHeader = matchCard.querySelector(this.selectorMatchHeader);
        const divsUnderMatchHeader = matchHeader?.getElementsByTagName("div");
        const matchName = divsUnderMatchHeader ? divsUnderMatchHeader[0].textContent : "";

        return matchName;
    }

    getMatchScores(matchCard: HTMLElement): Map<string, string>[] {
        const matchTeamsAndScores = matchCard.querySelectorAll(this.selectorTeamAndScore)
        const firstTeamName = matchTeamsAndScores[0].textContent;
        const firstTeamScore = matchTeamsAndScores[1].textContent;

        const secondTeamName = matchTeamsAndScores[2].textContent;
        const secondTeamScore = matchTeamsAndScores[3].textContent;

        const firstTeamScores = new Map<string, string>([[firstTeamName, firstTeamScore]]);
        const secondTeamScores = new Map<string, string>([[secondTeamName, secondTeamScore]]);

        return [firstTeamScores, secondTeamScores]
    }

    getMatchTypeFromMatchCard(matchCard: HTMLElement): cricketFormats {
        const matchType = matchCard.querySelector(this.selectorMatchType)?.textContent ?? ""

        if (matchType.toLowerCase().includes("test")) return cricketFormats.test
        if (matchType.toLowerCase().includes("odi")) return cricketFormats.odi
        if (matchType.toLowerCase().includes("t20")) return cricketFormats.t20
        return cricketFormats.other
    }
}

