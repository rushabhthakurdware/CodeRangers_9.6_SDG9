export const loadServerIp = async () => {
    console.log("Mock: Loading server IP (Returning default)");
    return "192.168.1.1";
};

export const saveServerIp = async (ip: string) => {
    console.log("Mock: Saving server IP:", ip);
};
