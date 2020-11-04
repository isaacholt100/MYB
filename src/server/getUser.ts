import { Collection, ObjectId } from "mongodb";
const returnQuery = (user_id: ObjectId, type: "chat" | "class") => [
    {
        $lookup: {
            from: "chats",
            pipeline: [
                { $match: { member_ids: user_id } },
                {
                    "$group": {
                        "_id": 1,
                        "member_ids": { "$addToSet": "$member_ids" }
                    }
                },
                {
                    "$addFields": {
                        "member_ids": {
                            "$reduce": {
                                "input": "$member_ids",
                                "initialValue": [],
                                "in": { "$setUnion": ["$$value", "$$this"] }
                            }
                        }
                    }
                }, {
                    $project: {
                        member_ids: 1,
                        _id: 0,
                    },
                }],
            as: `${type}_members`,
        },
    }, {
        $unwind: {
            path: `$${type}_members`,
            preserveNullAndEmptyArrays: true,
        }
    },
];
export default async (user_id: ObjectId, users: Collection<any>) => await users.aggregate([
    { $match: { _id: user_id } },
    ...returnQuery(user_id, "chat"),
    ...returnQuery(user_id, "class"),
    { $project: {"users": { $setUnion: [{ $ifNull: ["$class_members.member_ids", []] }, { $ifNull: ["$chat_members.member_ids", []] }] }, email: 1, icon: 1, timetable: 1, theme: 1, "name": {
        "$concat": ["$firstName", " ", "$lastName"]
    }, carouselView: 1, admin: 1, /*name: {$concat: ["$firstName", " ", "$lastName"]}*/ } },
    {
        $project: {
            "users": {
                $filter: {
                    input: "$users",
                    as: "id",
                    cond: {
                        $ne: [user_id, "$$id"]
                    },
                }
            }, email: 1, icon: 1, timetable: 1, theme: 1, name: 1, carouselView: 1, admin: 1
        }
    },
    {
        $lookup: {
            from: "classes",
            pipeline: [{ $match: { member_ids: user_id } }],
            as: "classes"
        }
    },
    {
        $lookup: {
            from: "chats",
            pipeline: [{ $match: { member_ids: user_id } }],
            as: "chats"
        }
    },
    {
        $lookup: {
            from: "reminders",
            localField: "_id",
            foreignField: "user_id",
            //pipeline: [{$match: {user_id}}],
            as: "reminders"
        }
    },
    {
        $lookup: {
            from: "books",
            pipeline: [{
                $match: { owner_id: user_id }
            }, {
                $project: { content: 0, comments: 0, }
            }],
            as: "books"
        }
    },
    {
        $lookup: {
            from: "users",
            let: {
                user_ids: "$users",
            },
            pipeline: [{
                $match: {
                    $expr: { $in: ["$_id", "$$user_ids"] }
                },
            },
            { $project: {
                "email": 1,
                "icon": 1,
                "admin": 1,
                "name": {
                    "$concat": ["$firstName", " ", "$lastName"]
                }
            } }
            ],
            as: "users",
        }
    },
]).next();