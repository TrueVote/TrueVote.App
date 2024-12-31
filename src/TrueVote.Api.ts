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

export interface SecureString {
  /**
   * Value
   * @minLength 1
   * @maxLength 2048
   */
  Value: string;
}

export interface SubmitBallotModelResponse {
  /**
   * Ballot Id
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
  /**
   * Election Id
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * Message
   * @minLength 1
   * @maxLength 32768
   */
  Message: string;
}

export interface SubmitBallotModel {
  /** Election */
  Election: ElectionModel;
  /**
   * Access Code
   * @minLength 1
   * @maxLength 16
   */
  AccessCode: string;
}

export type ElectionModel = RootElectionBaseModel & {
  /**
   * Election Id
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * Parent Election Id
   * @maxLength 2048
   */
  ParentElectionId?: string | null;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
  /** List of Races */
  Races: RaceModel[];
};

export type RaceModel = RootRaceBaseModel & {
  /**
   * Race Id
   * @minLength 1
   * @maxLength 2048
   */
  RaceId: string;
  /**
   * Max Number of Choices
   * @format int32
   * @min 0
   * @max 2147483647
   */
  MaxNumberOfChoices?: number | null;
  /**
   * Min Number of Choices
   * @format int32
   * @min 0
   * @max 2147483647
   */
  MinNumberOfChoices?: number | null;
  /** List of Candidates */
  Candidates: CandidateModel[];
};

export type CandidateModel = RootCandidateBaseModel & {
  /**
   * Candidate Id
   * @minLength 1
   * @maxLength 2048
   */
  CandidateId: string;
};

export interface RootCandidateBaseModel {
  /**
   * Name
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /**
   * Party Affiliation
   * @maxLength 2048
   */
  PartyAffiliation?: string;
  /**
   * CandidateImageUrl
   * @maxLength 1024
   */
  CandidateImageUrl?: string;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
  /** Selected */
  Selected: boolean;
  /**
   * SelectedMetadata
   * @maxLength 1024
   */
  SelectedMetadata?: string;
}

export interface RootRaceBaseModel {
  /**
   * Name
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /** Race Type */
  RaceType: RaceTypes;
  /**
   * Race Type Name
   * @minLength 1
   * @maxLength 2048
   */
  RaceTypeName: string;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
}

export enum RaceTypes {
  ChooseOne = 0,
  ChooseMany = 1,
  RankedChoice = 2,
}

export interface RootElectionBaseModel {
  /**
   * Name
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /**
   * Description
   * @minLength 1
   * @maxLength 32768
   */
  Description: string;
  /**
   * HeaderImageUrl
   * @minLength 1
   * @maxLength 1024
   */
  HeaderImageUrl: string;
  /**
   * StartDate
   * @format date
   * @minLength 1
   */
  StartDate: string;
  /**
   * EndDate
   * @format date
   * @minLength 1
   */
  EndDate: string;
  /** Unlisted */
  Unlisted: boolean;
}

export interface BallotList {
  /**
   * List of Ballots
   * @maxItems 2048
   */
  Ballots: BallotModel[];
  /**
   * List of Ballot Hashes
   * @maxItems 2048
   */
  BallotHashes: BallotHashModel[];
}

export interface BallotModel {
  /**
   * Ballot Id
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
  /**
   * Election Id
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /** Election for the Ballot */
  Election: ElectionModel;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
}

export interface BallotHashModel {
  /**
   * Ballot Hash Id
   * @minLength 1
   * @maxLength 2048
   */
  BallotHashId: string;
  /**
   * Ballot Id
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
  /**
   * Server Ballot Hash
   * @format byte
   * @minLength 1
   */
  ServerBallotHash: string;
  /**
   * Server Ballot Hash String
   * @minLength 1
   * @maxLength 2048
   */
  ServerBallotHashS: string;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
  /**
   * DateUpdated
   * @format date
   * @minLength 1
   */
  DateUpdated: string;
  /**
   * Timestamp Id
   * @maxLength 2048
   */
  TimestampId?: string | null;
}

export interface FindBallotModel {
  /**
   * Ballot Id
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
}

export interface CountBallotModelResponse {
  /**
   * Number of Ballots
   * @format int64
   * @min 0
   * @max 9223372036854780000
   */
  BallotCount: number;
}

export interface CountBallotModel {
  /**
   * DateCreatedStart
   * @format date
   * @minLength 1
   */
  DateCreatedStart: string;
  /**
   * DateCreatedEnd
   * @format date
   * @minLength 1
   */
  DateCreatedEnd: string;
}

export interface FindBallotHashModel {
  /**
   * Ballot Id
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
}

export type BaseCandidateModel = RootCandidateBaseModel & object;

export interface CandidateModelList {
  /**
   * List of Candidates
   * @maxItems 2048
   */
  Candidates: CandidateModel[];
}

