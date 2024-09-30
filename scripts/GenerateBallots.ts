#!/usr/bin/env ts-node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// import { BallotModel } from '../src/TrueVote.Api';

const generateBallots = (electionId: string, numberOfBallots: number): number => {
  // Fetch the election

  console.info(`Generating ${numberOfBallots} ballots for election ${electionId}`);

  // Generate N number of EACs for this election

  // Generate N number of Users for this election

  var numBallotsGenerated = 0;
  // Loop through N number of iterations
  // For each iteration, generate a BallotModel with randomly selected candidates selected = true
  // Submit the ballot
  // Increment the ballot count

  return numBallotsGenerated;
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

  const ballotCount = generateBallots(argv.electionid, argv.numberofballots);

  console.info(`Generated ${ballotCount} ballots for election ${argv.electionid}`);
};

main().catch(console.error);
