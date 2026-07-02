export const setUser = (user: null) => {
    localStorage.setItem("real-nset", JSON.stringify(user));
};

export const getUser = () => {
    return (
        typeof localStorage !== "undefined" &&
        JSON.parse(localStorage.getItem("real-nset")!)
    );
};