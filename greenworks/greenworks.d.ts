declare module 'greenworks';

export type ErrorCallback = (error: Error) => void

export function ugcGetItems(
    options: any,
    ugc_matching_type: any,
    ugc_query_type: any,
    success_callback: any,
    error_callback: any): void
export function ugcGetUserItems(
    options: any,
    ugc_matching_type: any,
    ugc_list_sort_order: any,
    ugc_list: any,
    success_callback: any,
    error_callback: any): void
export function ugcSynchronizeItems(
    options: any,
    sync_dir: any,
    success_callback: any,
    error_callback: any): void
export function publishWorkshopFile(
    options: any,
    file_path: string,
    image_path: string,
    title: string,
    description: string,
    success_callback: any,
    error_callback: any): void
export function updatePublishedWorkshopFile(
    options: any,
    file_path: string,
    image_path: string,
    title: string,
    description: string,
    success_callback: any,
    error_callback: any): void
export function ugcPublish(
    file_name: string,
    title: string,
    image_name: string,
    success_callback: any,
    error_callback: any,
    progress_callback: any): void
export function ugcPublishUpdate(
    published_file_id: number,
    file_name: string,
    title: string,
    description: string,
    image_name: string,
    success_callback: any,
    error_callback: any,
    progress_callback: any): void

//- Stats
export function getStatInt(key: string): number
export function getStatFloat(key: string): number
export function setStatInt(key: string, value: number): boolean
export function setFloatInt(key: string, value: number): boolean
export function setStat(key: string, value: number): boolean
export function storeStats(
    success_callback: (game_id: number) => void,
    error_callback?: ErrorCallback): void

//- Settings
export function init(): boolean
export function initAPI(): boolean
export function isSteamRunning(): boolean
export function restartAppIfNecessary(appId: number): boolean
export function getAppId(): number
export function getAppBuildId(): number
export function getSteamId(): number
export function getCurrentGameLanguage(): string
export function getCurrentUILanguage(): string
// export function getAppInstallDir(app_id: number, )
export function getNumberOfPlayers(
    success_callback: (num_of_players: number) => void,
    error_callback: ErrorCallback): void
export type GameOverlayOption = 'Friends'|'Community'|'Players'|'Settings'|'OfficialGameGroup'|'Stats'|'Achievements'
export function activateGameOverlay(option: GameOverlayOption): void
export function isGameOverlayEnabled(): boolean
export function isSteamInBigPictureMode(): boolean
export function activateGameOverlayToWebPage(url: string): void
export function isSubscribedApp(appId: number): boolean
export function isAppInstalled(appId: number): boolean
export function getImageSize(handle: number): any
export function getImageRGBA(handle: number): Buffer
export function getIPCountry(): string
export function getLaunchCommandLine(): string

//- Friends
export enum FriendFlags
{
    None,
    Blocked,
    FriendshipRequested,
    Immediate,
    ClanMember,
    OnGameServer,
    RequestingFriendship,
    RequestingInfo,
    Ignored,
    IgnoredFriend,
    ChatMember,
    All
}
export enum FriendRelationship
{
    None,
    Blocked,
    RequestRecipient,
    Friend,
    RequestInitiator,
    Ignored,
    IgnoredFriend
}
export enum PersonaChange
{
    Name,
    Status,
    ComeOnline,
    GoneOffline,
    GamePlayed,
    GameServer,
    Avatar,
    JoinedSource,
    LeftSource,
    RelationshipChanged,
    NameFirstSet,
    FacebookInfo,
    NickName,
    SteamLevel
}
export enum AccountType
{
    Invalid,
    Individual,
    Multiseat,
    GameServer,
    AnonymousGameServer,
    Pending,
    ContentServer,
    Clan,
    Chat,
    ConsoleUser,
    AnonymousUser
}
export enum ChatEntryType
{
    Invalid,
    ChatMsg,
    Typing,
    InviteGame,
    Emote,
    LeftConversation,
    Entered,
    WasKicked,
    WasBanned,
    Disconnected,
    HistoricalChat,
    LinkBlocked
}
export interface SteamID
{
    isAnonymous(): boolean
    isAnonymousGameServer(): boolean
    isAnonymousGameServerLogin(): boolean
    isAnonymousUser(): boolean
    isChatAccount(): boolean
    isClanAccount(): boolean
    isConsoleUserAccount(): boolean
    isContentServerAccount(): boolean
    isGameServerAccount(): boolean
    isIndividualAccount(): boolean
    isPersistentGameServerAccount(): boolean
    isLobby(): boolean
    getAccountID(): number
    getRawSteamID(): string
    getAccountType(): AccountType
    isValid(): boolean
    getStaticAccountKey(): string
    getPersonaName(): string
    getNickname(): string
    getRelationship(): string
    getSteamLevel(): number
}
export function getFriendsAccount(friend_flag: FriendFlags): number
export function getFriends(friend_flag: FriendFlags): SteamID[]
export function requestUserInformation(raw_steam_id: string, require_name_only: boolean): void
export function getSmallFriendAvatar(raw_steam_id: string): number
export function getMediumFriendAvatar(raw_steam_id: string): number
export function getLargeFriendAvatar(raw_steam_id: string): number
export function setListenForFriendsMessage(intercept_enabled: boolean): boolean
export function replyToFriendMessage(raw_steam_id: string, message: string): boolean
export function getFriendMessage(
    raw_steam_id: string,
    message_id: number,
    maximum_message_size: number): string
export function getFriendPersonaName(raw_steam_id: string): string
export function setRichPresence(pchKey: string, pchValue: string): boolean
export function ClearRichPresence(): void
export function getFriendRichPresence(steamIDFriend: string, pchKey: string): string
export function setPlayedWith(steamIDUserPlayedWith: string): void
export function getFriendGamePlayed(steamIDFriend: string): any
export function activateGameOverlayInviteDialog(steamIDLobby: string): void
export type PCHDialogOption = 'steamid'|'chat'|'jointrade'|'stats'|'achievements'|'friendadd'|'friendremove'|'friendrequestaccept'|'friendrequestignore'
export function activateGameOverlayToUser(pchDialog: PCHDialogOption, steamID: string): void

//- DLC
export function getDLCCount(): number
export interface DLCData
{
    appId: number
    available: boolean
    name: string
}
export function getDLCDataByIndex(index: number): DLCData
export function isDLCInstalled(dlc_app_id: number): boolean
export function installDLC(dlc_app_id: number): void
export function uninstallDLC(dlc_app_id: number): void

//- Cloud
export function saveTextToFile(
    file_name: string,
    file_content: string,
    success_callback: () => void,
    error_callback: ErrorCallback): void
export function readTextFromFile(
    file_name: string,
    success_callback: (file_content: string) => void,
    error_callback: ErrorCallback): void
export function deleteFile(
    file_name: string,
    success_callback: () => void,
    error_callback: ErrorCallback): void
export function saveFilesToCloud(
    file_path: string[],
    success_callback: () => void,
    error_callback: ErrorCallback): void
export function isCloudEnabledForUser(): boolean
export function enableCloud(flag: boolean): void
export function getCloudQuota(
    success_callback: (total_bytes: string, available_bytes: string) => void,
    error_callback: ErrorCallback): void
export function getFileCount(): number
export interface FileNameDict
{
    name: string
    size: number
}
export function getFileNameAndSize(index: number): FileNameDict
