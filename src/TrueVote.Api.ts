/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AddCandidatesModel {
  /**
   * Race Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  RaceId: string;
  /**
   * Candidate Ids
   * @pattern ^[A-Za-z0-9]
   */
  CandidateIds: string[];
}

export interface AddRacesModel {
  /**
   * Election Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  ElectionId?: string | null;
  /**
   * Race Ids
   * @pattern ^[A-Za-z0-9]
   */
  RaceIds: string[];
}

export interface BallotHashModel {
  /**
   * Ballot Hash Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  BallotHashId?: string | null;
  /**
   * Ballot Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  BallotId?: string | null;
  /**
   * Server Ballot Hash
   * @format binary
   */
  ServerBallotHash?: Uint8Array | null;
  /**
   * Server Ballot Hash String
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  ServerBallotHashS?: string | null;
  /**
   * DateCreated
   * @format date
   * @maxLength 2048
   */
  DateCreated?: string | null;
  /**
   * DateUpdated
   * @format date
   * @maxLength 2048
   */
  DateUpdated?: string | null;
  /**
   * Timestamp Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  TimestampId: string | null;
}

export interface BallotList {
  /**
   * List of Ballots
   * @maxItems 2048
   */
  Ballots?: BallotModel[] | null;
  /**
   * List of Ballot Hashes
   * @maxItems 2048
   */
  BallotHashes?: BallotHashModel[] | null;
}

export interface BallotModel {
  /**
   * Ballot Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  BallotId: string;
  Election?: ElectionModel;
  /**
   * DateCreated
   * @format date
   * @maxLength 2048
   */
  DateCreated?: string | null;
}

export interface BaseCandidateModel {
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name: string;
  /**
   * Party Affiliation
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  PartyAffiliation?: string | null;
}

export interface BaseElectionModel {
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name: string;
  /**
   * Description
   * @format string
   * @maxLength 32768
   */
  Description?: string | null;
  /**
   * HeaderImageUrl
   * @format string
   * @maxLength 1024
   */
  HeaderImageUrl?: string | null;
  /**
   * StartDate
   * @format date
   * @maxLength 2048
   */
  StartDate: string;
  /**
   * EndDate
   * @format date
   * @maxLength 2048
   */
  EndDate: string;
  /** List of Races */
  Races: RaceModel[] | null;
}

export interface BaseRaceModel {
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name: string;
  /**
   * Race Type
   * @format int32
   */
  RaceType: 0 | 1 | 2;
}

export interface BaseUserModel {
  /**
   * First Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  FirstName: string;
  /**
   * Email Address
   * @format email
   * @minLength 1
   * @maxLength 2048
   * @pattern ^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$
   */
  Email: string;
}

/** Build information model */
export type BuildInfo = {
  /**
   * Git branch of instance
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Branch?: string | null;
  /**
   * Timestamp build was created
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  BuildTime?: string | null;
  /**
   * Git tag of instance
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  LastTag?: string | null;
  /**
   * Git commit hash of instance
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Commit?: string | null;
};

export interface CandidateModel {
  /**
   * Candidate Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  CandidateId?: string | null;
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name: string;
  /**
   * Party Affiliation
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  PartyAffiliation?: string | null;
  /**
   * CandidateImageUrl
   * @format string
   * @maxLength 1024
   */
  CandidateImageUrl?: string | null;
  /**
   * DateCreated
   * @format date
   * @maxLength 2048
   */
  DateCreated?: string | null;
  /** Selected */
  Selected?: boolean | null;
  /**
   * SelectedMetadata
   * @format string
   * @maxLength 1024
   */
  SelectedMetadata?: string | null;
}

export interface CandidateModelList {
  /**
   * List of Candidates
   * @maxItems 2048
   */
  Candidates?: CandidateModel[] | null;
}

export interface CountBallotModel {
  /**
   * DateCreatedStart
   * @format date
   * @maxLength 2048
   */
  DateCreatedStart: string;
  /**
   * DateCreatedEnd
   * @format date
   * @maxLength 2048
   */
  DateCreatedEnd: string;
}

export interface CountBallotModelResponse {
  /**
   * Number of Ballots
   * @format int64
   * @min 0
   */
  BallotCount?: number | null;
}

export interface ElectionModel {
  /**
   * Election Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  ElectionId?: string | null;
  /**
   * Parent Election Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  ParentElectionId?: string | null;
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name: string;
  /**
   * Description
   * @format string
   * @maxLength 32768
   */
  Description?: string | null;
  /**
   * HeaderImageUrl
   * @format string
   * @maxLength 32768
   */
  HeaderImageUrl?: string | null;
  /**
   * StartDate
   * @format date
   * @maxLength 2048
   */
  StartDate: string;
  /**
   * EndDate
   * @format date
   * @maxLength 2048
   */
  EndDate: string;
  /**
   * DateCreated
   * @format date
   * @maxLength 2048
   */
  DateCreated?: string | null;
  /** List of Races */
  Races: RaceModel[] | null;
}

