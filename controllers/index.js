let router = require("express").Router();

router.use(require("./staff"));
router.use(require("./remicon"));
router.use(require("./remicon_list"));
router.use(require("./construction"));
router.use(require("./construction_member"));
router.use(require("./construction_member2"));
router.use(require("./construction_transaction_ management"));
module.exports = router;
