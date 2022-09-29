let router = require("express").Router();
const cors = require("cors");

//cors
router.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션. true 를 써도 된다.
  })
);

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

//단가표
router.use(require("./prices_list"));

//배너
router.use(require("./banners"));

//이메일
router.use(require("./sendmail"));

//건자재업체 리스트
router.use(require("./material_lists"));

module.exports = router;
