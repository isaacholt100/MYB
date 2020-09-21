export interface IOptions extends IFetchOptions {
    serverUrl: string;
    accessToken: string;
    refreshToken: string;
    [key: string]: any;
}
export interface IFetchOptions {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    file?: boolean;
    body?: object | BodyInit;
}
export interface IRes {
    type: "errors" | "success" | "failed";
    data: any;
    accessToken?: string;
}
export type Handler = (res: IRes) => void;