let router = require("express").Router();

router.use(require("./staff"));
router.use(require("./list"));

module.exports = router;
