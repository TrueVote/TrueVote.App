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

export interface AccessCodeModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RequestId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RequestDescription: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RequestedByUserId: string;
  /** @format date */
  DateCreated: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 16
   */
  AccessCode: string;
}

export interface AccessCodesRequest {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  UserId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RequestDescription: string;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  NumberOfAccessCodes: number;
}

export interface AccessCodesResponse {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RequestId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  AccessCodes: AccessCodeModel[];
}

export interface AddCandidatesModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RaceId: string;
  CandidateIds: string[];
}

export interface AddRacesModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  RaceIds: string[];
}

export interface BallotHashModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  BallotHashId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
  /** @format byte */
  ServerBallotHash: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  ServerBallotHashS: string;
  /** @format date */
  DateCreated: string;
  /** @format date */
  DateUpdated: string;
  /**
   * @format string
   * @maxLength 2048
   */
  TimestampId?: string | null;
}

export interface BallotList {
  /** @maxItems 2048 */
  Ballots: BallotModel[];
  /** @maxItems 2048 */
  BallotHashes: BallotHashModel[];
}

export interface BallotModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
  Election: ElectionModel;
  /** @format date */
  DateCreated: string;
}

export interface BaseCandidateModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /**
   * @format string
   * @maxLength 2048
   */
  PartyAffiliation?: string | null;
  /**
   * @format string
   * @maxLength 1024
   */
  CandidateImageUrl?: string | null;
  /** @format date */
  DateCreated: string;
  Selected: boolean;
  /**
   * @format string
   * @maxLength 1024
   */
  SelectedMetadata?: string | null;
}

export interface BaseElectionModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 32768
   */
  Description: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 1024
   */
  HeaderImageUrl: string;
  /** @format date */
  StartDate: string;
  /** @format date */
  EndDate: string;
  Races: BaseRaceModel[];
}

export interface BaseRaceModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  RaceType: RaceTypes;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RaceTypeName: string;
  /** @format date */
  DateCreated: string;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  MaxNumberOfChoices?: number | null;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  MinNumberOfChoices?: number | null;
  BaseCandidates: BaseCandidateModel[];
}

export interface BaseUserModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  FullName: string;
  /**
   * @format email
   * @minLength 1
   * @maxLength 2048
   * @pattern ^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$
   */
  Email: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  NostrPubKey: string;
}

export interface BuildInfo {
  /** @maxLength 2048 */
  Branch?: string | null;
  /** @maxLength 2048 */
  BuildTime?: string | null;
  /** @maxLength 2048 */
  LastTag?: string | null;
  /** @maxLength 2048 */
  Commit?: string | null;
}

export interface CandidateModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /**
   * @format string
   * @maxLength 2048
   */
  PartyAffiliation?: string | null;
  /**
   * @format string
   * @maxLength 1024
   */
  CandidateImageUrl?: string | null;
  /** @format date */
  DateCreated: string;
  Selected: boolean;
  /**
   * @format string
   * @maxLength 1024
   */
  SelectedMetadata?: string | null;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  CandidateId: string;
}

export interface CandidateModelList {
  /** @maxItems 2048 */
  Candidates: CandidateModel[];
}

export interface CheckCodeRequest {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  UserId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  AccessCode: string;
}

export interface CountBallotModel {
  /** @format date */
  DateCreatedStart: string;
  /** @format date */
  DateCreatedEnd: string;
}

export interface CountBallotModelResponse {
  /**
   * @format int64
   * @min 0
   */
  BallotCount: number;
}

export interface ElectionModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 32768
   */
  Description: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 1024
   */
  HeaderImageUrl: string;
  /** @format date */
  StartDate: string;
  /** @format date */
  EndDate: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * @format string
   * @maxLength 2048
   */
  ParentElectionId?: string | null;
  /** @format date */
  DateCreated: string;
  Races: RaceModel[];
}

export interface ElectionModelList {
  /** @maxItems 2048 */
  Elections: ElectionModel[];
}

export interface Error500Flag {
  Error: boolean;
}

export interface FeedbackModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  FeedbackId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  UserId: string;
  /** @format date */
  DateCreated: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Feedback: string;
}