export interface FindCandidateModel {
  /**
   * Name
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
  /**
   * Party Affiliation
   * @maxLength 2048
   */
  PartyAffiliation?: string;
}

export type CommunicationEventModel = RootCommunicationEventBaseModel & {
  /**
   * Communication Event Id
   * @minLength 1
   * @maxLength 2048
   */
  CommunicationEventId: string;
  /**
   * Status of the communication
   * @minLength 1
   * @maxLength 50
   */
  Status: string;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
  /**
   * DateUpdated
   * @format date
   * @minLength 1
   */
  DateUpdated: string;
  /**
   * DateProcessed
   * @format date-time
   */
  DateProcessed?: string | null;
  /**
   * Error message if failed
   * @maxLength 4096
   */
  ErrorMessage?: string | null;
  /**
   * Time To Live in seconds (null = forever)
   * @format int32
   */
  TimeToLive?: number | null;
};

export interface RootCommunicationEventBaseModel {
  /**
   * Type of communication (Email, SMS, Push)
   * @minLength 1
   * @maxLength 50
   */
  Type: string;
  /** Communication method and address/id (e.g., Email: user@domain.com, MobileDeviceId: abc123) */
  CommunicationMethod: Record<string, string>;
  /** Dictionary of related entity IDs and their types */
  RelatedEntities: Record<string, string>;
  /** Additional metadata for the communication event */
  Metadata?: Record<string, string>;
  CommunicationMethodJson?: string;
  RelatedEntitiesJson?: string;
  MetadataJson?: string | null;
}

export interface CommunicationEventUpdateModel {
  /**
   * Communication Event Id
   * @minLength 1
   * @maxLength 2048
   */
  CommunicationEventId: string;
  /**
   * Status of the communication
   * @minLength 1
   * @maxLength 50
   */
  Status: string;
  /**
   * DateUpdated
   * @format date-time
   */
  DateUpdated?: string;
  /**
   * DateProcessed
   * @format date-time
   * @minLength 1
   */
  DateProcessed: string;
  /**
   * Error message if failed
   * @maxLength 4096
   */
  ErrorMessage?: string | null;
}

export type BaseElectionModel = RootElectionBaseModel & {
  /** List of BaseRaces */
  BaseRaces: BaseRaceModel[];
};

export type BaseRaceModel = RootRaceBaseModel & {
  /**
   * Max Number of Choices
   * @format int32
   * @min 0
   * @max 2147483647
   */
  MaxNumberOfChoices: number;
  /**
   * Min Number of Choices
   * @format int32
   * @min 0
   * @max 2147483647
   */
  MinNumberOfChoices: number;
  /** List of BaseCandidates */
  BaseCandidates: BaseCandidateModel[];
};

export interface ElectionModelList {
  /**
   * List of Elections
   * @maxItems 2048
   */
  Elections: ElectionModel[];
}

export interface FindElectionModel {
  /**
   * Name
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
}

export interface AddRacesModel {
  /**
   * Election Id
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /** Race Ids */
  RaceIds: string[];
}

export interface AccessCodesResponse {
  /**
   * Request Id
   * @minLength 1
   * @maxLength 2048
   */
  RequestId: string;
  /**
   * Election Id
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /** List of Access Codes */
  AccessCodes: AccessCodeModel[];
}

export interface AccessCodeModel {
  /**
   * Request Id
   * @minLength 1
   * @maxLength 2048
   */
  RequestId: string;
  /**
   * Request Description
   * @minLength 1
   * @maxLength 2048
   */
  RequestDescription: string;
  /**
   * Election Id
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * Requested By User Id
   * @minLength 1
   * @maxLength 2048
   */
  RequestedByUserId: string;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
  /**
   * Access Code
   * @minLength 1
   * @maxLength 16
   */
  AccessCode: string;
}

export interface AccessCodesRequest {
  /**
   * Election Id
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * Request Description
   * @minLength 1
   * @maxLength 2048
   */
  RequestDescription: string;
  /**
   * Number of Access Codes
   * @format int32
   * @min 0
   * @max 2147483647
   */
  NumberOfAccessCodes: number;
}

export interface CheckCodeRequest {
  /**
   * AccessCode
   * @minLength 1
   * @maxLength 2048
   */
  AccessCode: string;
}

export interface VoterElectionAccessCodeRequest {
  /**
   * Election ID
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * Voter email address
   * @format email
   * @minLength 1
   * @maxLength 256
   */
  VoterEmail: string;
}

export interface Error500Flag {
  /** Error */
  Error: boolean;
}

export interface AddCandidatesModel {
  /**
   * Race Id
   * @minLength 1
   * @maxLength 2048
   */
  RaceId: string;
  /** Candidate Ids */
  CandidateIds: string[];
}

