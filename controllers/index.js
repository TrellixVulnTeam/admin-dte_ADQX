let router = require('express').Router();

router.use(require('./checkbox'));
router.use(require('./compoundKey'));
router.use(require('./dates'));
router.use(require('./datetime'));
router.use(require('./join'));
router.use(require('./joinArray'));
router.use(require('./joinLinkTable'));
router.use(require('./joinSelf'));
router.use(require('./jsonId'));
router.use(require('./rest'));
router.use(require('./sequence'));
router.use(require('./softDelete'));
router.use(require('./sites'));
router.use(require('./staff'));
router.use(require('./staff-html'));
router.use(require('./staff-view'));
router.use(require('./standalone'));
router.use(require('./tableOnlyData'));
router.use(require('./time'));
router.use(require('./todo'));
router.use(require('./upload-many'));
router.use(require('./upload'));
router.use(require('./users'));
router.use(require('./searchPanes'));

module.exports = router;
