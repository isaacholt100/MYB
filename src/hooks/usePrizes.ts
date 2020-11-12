import useSWR from "swr";

export interface IPoll {
    user_id: string;
    _id: string;
    votes: [string, string, string];
}
export interface IPrize {
    _id: string;
    name: string;
    owner_id: string;
    accepted: boolean;
    poll: IPoll[];
    icon: string;
}
export default function usePrizes(): [IPrize[], boolean] {
    const { data, error } = useSWR("/api/prizes", {
        refreshInterval: 1000,
    });
    if (error || data?.err || !data) {
        return [[], true];
    }
    return [data, false];
}