let router = require("express").Router();

//레미콘
router.use(require("./remicon"));
router.use(require("./remicon_member"));
router.use(require("./remicon_transaction_management"));

//건설사
router.use(require("./construction"));
router.use(require("./construction_member"));
router.use(require("./construction_transaction_management"));

// FAQ
router.use(require("./faq"));

//공지사항
router.use(require("./posts"));

// 1:1문의
router.use(require("./questions"));

// 관리자 회원
router.use(require("./admin_member"));

module.exports = router;
