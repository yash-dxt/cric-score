#!/usr/bin/env node

import { CricbuzzScraper } from "./scraper/CricbuzzScraper";

const cricbuzzScraper = new CricbuzzScraper();
cricbuzzScraper.getFormattedMatchDetails().then((matches) => {

    for (let i = 0; i < 3; i++) {
        matches[i].prettyPrintMatchDetails();
    }
})