export interface FindBallotHashModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
}

export interface FindBallotModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
}

export interface FindCandidateModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /**
   * @format string
   * @maxLength 2048
   */
  PartyAffiliation?: string | null;
}

export interface FindElectionModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
}

export interface FindRaceModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
}

export interface FindTimestampModel {
  /** @format date */
  DateCreatedStart: string;
  /** @format date */
  DateCreatedEnd: string;
}

export interface FindUserModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  FullName: string;
  /**
   * @format email
   * @maxLength 2048
   * @pattern ^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$
   */
  Email?: string | null;
}

/** @format int32 */
export enum NostrKind {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value16 = 16,
  Value40 = 40,
  Value41 = 41,
  Value42 = 42,
  Value43 = 43,
  Value44 = 44,
  Value1063 = 1063,
  Value1311 = 1311,
  Value1984 = 1984,
  Value1985 = 1985,
  Value9734 = 9734,
  Value9735 = 9735,
  Value10000 = 10000,
  Value10001 = 10001,
  Value10002 = 10002,
  Value13194 = 13194,
  Value22242 = 22242,
  Value23194 = 23194,
  Value23195 = 23195,
  Value24133 = 24133,
  Value27235 = 27235,
  Value30000 = 30000,
  Value30001 = 30001,
  Value30008 = 30008,
  Value30009 = 30009,
  Value30023 = 30023,
  Value30024 = 30024,
  Value30078 = 30078,
  Value30311 = 30311,
  Value30402 = 30402,
}

export interface RaceModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  RaceType: RaceTypes;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RaceTypeName: string;
  /** @format date */
  DateCreated: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  RaceId: string;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  MaxNumberOfChoices?: number | null;
  /**
   * @format int32
   * @min 0
   * @max 2147483647
   */
  MinNumberOfChoices?: number | null;
  Candidates: CandidateModel[];
}

export interface RaceModelList {
  /** @maxItems 2048 */
  Races: RaceModel[];
}

/** @format int32 */
export enum RaceTypes {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

export interface SecureString {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Value: string;
}

export interface SignInEventModel {
  Kind: NostrKind;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  PubKey: string;
  /** @format date */
  CreatedAt: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Signature: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Content: string;
}

export interface SignInResponse {
  User: UserModel;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Token: string;
}

export interface StatusModel {
  /** @maxLength 2048 */
  CurrentTime?: string | null;
  /**
   * @format int64
   * @min 0
   */
  ExecutionTime?: number;
  /** @maxLength 2048 */
  ExecutionTimeMsg?: string | null;
  Responds?: boolean;
  /** @maxLength 2048 */
  RespondsMsg?: string | null;
  BuildInfo?: BuildInfo;
  /** @maxLength 2048 */
  BuildInfoReadTime?: string | null;
}

export interface SubmitBallotModel {
  Election: ElectionModel;
  /**
   * @format string
   * @minLength 1
   * @maxLength 16
   */
  AccessCode: string;
}

export interface SubmitBallotModelResponse {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 32768
   */
  Message: string;
}

export interface TimestampModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  TimestampId: string;
  /** @format byte */
  MerkleRoot: string;
  /** @format byte */
  MerkleRootHash: string;
  /** @format byte */
  TimestampHash: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  TimestampHashS: string;
  /** @format date-time */
  timestampAt?: string;
  /**
   * @format uri
   * @minLength 1
   * @maxLength 2048
   */
  CalendarServerUrl: string;
  /** @format date */
  DateCreated: string;
}

export interface UserModel {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  UserId: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  NostrPubKey: string;
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  FullName: string;
  /**
   * @format email
   * @minLength 1
   * @maxLength 2048
   * @pattern ^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$
   */
  Email: string;
  /** @format date */
  DateCreated: string;
  /** @format date */
  DateUpdated: string;
  UserPreferences: UserPreferencesModel;
}

export interface UserModelList {
  /** @maxItems 2048 */
  Users: UserModel[];
}

export interface UserPreferencesModel {
  NotificationNewElections?: boolean;
  NotificationElectionStart?: boolean;
  NotificationElectionEnd?: boolean;
  NotificationNewTrueVoteFeatures?: boolean;
}
