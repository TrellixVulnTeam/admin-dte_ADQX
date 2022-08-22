let router = require("express").Router();

router.use(require("./staff"));
router.use(require("./list"));
router.use(require("./construction_member"));

module.exports = router;
