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
        ElectionId
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
  query GetElectionResultsById($ElectionId: String!, $offset: Int = 0, $limit: Int = 100) {
    GetElectionResultsByElectionId(ElectionId: $ElectionId, offset: $offset, limit: $limit) {
      ElectionId
      TotalBallots
      TotalBallotsHashed
      BallotIds {
        Items {
          BallotId
          DateCreated
        }
        TotalCount
        Offset
        Limit
      }
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
  subscription ElectionResultsUpdated($ElectionId: String!, $offset: Int = 0, $limit: Int = 100) {
    ElectionResultsUpdated(ElectionId: $ElectionId, offset: $offset, limit: $limit) {
      ElectionId
      TotalBallots
      TotalBallotsHashed
      BallotIds {
        Items {
          BallotId
          DateCreated
        }
        TotalCount
        Offset
        Limit
      }
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
