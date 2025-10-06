export const cookies = {
    getOptions: () => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, 
    }),

    set: (res, name, value, options = {}) => {
        const opts = { ...cookies.getOptions(), ...options };
        res.cookie(name, value, opts);
    },  

    clear: (res, name, options = {}) => {
        res.clearCookie(name, { ...cookies.getOptions(), ...options });
    },

    get: (req, name) => {
        return req.cookies[name];
    }
};