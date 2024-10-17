import { gql } from '@apollo/client';

export const electionDetailsByIdQuery = gql`
  query GetElectionById($ElectionId: String!) {
    GetElectionById(ElectionId: $ElectionId) {
      ElectionId
      Name
      Description
      HeaderImageUrl
      DateCreated
      StartDate
      EndDate
      Races {
        Name
        RaceId
        DateCreated
        RaceType
        RaceTypeName
        MinNumberOfChoices
        MaxNumberOfChoices
        Candidates {
          CandidateId
          DateCreated
          Name
          PartyAffiliation
          CandidateImageUrl
          Selected
          SelectedMetadata
        }
      }
    }
  }
`;

export const allElectionsQuery = gql`
  query GetAllElections {
    GetElection {
      ElectionId
      Name
      Description
      HeaderImageUrl
      DateCreated
      StartDate
      EndDate
    }
  }
`;

export const allBallotsQuery = gql`
  query GetAllBallots {
    GetBallot {
      Ballots {
        BallotId
        DateCreated
        Election {
          ElectionId
          Name
          Races {
            Name
            RaceId
            DateCreated
            RaceType
            RaceTypeName
            Candidates {
              CandidateId
              DateCreated
              Name
              PartyAffiliation
              CandidateImageUrl
              Selected
              SelectedMetadata
            }
          }
        }
      }
      BallotHashes {
        BallotId
        BallotHashId
        ServerBallotHash
        ServerBallotHashS
        DateCreated
        DateUpdated
        TimestampId
      }
    }
  }
`;

export const ballotDetailsByIdQuery = gql`
  query GetBallotById($BallotId: String!) {
    GetBallotById(BallotId: $BallotId) {
      Ballots {
        BallotId
        DateCreated
        Election {
          ElectionId
          Name
          Races {
            Name
            RaceId
            DateCreated
            RaceType
            RaceTypeName
            Candidates {
              CandidateId
              DateCreated
              Name
              PartyAffiliation
              CandidateImageUrl
              Selected
              SelectedMetadata
            }
          }
        }
      }
      BallotHashes {
        BallotId
        BallotHashId
        ServerBallotHash
        ServerBallotHashS
        DateCreated
        DateUpdated
        TimestampId
      }
    }
  }
`;

export const electionResultsByIdQuery = gql`
  query GetElectionResultsById($ElectionId: String!) {
    GetElectionResultsByElectionId(ElectionId: $ElectionId) {
      ElectionId
      TotalBallots
      Races {
        RaceId
        RaceName
        CandidateResults {
          CandidateId
          CandidateName
          TotalVotes
        }
      }
    }
  }
`;

export const electionResultsByIdSubscription = gql`
  subscription ElectionResultsUpdated($electionId: String!) {
    ElectionResultsUpdated(electionId: $electionId) {
      ElectionId
      TotalBallots
      Races {
        RaceId
        RaceName
        CandidateResults {
          CandidateId
          CandidateName
          TotalVotes
        }
      }
    }
  }
`;
