import useSWR from "swr";

export default function useMembers() {
    const { data: members, error } = useSWR("/api/members", {
        refreshInterval: 1000,
    });
    if (error || members?.err || !members) {
        return [];
    }
    return members;
}