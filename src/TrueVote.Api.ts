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

export interface ActionContext {
  actionDescriptor?: ActionDescriptor;
  httpContext?: HttpContext;
  modelState?: Record<string, ModelStateEntry>;
  routeData?: RouteData;
}

export interface ActionContextBooleanFunc {
  target?: any;
  method?: MethodInfo;
}

export interface ActionDescriptor {
  id?: string | null;
  routeValues?: Record<string, string | null>;
  attributeRouteInfo?: AttributeRouteInfo;
  actionConstraints?: IActionConstraintMetadata[] | null;
  endpointMetadata?: any[] | null;
  parameters?: ParameterDescriptor[] | null;
  boundProperties?: ParameterDescriptor[] | null;
  filterDescriptors?: FilterDescriptor[] | null;
  displayName?: string | null;
  properties?: Record<string, any>;
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

/** @format int32 */
export enum AddressFamily {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
  Value10 = 10,
  Value11 = 11,
  Value12 = 12,
  Value13 = 13,
  Value14 = 14,
  Value15 = 15,
  Value16 = 16,
  Value17 = 17,
  Value18 = 18,
  Value19 = 19,
  Value21 = 21,
  Value22 = 22,
  Value23 = 23,
  Value24 = 24,
  Value25 = 25,
  Value26 = 26,
  Value28 = 28,
  Value29 = 29,
  Value65536 = 65536,
  Value65537 = 65537,
  Value110 = -1,
}

export interface AsnEncodedData {
  oid?: Oid;
  /** @format byte */
  rawData?: string | null;
}

export interface Assembly {
  definedTypes?: TypeInfo[] | null;
  exportedTypes?: Type[] | null;
  /** @deprecated */
  codeBase?: string | null;
  entryPoint?: MethodInfo;
  fullName?: string | null;
  imageRuntimeVersion?: string | null;
  isDynamic?: boolean;
  location?: string | null;
  reflectionOnly?: boolean;
  isCollectible?: boolean;
  isFullyTrusted?: boolean;
  customAttributes?: CustomAttributeData[] | null;
  /** @deprecated */
  escapedCodeBase?: string | null;
  manifestModule?: Module;
  modules?: Module[] | null;
  /** @deprecated */
  globalAssemblyCache?: boolean;
  /** @format int64 */
  hostContext?: number;
  securityRuleSet?: SecurityRuleSet;
}

export interface AsymmetricAlgorithm {
  /** @format int32 */
  keySize?: number;
  legalKeySizes?: KeySizes[] | null;
  signatureAlgorithm?: string | null;
  keyExchangeAlgorithm?: string | null;
}

export interface AttributeRouteInfo {
  template?: string | null;
  /** @format int32 */
  order?: number;
  name?: string | null;
  suppressLinkGeneration?: boolean;
  suppressPathMatching?: boolean;
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

export interface BindingInfo {
  bindingSource?: BindingSource;
  binderModelName?: string | null;
  binderType?: Type;
  propertyFilterProvider?: IPropertyFilterProvider;
  requestPredicate?: ActionContextBooleanFunc;
  emptyBodyBehavior?: EmptyBodyBehavior;
  serviceKey?: any;
}

export interface BindingSource {
  displayName?: string | null;
  id?: string | null;
  isGreedy?: boolean;
  isFromRequest?: boolean;
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

export interface ByteReadOnlyMemory {
  /** @format int32 */
  length?: number;
  isEmpty?: boolean;
  span?: ByteReadOnlySpan;
}

export interface ByteReadOnlySpan {
  /** @format int32 */
  length?: number;
  isEmpty?: boolean;
}

/** @format int32 */
export enum CallingConventions {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value32 = 32,
  Value64 = 64,
}

export interface CancellationToken {
  isCancellationRequested?: boolean;
  canBeCanceled?: boolean;
  waitHandle?: WaitHandle;
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

export interface Claim {
  issuer?: string | null;
  originalIssuer?: string | null;
  properties?: Record<string, string>;
  subject?: ClaimsIdentity;
  type?: string | null;
  value?: string | null;
  valueType?: string | null;
}

export interface ClaimsIdentity {
  authenticationType?: string | null;
  isAuthenticated?: boolean;
  actor?: ClaimsIdentity;
  bootstrapContext?: any;
  claims?: Claim[] | null;
  label?: string | null;
  name?: string | null;
  nameClaimType?: string | null;
  roleClaimType?: string | null;
}

export interface ClaimsPrincipal {
  claims?: Claim[] | null;
  identities?: ClaimsIdentity[] | null;
  identity?: IIdentity;
}

export interface ConnectionInfo {
  id?: string | null;
  remoteIpAddress?: IPAddress;
  /** @format int32 */
  remotePort?: number;
  localIpAddress?: IPAddress;
  /** @format int32 */
  localPort?: number;
  clientCertificate?: X509Certificate2;
}

export interface ConstructorInfo {
  name?: string | null;
  declaringType?: Type;
  reflectedType?: Type;
  module?: Module;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
  attributes?: MethodAttributes;
  methodImplementationFlags?: MethodImplAttributes;
  callingConvention?: CallingConventions;
  isAbstract?: boolean;
  isConstructor?: boolean;
  isFinal?: boolean;
  isHideBySig?: boolean;
  isSpecialName?: boolean;
  isStatic?: boolean;
  isVirtual?: boolean;
  isAssembly?: boolean;
  isFamily?: boolean;
  isFamilyAndAssembly?: boolean;
  isFamilyOrAssembly?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isConstructedGenericMethod?: boolean;
  isGenericMethod?: boolean;
  isGenericMethodDefinition?: boolean;
  containsGenericParameters?: boolean;
  methodHandle?: RuntimeMethodHandle;
  isSecurityCritical?: boolean;
  isSecuritySafeCritical?: boolean;
  isSecurityTransparent?: boolean;
  memberType?: MemberTypes;
}

export interface ControllerActionDescriptor {
  id?: string | null;
  routeValues?: Record<string, string | null>;
  attributeRouteInfo?: AttributeRouteInfo;
  actionConstraints?: IActionConstraintMetadata[] | null;
  endpointMetadata?: any[] | null;
  parameters?: ParameterDescriptor[] | null;
  boundProperties?: ParameterDescriptor[] | null;
  filterDescriptors?: FilterDescriptor[] | null;
  properties?: Record<string, any>;
  controllerName?: string | null;
  actionName?: string | null;
  methodInfo?: MethodInfo;
  controllerTypeInfo?: TypeInfo;
  displayName?: string | null;
}

export interface ControllerContext {
  actionDescriptor?: ControllerActionDescriptor;
  httpContext?: HttpContext;
  modelState?: Record<string, ModelStateEntry>;
  routeData?: RouteData;
  valueProviderFactories?: IValueProviderFactory[] | null;
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

export interface CustomAttributeData {
  attributeType?: Type;
  constructor?: ConstructorInfo;
  constructorArguments?: CustomAttributeTypedArgument[] | null;
  namedArguments?: CustomAttributeNamedArgument[] | null;
}

export interface CustomAttributeNamedArgument {
  memberInfo?: MemberInfo;
  typedValue?: CustomAttributeTypedArgument;
  memberName?: string | null;
  isField?: boolean;
}

export interface CustomAttributeTypedArgument {
  argumentType?: Type;
  value?: any;
}

export interface Election {
  httpContext?: HttpContext;
  request?: HttpRequest;
  response?: HttpResponse;
  routeData?: RouteData;
  modelState?: Record<string, ModelStateEntry>;
  controllerContext?: ControllerContext;
  metadataProvider?: IModelMetadataProvider;
  modelBinderFactory?: IModelBinderFactory;
  url?: IUrlHelper;
  objectValidator?: IObjectModelValidator;
  problemDetailsFactory?: ProblemDetailsFactory;
  user?: ClaimsPrincipal;
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

/** @format int32 */
export enum EmptyBodyBehavior {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
}

export interface Error500Flag {
  Error: boolean;
}

/** @format int32 */
export enum EventAttributes {
  Value0 = 0,
  Value512 = 512,
  Value1024 = 1024,
}

export interface EventInfo {
  name?: string | null;
  declaringType?: Type;
  reflectedType?: Type;
  module?: Module;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
  memberType?: MemberTypes;
  attributes?: EventAttributes;
  isSpecialName?: boolean;
  addMethod?: MethodInfo;
  removeMethod?: MethodInfo;
  raiseMethod?: MethodInfo;
  isMulticast?: boolean;
  eventHandlerType?: Type;
}

export interface Exception {
  targetSite?: MethodBase;
  message?: string | null;
  data?: Record<string, any>;
  innerException?: Exception;
  helpLink?: string | null;
  source?: string | null;
  /** @format int32 */
  hResult?: number;
  stackTrace?: string | null;
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

/** @format int32 */
export enum FieldAttributes {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value16 = 16,
  Value32 = 32,
  Value64 = 64,
  Value128 = 128,
  Value256 = 256,
  Value512 = 512,
  Value1024 = 1024,
  Value4096 = 4096,
  Value8192 = 8192,
  Value32768 = 32768,
  Value38144 = 38144,
}

export interface FieldInfo {
  name?: string | null;
  declaringType?: Type;
  reflectedType?: Type;
  module?: Module;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
  memberType?: MemberTypes;
  attributes?: FieldAttributes;
  fieldType?: Type;
  isInitOnly?: boolean;
  isLiteral?: boolean;
  /** @deprecated */
  isNotSerialized?: boolean;
  isPinvokeImpl?: boolean;
  isSpecialName?: boolean;
  isStatic?: boolean;
  isAssembly?: boolean;
  isFamily?: boolean;
  isFamilyAndAssembly?: boolean;
  isFamilyOrAssembly?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isSecurityCritical?: boolean;
  isSecuritySafeCritical?: boolean;
  isSecurityTransparent?: boolean;
  fieldHandle?: RuntimeFieldHandle;
}

export interface FilterDescriptor {
  filter?: IFilterMetadata;
  /** @format int32 */
  order?: number;
  /** @format int32 */
  scope?: number;
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
export enum GenericParameterAttributes {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value8 = 8,
  Value16 = 16,
  Value28 = 28,
}

export interface HostString {
  value?: string | null;
  hasValue?: boolean;
  host?: string | null;
  /** @format int32 */
  port?: number | null;
}

export interface HttpContext {
  features?: TypeObjectKeyValuePair[] | null;
  request?: HttpRequest;
  response?: HttpResponse;
  connection?: ConnectionInfo;
  webSockets?: WebSocketManager;
  user?: ClaimsPrincipal;
  items?: Record<string, any>;
  requestServices?: IServiceProvider;
  requestAborted?: CancellationToken;
  traceIdentifier?: string | null;
  session?: ISession;
}

export interface HttpRequest {
  httpContext?: HttpContext;
  method?: string | null;
  scheme?: string | null;
  isHttps?: boolean;
  host?: HostString;
  pathBase?: PathString;
  path?: PathString;
  queryString?: QueryString;
  query?: StringStringValuesKeyValuePair[] | null;
  protocol?: string | null;
  headers?: Record<string, string[]>;
  cookies?: StringStringKeyValuePair[] | null;
  /** @format int64 */
  contentLength?: number | null;
  contentType?: string | null;
  /** @format binary */
  body?: Uint8Array | null;
  /** @format binary */
  bodyReader?: Uint8Array | null;
  hasFormContentType?: boolean;
  form?: StringStringValuesKeyValuePair[] | null;
  routeValues?: Record<string, any>;
}

export interface HttpResponse {
  httpContext?: HttpContext;
  /** @format int32 */
  statusCode?: number;
  headers?: Record<string, string[]>;
  /** @format binary */
  body?: Uint8Array | null;
  bodyWriter?: PipeWriter;
  /** @format int64 */
  contentLength?: number | null;
  contentType?: string | null;
  cookies?: IResponseCookies;
  hasStarted?: boolean;
}

export type IActionConstraintMetadata = object;

export type ICustomAttributeProvider = object;

export type IFilterMetadata = object;

export interface IIdentity {
  name?: string | null;
  authenticationType?: string | null;
  isAuthenticated?: boolean;
}

export type IModelBinderFactory = object;

export type IModelMetadataProvider = object;

export type IObjectModelValidator = object;

export interface IPAddress {
  addressFamily?: AddressFamily;
  /** @format int64 */
  scopeId?: number;
  isIPv6Multicast?: boolean;
  isIPv6LinkLocal?: boolean;
  isIPv6SiteLocal?: boolean;
  isIPv6Teredo?: boolean;
  isIPv6UniqueLocal?: boolean;
  isIPv4MappedToIPv6?: boolean;
  /**
   * @deprecated
   * @format int64
   */
  address?: number;
}

export interface IPropertyFilterProvider {
  propertyFilter?: ModelMetadataBooleanFunc;
}

export type IResponseCookies = object;

export type IRouter = object;

export type IServiceProvider = object;

export interface ISession {
  isAvailable?: boolean;
  id?: string | null;
  keys?: string[] | null;
}

export interface IUrlHelper {
  actionContext?: ActionContext;
}

export type IValueProviderFactory = object;

export type IntPtr = object;

export interface KeySizes {
  /** @format int32 */
  minSize?: number;
  /** @format int32 */
  maxSize?: number;
  /** @format int32 */
  skipSize?: number;
}

/** @format int32 */
export enum LayoutKind {
  Value0 = 0,
  Value2 = 2,
  Value3 = 3,
}

export interface MemberInfo {
  memberType?: MemberTypes;
  name?: string | null;
  declaringType?: Type;
  reflectedType?: Type;
  module?: Module;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
}

/** @format int32 */
export enum MemberTypes {
  Value1 = 1,
  Value2 = 2,
  Value4 = 4,
  Value8 = 8,
  Value16 = 16,
  Value32 = 32,
  Value64 = 64,
  Value128 = 128,
  Value191 = 191,
}

/** @format int32 */
export enum MethodAttributes {
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
  Value32 = 32,
  Value64 = 64,
  Value128 = 128,
  Value256 = 256,
  Value512 = 512,
  Value1024 = 1024,
  Value2048 = 2048,
  Value4096 = 4096,
  Value8192 = 8192,
  Value16384 = 16384,
  Value32768 = 32768,
  Value53248 = 53248,
}

export interface MethodBase {
  memberType?: MemberTypes;
  name?: string | null;
  declaringType?: Type;
  reflectedType?: Type;
  module?: Module;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
  attributes?: MethodAttributes;
  methodImplementationFlags?: MethodImplAttributes;
  callingConvention?: CallingConventions;
  isAbstract?: boolean;
  isConstructor?: boolean;
  isFinal?: boolean;
  isHideBySig?: boolean;
  isSpecialName?: boolean;
  isStatic?: boolean;
  isVirtual?: boolean;
  isAssembly?: boolean;
  isFamily?: boolean;
  isFamilyAndAssembly?: boolean;
  isFamilyOrAssembly?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isConstructedGenericMethod?: boolean;
  isGenericMethod?: boolean;
  isGenericMethodDefinition?: boolean;
  containsGenericParameters?: boolean;
  methodHandle?: RuntimeMethodHandle;
  isSecurityCritical?: boolean;
  isSecuritySafeCritical?: boolean;
  isSecurityTransparent?: boolean;
}

/** @format int32 */
export enum MethodImplAttributes {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value8 = 8,
  Value16 = 16,
  Value32 = 32,
  Value64 = 64,
  Value128 = 128,
  Value256 = 256,
  Value512 = 512,
  Value4096 = 4096,
  Value65535 = 65535,
}

export interface MethodInfo {
  name?: string | null;
  declaringType?: Type;
  reflectedType?: Type;
  module?: Module;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
  attributes?: MethodAttributes;
  methodImplementationFlags?: MethodImplAttributes;
  callingConvention?: CallingConventions;
  isAbstract?: boolean;
  isConstructor?: boolean;
  isFinal?: boolean;
  isHideBySig?: boolean;
  isSpecialName?: boolean;
  isStatic?: boolean;
  isVirtual?: boolean;
  isAssembly?: boolean;
  isFamily?: boolean;
  isFamilyAndAssembly?: boolean;
  isFamilyOrAssembly?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isConstructedGenericMethod?: boolean;
  isGenericMethod?: boolean;
  isGenericMethodDefinition?: boolean;
  containsGenericParameters?: boolean;
  methodHandle?: RuntimeMethodHandle;
  isSecurityCritical?: boolean;
  isSecuritySafeCritical?: boolean;
  isSecurityTransparent?: boolean;
  memberType?: MemberTypes;
  returnParameter?: ParameterInfo;
  returnType?: Type;
  returnTypeCustomAttributes?: ICustomAttributeProvider;
}

export interface ModelError {
  exception?: Exception;
  errorMessage?: string | null;
}

export interface ModelMetadataBooleanFunc {
  target?: any;
  method?: MethodInfo;
}

export interface ModelStateEntry {
  rawValue?: any;
  attemptedValue?: string | null;
  errors?: ModelError[] | null;
  validationState?: ModelValidationState;
  isContainerNode?: boolean;
  children?: ModelStateEntry[] | null;
}

/** @format int32 */
export enum ModelValidationState {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface Module {
  assembly?: Assembly;
  fullyQualifiedName?: string | null;
  name?: string | null;
  /** @format int32 */
  mdStreamVersion?: number;
  /** @format uuid */
  moduleVersionId?: string;
  scopeName?: string | null;
  moduleHandle?: ModuleHandle;
  customAttributes?: CustomAttributeData[] | null;
  /** @format int32 */
  metadataToken?: number;
}

export interface ModuleHandle {
  /** @format int32 */
  mdStreamVersion?: number;
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

export interface Oid {
  value?: string | null;
  friendlyName?: string | null;
}

/** @format int32 */
export enum ParameterAttributes {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value4 = 4,
  Value8 = 8,
  Value16 = 16,
  Value4096 = 4096,
  Value8192 = 8192,
  Value16384 = 16384,
  Value32768 = 32768,
  Value61440 = 61440,
}

export interface ParameterDescriptor {
  name?: string | null;
  parameterType?: Type;
  bindingInfo?: BindingInfo;
}

export interface ParameterInfo {
  attributes?: ParameterAttributes;
  member?: MemberInfo;
  name?: string | null;
  parameterType?: Type;
  /** @format int32 */
  position?: number;
  isIn?: boolean;
  isLcid?: boolean;
  isOptional?: boolean;
  isOut?: boolean;
  isRetval?: boolean;
  defaultValue?: any;
  rawDefaultValue?: any;
  hasDefaultValue?: boolean;
  customAttributes?: CustomAttributeData[] | null;
  /** @format int32 */
  metadataToken?: number;
}

export interface PathString {
  value?: string | null;
  hasValue?: boolean;
}

export interface PipeWriter {
  canGetUnflushedBytes?: boolean;
  /** @format int64 */
  unflushedBytes?: number;
}

export type ProblemDetailsFactory = object;

/** @format int32 */
export enum PropertyAttributes {
  Value0 = 0,
  Value512 = 512,
  Value1024 = 1024,
  Value4096 = 4096,
  Value8192 = 8192,
  Value16384 = 16384,
  Value32768 = 32768,
  Value62464 = 62464,
}

export interface PropertyInfo {
  name?: string | null;
  declaringType?: Type;
  reflectedType?: Type;
  module?: Module;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
  memberType?: MemberTypes;
  propertyType?: Type;
  attributes?: PropertyAttributes;
  isSpecialName?: boolean;
  canRead?: boolean;
  canWrite?: boolean;
  getMethod?: MethodInfo;
  setMethod?: MethodInfo;
}

export interface PublicKey {
  encodedKeyValue?: AsnEncodedData;
  encodedParameters?: AsnEncodedData;
  key?: AsymmetricAlgorithm;
  oid?: Oid;
}

export interface QueryString {
  value?: string | null;
  hasValue?: boolean;
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

export interface RouteData {
  dataTokens?: Record<string, any>;
  routers?: IRouter[] | null;
  values?: Record<string, any>;
}

export interface RuntimeFieldHandle {
  value?: IntPtr;
}

export interface RuntimeMethodHandle {
  value?: IntPtr;
}

export interface RuntimeTypeHandle {
  value?: IntPtr;
}

export interface SafeWaitHandle {
  isClosed?: boolean;
  isInvalid?: boolean;
}

export interface SecureString {
  /**
   * @format string
   * @minLength 1
   * @maxLength 2048
   */
  Value: string;
}

/** @format int32 */
export enum SecurityRuleSet {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
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

export interface StringStringKeyValuePair {
  key?: string | null;
  value?: string | null;
}

export interface StringStringValuesKeyValuePair {
  key?: string | null;
  value?: string[];
}

export interface StructLayoutAttribute {
  typeId?: any;
  value?: LayoutKind;
}

export interface SubmitBallotModel {
  Election: ElectionModel;
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

export interface Type {
  name?: string | null;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
  isInterface?: boolean;
  memberType?: MemberTypes;
  namespace?: string | null;
  assemblyQualifiedName?: string | null;
  fullName?: string | null;
  assembly?: Assembly;
  module?: Module;
  isNested?: boolean;
  declaringType?: Type;
  declaringMethod?: MethodBase;
  reflectedType?: Type;
  underlyingSystemType?: Type;
  isTypeDefinition?: boolean;
  isArray?: boolean;
  isByRef?: boolean;
  isPointer?: boolean;
  isConstructedGenericType?: boolean;
  isGenericParameter?: boolean;
  isGenericTypeParameter?: boolean;
  isGenericMethodParameter?: boolean;
  isGenericType?: boolean;
  isGenericTypeDefinition?: boolean;
  isSZArray?: boolean;
  isVariableBoundArray?: boolean;
  isByRefLike?: boolean;
  isFunctionPointer?: boolean;
  isUnmanagedFunctionPointer?: boolean;
  hasElementType?: boolean;
  genericTypeArguments?: Type[] | null;
  /** @format int32 */
  genericParameterPosition?: number;
  genericParameterAttributes?: GenericParameterAttributes;
  attributes?: TypeAttributes;
  isAbstract?: boolean;
  isImport?: boolean;
  isSealed?: boolean;
  isSpecialName?: boolean;
  isClass?: boolean;
  isNestedAssembly?: boolean;
  isNestedFamANDAssem?: boolean;
  isNestedFamily?: boolean;
  isNestedFamORAssem?: boolean;
  isNestedPrivate?: boolean;
  isNestedPublic?: boolean;
  isNotPublic?: boolean;
  isPublic?: boolean;
  isAutoLayout?: boolean;
  isExplicitLayout?: boolean;
  isLayoutSequential?: boolean;
  isAnsiClass?: boolean;
  isAutoClass?: boolean;
  isUnicodeClass?: boolean;
  isCOMObject?: boolean;
  isContextful?: boolean;
  isEnum?: boolean;
  isMarshalByRef?: boolean;
  isPrimitive?: boolean;
  isValueType?: boolean;
  isSignatureType?: boolean;
  isSecurityCritical?: boolean;
  isSecuritySafeCritical?: boolean;
  isSecurityTransparent?: boolean;
  structLayoutAttribute?: StructLayoutAttribute;
  typeInitializer?: ConstructorInfo;
  typeHandle?: RuntimeTypeHandle;
  /** @format uuid */
  guid?: string;
  baseType?: Type;
  /** @deprecated */
  isSerializable?: boolean;
  containsGenericParameters?: boolean;
  isVisible?: boolean;
}

/** @format int32 */
export enum TypeAttributes {
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
  Value24 = 24,
  Value32 = 32,
  Value128 = 128,
  Value256 = 256,
  Value1024 = 1024,
  Value2048 = 2048,
  Value4096 = 4096,
  Value8192 = 8192,
  Value16384 = 16384,
  Value65536 = 65536,
  Value131072 = 131072,
  Value196608 = 196608,
  Value262144 = 262144,
  Value264192 = 264192,
  Value1048576 = 1048576,
  Value12582912 = 12582912,
}

export interface TypeInfo {
  name?: string | null;
  customAttributes?: CustomAttributeData[] | null;
  isCollectible?: boolean;
  /** @format int32 */
  metadataToken?: number;
  isInterface?: boolean;
  memberType?: MemberTypes;
  namespace?: string | null;
  assemblyQualifiedName?: string | null;
  fullName?: string | null;
  assembly?: Assembly;
  module?: Module;
  isNested?: boolean;
  declaringType?: Type;
  declaringMethod?: MethodBase;
  reflectedType?: Type;
  underlyingSystemType?: Type;
  isTypeDefinition?: boolean;
  isArray?: boolean;
  isByRef?: boolean;
  isPointer?: boolean;
  isConstructedGenericType?: boolean;
  isGenericParameter?: boolean;
  isGenericTypeParameter?: boolean;
  isGenericMethodParameter?: boolean;
  isGenericType?: boolean;
  isGenericTypeDefinition?: boolean;
  isSZArray?: boolean;
  isVariableBoundArray?: boolean;
  isByRefLike?: boolean;
  isFunctionPointer?: boolean;
  isUnmanagedFunctionPointer?: boolean;
  hasElementType?: boolean;
  genericTypeArguments?: Type[] | null;
  /** @format int32 */
  genericParameterPosition?: number;
  genericParameterAttributes?: GenericParameterAttributes;
  attributes?: TypeAttributes;
  isAbstract?: boolean;
  isImport?: boolean;
  isSealed?: boolean;
  isSpecialName?: boolean;
  isClass?: boolean;
  isNestedAssembly?: boolean;
  isNestedFamANDAssem?: boolean;
  isNestedFamily?: boolean;
  isNestedFamORAssem?: boolean;
  isNestedPrivate?: boolean;
  isNestedPublic?: boolean;
  isNotPublic?: boolean;
  isPublic?: boolean;
  isAutoLayout?: boolean;
  isExplicitLayout?: boolean;
  isLayoutSequential?: boolean;
  isAnsiClass?: boolean;
  isAutoClass?: boolean;
  isUnicodeClass?: boolean;
  isCOMObject?: boolean;
  isContextful?: boolean;
  isEnum?: boolean;
  isMarshalByRef?: boolean;
  isPrimitive?: boolean;
  isValueType?: boolean;
  isSignatureType?: boolean;
  isSecurityCritical?: boolean;
  isSecuritySafeCritical?: boolean;
  isSecurityTransparent?: boolean;
  structLayoutAttribute?: StructLayoutAttribute;
  typeInitializer?: ConstructorInfo;
  typeHandle?: RuntimeTypeHandle;
  /** @format uuid */
  guid?: string;
  baseType?: Type;
  /** @deprecated */
  isSerializable?: boolean;
  containsGenericParameters?: boolean;
  isVisible?: boolean;
  genericTypeParameters?: Type[] | null;
  declaredConstructors?: ConstructorInfo[] | null;
  declaredEvents?: EventInfo[] | null;
  declaredFields?: FieldInfo[] | null;
  declaredMembers?: MemberInfo[] | null;
  declaredMethods?: MethodInfo[] | null;
  declaredNestedTypes?: TypeInfo[] | null;
  declaredProperties?: PropertyInfo[] | null;
  implementedInterfaces?: Type[] | null;
}

export interface TypeObjectKeyValuePair {
  key?: Type;
  value?: any;
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

export interface WaitHandle {
  handle?: IntPtr;
  safeWaitHandle?: SafeWaitHandle;
}

export interface WebSocketManager {
  isWebSocketRequest?: boolean;
  webSocketRequestedProtocols?: string[] | null;
}

export interface X500DistinguishedName {
  oid?: Oid;
  /** @format byte */
  rawData?: string | null;
  name?: string | null;
}

export interface X509Certificate2 {
  handle?: IntPtr;
  issuer?: string | null;
  subject?: string | null;
  serialNumberBytes?: ByteReadOnlyMemory;
  archived?: boolean;
  extensions?: X509Extension[] | null;
  friendlyName?: string | null;
  hasPrivateKey?: boolean;
  privateKey?: AsymmetricAlgorithm;
  issuerName?: X500DistinguishedName;
  /** @format date-time */
  notAfter?: string;
  /** @format date-time */
  notBefore?: string;
  publicKey?: PublicKey;
  /** @format byte */
  rawData?: string | null;
  rawDataMemory?: ByteReadOnlyMemory;
  serialNumber?: string | null;
  signatureAlgorithm?: Oid;
  subjectName?: X500DistinguishedName;
  thumbprint?: string | null;
  /** @format int32 */
  version?: number;
}

export interface X509Extension {
  oid?: Oid;
  /** @format byte */
  rawData?: string | null;
  critical?: boolean;
}