export interface RaceModelList {
  /**
   * List of Races
   * @maxItems 2048
   */
  Races: RaceModel[];
}

export interface FindRaceModel {
  /**
   * Name
   * @minLength 1
   * @maxLength 2048
   */
  Name: string;
}

export interface StatusModel {
  /**
   * Current Time
   * @maxLength 2048
   */
  CurrentTime?: string | null;
  /**
   * Stopwatch time to run this method
   * @format int64
   * @min 0
   * @max 9223372036854780000
   */
  ExecutionTime?: number;
  /**
   * Stopwatch time to run this method (message)
   * @maxLength 2048
   */
  ExecutionTimeMsg?: string | null;
  /** True if method responds. Likely never false */
  Responds?: boolean;
  /**
   * True if method responds. Likely never false (message)
   * @maxLength 2048
   */
  RespondsMsg?: string | null;
  /** Build information model */
  BuildInfo?: BuildInfo | null;
  /**
   * Timestamp this Build information data model was populated
   * @maxLength 2048
   */
  BuildInfoReadTime?: string;
}

export interface BuildInfo {
  /**
   * Git branch of instance
   * @maxLength 2048
   */
  Branch?: string;
  /**
   * Timestamp build was created
   * @maxLength 2048
   */
  BuildTime?: string;
  /**
   * Git tag of instance
   * @maxLength 2048
   */
  LastTag?: string;
  /**
   * Git commit hash of instance
   * @maxLength 2048
   */
  Commit?: string;
}

export interface TimestampModel {
  /**
   * Timestamp Id
   * @minLength 1
   * @maxLength 2048
   */
  TimestampId: string;
  /**
   * MerkleRoot
   * @format byte
   * @minLength 1
   */
  MerkleRoot: string;
  /**
   * MerkleRootHash
   * @format byte
   * @minLength 1
   */
  MerkleRootHash: string;
  /**
   * TimestampHash
   * @format byte
   * @minLength 1
   */
  TimestampHash: string;
  /**
   * TimestampHash String
   * @minLength 1
   * @maxLength 2048
   */
  TimestampHashS: string;
  /** @format date-time */
  TimestampAt?: string;
  /**
   * CalendarServerUrl
   * @format uri
   * @minLength 1
   * @maxLength 2048
   */
  CalendarServerUrl: string;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
}

export interface FindTimestampModel {
  /**
   * DateCreatedStart
   * @format date
   * @minLength 1
   */
  DateCreatedStart: string;
  /**
   * DateCreatedEnd
   * @format date
   * @minLength 1
   */
  DateCreatedEnd: string;
}

export interface UserModel {
  /**
   * User Id
   * @minLength 1
   * @maxLength 2048
   */
  UserId: string;
  /**
   * Nostr PubKey
   * @minLength 1
   * @maxLength 2048
   */
  NostrPubKey: string;
  /**
   * Full Name
   * @minLength 1
   * @maxLength 2048
   */
  FullName: string;
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
   * @minLength 1
   */
  DateCreated: string;
  /**
   * DateUpdated
   * @format date
   * @minLength 1
   */
  DateUpdated: string;
  /** UserPreferences */
  UserPreferences: UserPreferencesModel;
}

export interface UserPreferencesModel {
  /** Notification: New Elections */
  NotificationNewElections?: boolean;
  /** Notification: Election Start */
  NotificationElectionStart?: boolean;
  /** Notification: Election End */
  NotificationElectionEnd?: boolean;
  /** Notification: New TrueVote Features */
  NotificationNewTrueVoteFeatures?: boolean;
}

export interface BaseUserModel {
  /**
   * Full Name
   * @minLength 1
   * @maxLength 2048
   */
  FullName: string;
  /**
   * Email Address
   * @format email
   * @minLength 1
   * @maxLength 2048
   * @pattern ^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$
   */
  Email: string;
  /**
   * Nostr Public Key
   * @minLength 1
   * @maxLength 2048
   */
  NostrPubKey: string;
}

export interface UserModelList {
  /**
   * List of Users
   * @maxItems 2048
   */
  Users: UserModel[];
}

export interface FindUserModel {
  /**
   * Full Name
   * @minLength 1
   * @maxLength 2048
   */
  FullName: string;
  /**
   * Email Address
   * @format email
   * @maxLength 2048
   * @pattern ^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$
   */
  Email?: string;
}

export interface SignInResponse {
  /** User */
  User: UserModel;
  /**
   * Token
   * @minLength 1
   * @maxLength 2048
   */
  Token: string;
}

