export const setUser = (user: any) => {
    localStorage.setItem("real-nset", JSON.stringify(user));
};

export const getUser = () => {
    return (
        typeof localStorage !== "undefined" &&
        JSON.parse(localStorage.getItem("real-nset")!)
    );
};