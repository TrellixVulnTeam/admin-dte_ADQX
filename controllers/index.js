let router = require("express").Router();

//레미콘
router.use(require("./remicon"));
router.use(require("./remicon_member"));
router.use(require("./remicon_transaction_management"));

//건설사
router.use(require("./construction"));
router.use(require("./construction_member"));
router.use(require("./construction_transaction_management"));


router.use(require("./faq"));

//공지사항
router.use(require("./posts"));


module.exports = router;
