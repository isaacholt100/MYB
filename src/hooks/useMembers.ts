import useSWR from "swr";

export default function useMembers() {
    const { data: members, error } = useSWR("/api/members", {
        refreshInterval: 1000,
    });
    console.log(members);
    
    if (error || members?.err || !members) {
        return [];
    }
    return members;
}