import { Types } from 'mongoose';

export function officeMonthlyAggregate(id: any, fromDate: string, toDate: string) {
    return [
        {
            "$lookup": {
                "from": "users",
                "localField": "creatorId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$unwind": {
                "path": "$user"
            }
        },
        {
            "$addFields": {
                "formattedDate": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$createdAt"
                    }
                }
            }
        },
        {
            "$match": {
                "user.officeId": new Types.ObjectId(id),
                $and: [
                    { createdAt: { $gte: new Date(fromDate) } },
                    { createdAt: { $lte: new Date(toDate) } },
                ]
            }
        },
        {
            "$group": {
                "_id": "$formattedDate",
                "total": {
                    "$sum": "$total"
                },
                "numberOfRecepits": {
                    "$sum": 1.0
                }
            }
        },
        {
            "$group": {
                "_id": null,
                "total": {
                    "$sum": "$total"
                },
                "daysData": {
                    "$push": "$$ROOT"
                }
            }
        }
    ] as any;
}

export function userMonthlyAggregate(id: any, fromDate: string, toDate: string) {
    return [
        {
            "$lookup": {
                "from": "users",
                "localField": "creatorId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$unwind": {
                "path": "$user"
            }
        },
        {
            "$addFields": {
                "formattedDate": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$createdAt"
                    }
                }
            }
        },
        {
            "$match": {
                "user.officeId": new Types.ObjectId(id),
                $and: [
                    { createdAt: { $gte: new Date(fromDate) } },
                    { createdAt: { $lte: new Date(toDate) } },
                ]
            }
        },
        {
            "$group": {
                "_id": "$creatorId",
                "total": {
                    "$sum": "$total"
                },
                "operatorName": {
                    "$first": "$user.name"
                },
                "operatorId": {
                    "$first": "$user._id"
                }
            }
        }
    ] as any;
}