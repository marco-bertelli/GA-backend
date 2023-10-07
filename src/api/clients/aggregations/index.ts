export const clientAggregate = (query: any) => {
    return [
        {
            "$match" : {
                ...query,
            }
        }, 
        {
            "$addFields" : {
                "lowerCaseName" : {
                    "$toLower" : "$name"
                }
            }
        }, 
        {
            "$sort" : {
                "lowerCaseName" : 1.0
            }
        }
    ] as any;
}