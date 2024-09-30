#!/usr/bin/env ts-node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { BallotModel } from '../src/TrueVote.Api';

const generateBallots = (electionId: string, numberOfBallots: number): BallotModel[] => {
  // Implement your ballot generation logic here
  // then randomly selecting candidates for each ballot
  console.info(`Generating ${numberOfBallots} ballots for election ${electionId}`);
  return [];
};

const main = async (): Promise<void> => {
  const argv = await yargs(hideBin(process.argv))
    .option('electionid', {
      alias: 'e',
      description: 'Election ID',
      type: 'string',
      demandOption: true,
    })
    .option('numberofballots', {
      alias: 'n',
      description: 'Number of ballots to generate',
      type: 'number',
      demandOption: true,
    })
    .help()
    .alias('help', 'h')
    .parse();

  const ballots = generateBallots(argv.electionid, argv.numberofballots);
  console.info(`Generated ${ballots.length} ballots for election ${argv.electionid}`);
};

main().catch(console.error);
