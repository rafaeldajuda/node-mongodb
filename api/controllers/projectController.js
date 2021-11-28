const Router = require('express').Router;
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
    res.status(200).json({ ok: true });
});

module.exports = app => {
    app.use('/projects', router);
}