export interface SignInEventModel {
  /** Kind */
  Kind: NostrKind;
  /**
   * PubKey
   * @minLength 1
   * @maxLength 2048
   */
  PubKey: string;
  /**
   * CreatedAt
   * @format date-time
   * @minLength 1
   */
  CreatedAt: string;
  /**
   * Signature
   * @minLength 1
   * @maxLength 2048
   */
  Signature: string;
  /**
   * Content
   * @minLength 1
   * @maxLength 2048
   */
  Content: string;
}

export enum NostrKind {
  Metadata = 0,
  ShortTextNote = 1,
  RecommendRelay = 2,
  Contacts = 3,
  EncryptedDm = 4,
  EventDeletion = 5,
  Reserved = 6,
  Reaction = 7,
  BadgeAward = 8,
  GenericRepost = 16,
  ChannelCreation = 40,
  ChannelMetadata = 41,
  ChannelMessage = 42,
  ChannelHideMessage = 43,
  ChanelMuteUser = 44,
  Uint8ArrayMetadata = 1063,
  LiveChatMessage = 1311,
  Reporting = 1984,
  Label = 1985,
  ZapRequest = 9734,
  Zap = 9735,
  MuteList = 10000,
  PinList = 10001,
  RelayListMetadata = 10002,
  WalletInfo = 13194,
  ClientAuthentication = 22242,
  WalletRequest = 23194,
  WalletResponse = 23195,
  NostrConnect = 24133,
  HttpAuth = 27235,
  CategorizedPeopleList = 30000,
  CategorizedBookmarkList = 30001,
  ProfileBadges = 30008,
  BadgeDefinition = 30009,
  LongFormContent = 30023,
  DraftLongFormContent = 30024,
  ApplicationSpecificData = 30078,
  LiveEvent = 30311,
  ClassifiedListing = 30402,
}

export interface FeedbackModel {
  /**
   * Feedback Id
   * @minLength 1
   * @maxLength 2048
   */
  FeedbackId: string;
  /**
   * User Id
   * @minLength 1
   * @maxLength 2048
   */
  UserId: string;
  /**
   * DateCreated
   * @format date
   * @minLength 1
   */
  DateCreated: string;
  /**
   * Feedback
   * @minLength 1
   * @maxLength 2048
   */
  Feedback: string;
}

export interface ElectionResults {
  /**
   * Election Id
   * @minLength 1
   * @maxLength 2048
   */
  ElectionId: string;
  /**
   * Total number of ballots cast
   * @format int32
   * @min 0
   * @max 2147483647
   */
  TotalBallots: number;
  /**
   * Total number of ballots hashed
   * @format int32
   * @min 0
   * @max 2147483647
   */
  TotalBallotsHashed: number;
  /** List of Race Results */
  Races: RaceResult[];
  /** List of ballot IDs and ballot dates for the current page */
  PaginatedBallotIds: PaginatedBallotIds;
}

export interface RaceResult {
  /**
   * Race Id
   * @minLength 1
   * @maxLength 2048
   */
  RaceId: string;
  /**
   * Race Name
   * @minLength 1
   * @maxLength 2048
   */
  RaceName: string;
  /** List of Candidate Results */
  CandidateResults: CandidateResult[];
}

export interface CandidateResult {
  /**
   * Candidate Id
   * @minLength 1
   * @maxLength 2048
   */
  CandidateId: string;
  /**
   * Candidate Name
   * @minLength 1
   * @maxLength 2048
   */
  CandidateName: string;
  /**
   * Total votes received by the candidate
   * @format int32
   * @min 0
   * @max 2147483647
   */
  TotalVotes: number;
}

export interface PaginatedBallotIds {
  /** List of ballot IDs and ballot dates for the current page */
  Items: BallotIdInfo[];
  /**
   * Total number of ballot IDs across all pages
   * @format int32
   * @min 0
   * @max 2147483647
   */
  TotalCount: number;
  /**
   * Number of items to skip (starting position)
   * @format int32
   * @min 0
   * @max 2147483647
   */
  Offset: number;
  /**
   * Maximum number of items to return per page
   * @format int32
   * @min 1
   * @max 2147483647
   */
  Limit: number;
}

export interface BallotIdInfo {
  /**
   * Ballot Id
   * @minLength 1
   * @maxLength 2048
   */
  BallotId: string;
  /**
   * Date the ballot was created
   * @format date-time
   * @minLength 1
   */
  DateCreated: string;
}

export interface ServiceBusCommsMessage {
  /** Required message metadata (Type, CommunicationEventId, etc) */
  Metadata: Record<string, string>;
  /** Communication method and destination (Email, SMS, etc) */
  CommunicationMethod: Record<string, string>;
  /** Related entity IDs (ElectionId, BallotId, etc) */
  RelatedEntities: Record<string, string>;
  /** Type-specific message payload data */
  MessageData?: Record<string, string>;
}
