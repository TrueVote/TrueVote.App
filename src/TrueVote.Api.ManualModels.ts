/* eslint-disable no-unused-vars */
// TODO This should be part of TrueVote.Api.ts. Need to properly export this enum in the API, not here
export enum RaceTypes {
  ChooseOne = 'CHOOSE_ONE',
  ChooseMany = 'CHOOSE_MANY',
  RankedChoice = 'RANKED_CHOICE',
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
  FileMetadata = 1063,
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
