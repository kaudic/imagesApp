module.exports = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (err) {
        const error = new Error(err.message);
        console.log('handler!: ' + err);
        next(error);
    }
};