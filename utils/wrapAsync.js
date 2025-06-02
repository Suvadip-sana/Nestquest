module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); //Since 'fn' is an asyncronous function so it return a promish
    };
};