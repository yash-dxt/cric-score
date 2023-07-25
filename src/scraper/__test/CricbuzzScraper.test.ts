import { CricbuzzScraper } from "../CricbuzzScraper";

test("cricbuzz scraper data working", async () => {
    const cricbuzzScraper = new CricbuzzScraper();
    const formattedScoreData = await cricbuzzScraper.getFormattedMatchDetails()
    formattedScoreData.forEach((formattedScore) => {
        formattedScore.prettyPrintMatchDetails()
    })
})