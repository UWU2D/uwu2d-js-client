type ClientConfig = {
    input?: {
        types?: string[],
        keyMappings?: [string, string][],
    },
    area: {
        x: number,
        y: number
    }
};

export default ClientConfig;