export interface ElectionModelList {
  /**
   * List of Elections
   * @maxItems 2048
   */
  Elections?: ElectionModel[] | null;
}

export interface FindBallotHashModel {
  /**
   * Ballot Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  BallotId?: string | null;
}

export interface FindBallotModel {
  /**
   * Ballot Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  BallotId?: string | null;
}

export interface FindCandidateModel {
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name?: string | null;
  /**
   * Party Affiliation
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  PartyAffiliation?: string | null;
}

export interface FindElectionModel {
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name?: string | null;
}

export interface FindRaceModel {
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name?: string | null;
}

export interface FindTimestampModel {
  /**
   * DateCreatedStart
   * @format date
   * @maxLength 2048
   */
  DateCreatedStart: string;
  /**
   * DateCreatedEnd
   * @format date
   * @maxLength 2048
   */
  DateCreatedEnd: string;
}

export interface FindUserModel {
  /**
   * First Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  FirstName?: string | null;
  /**
   * Email Address
   * @format email
   * @maxLength 2048
   * @pattern ^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$
   */
  Email?: string | null;
}

/** PubKey */
export type PubKeyWrapper = {
  /**
   * Value
   * @format binary
   */
  Value?: Uint8Array | null;
};

export interface RaceModel {
  /**
   * Race Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  RaceId?: string | null;
  /**
   * Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Name: string;
  /**
   * Race Type
   * @format int32
   */
  RaceType: 0 | 1 | 2;
  /**
   * Race Type Name
   * @format string
   * @maxLength 2048
   */
  RaceTypeName?: string | null;
  /**
   * Race Type Metadata
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  RaceTypeMetadata?: string | null;
  /**
   * DateCreated
   * @format date
   * @maxLength 2048
   */
  DateCreated?: string | null;
  /** List of Candidates */
  Candidates: CandidateModel[] | null;
}

export interface RaceModelList {
  /**
   * List of Races
   * @maxItems 2048
   */
  Races?: RaceModel[] | null;
}

export interface SecureString {
  /**
   * Value
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  Value?: string | null;
}

export interface SignInEventModel {
  /** Kind */
  Kind?: StringWrapper;
  /** PubKey */
  PubKey?: PubKeyWrapper;
  /** CreatedAt */
  CreatedAt?: UInt64Wrapper;
  /**
   * Signature
   * @format binary
   */
  Signature?: Uint8Array | null;
}

export interface StatusModel {
  /**
   * Current Time
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  CurrentTime?: string | null;
  /**
   * Stopwatch time to run this method
   * @format int64
   * @min 0
   */
  ExecutionTime?: number | null;
  /**
   * Stopwatch time to run this method (message)
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  ExecutionTimeMsg?: string | null;
  /** True if method responds. Likely never false */
  Responds?: boolean | null;
  /**
   * True if method responds. Likely never false (message)
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  RespondsMsg?: string | null;
  /** Build information model */
  BuildInfo?: BuildInfo;
  /**
   * Timestamp this Build information data model was populated
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  BuildInfoReadTime?: string | null;
}

/** Kind */
export type StringWrapper = {
  /** Value */
  Value?: string | null;
};

export interface SubmitBallotModel {
  Election: ElectionModel;
}

export interface SubmitBallotModelResponse {
  /**
   * Ballot Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  BallotId?: string | null;
  /**
   * Election Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  ElectionId?: string | null;
  /**
   * Message
   * @format string
   * @maxLength 32768
   * @pattern ^[A-Za-z0-9]
   */
  Message?: string | null;
}

/** CreatedAt */
export type UInt64Wrapper = {
  /**
   * Value
   * @format int64
   */
  Value?: number | null;
};

export interface UserModel {
  /**
   * User Id
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  UserId?: string | null;
  /**
   * Nostr PubKey
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  NostrPubKey?: string | null;
  /**
   * First Name
   * @format string
   * @maxLength 2048
   * @pattern ^[A-Za-z0-9]
   */
  FirstName: string;
  /**
   * Email Address
   * @format email
   * @minLength 1
   * @maxLength 2048
   * @pattern ^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$
   */
  Email: string;
  /**
   * DateCreated
   * @format date
   * @maxLength 2048
   */
  DateCreated?: string | null;
}

export interface UserModelList {
  /**
   * List of Users
   * @maxItems 2048
   */
  Users?: UserModel[] | null;
}
