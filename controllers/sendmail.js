const nodemailer = require("nodemailer");
let router = require("express").Router();

router.all("/api/sendmail", async function (req, res) {
  const main = async () => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER || "yunsik.kim@rsinteractive.co.kr",
        pass: process.env.NODEMAILER_PASS || "zz9573777!",
      },
    });
    // send mail with defined transport object req.body.to_email
    let info = await transporter.sendMail({
      from: `<${process.env.NODEMAILER_USER}>`,
      to: "dbstlr260@naver.com, yunsik.kim@rsinteractive.co.kr",
      subject: req.body.subject,
      text: req.body.email_message,
      // attachments: [
      //   {
      //     filename: "dtetest.png",
      //     Path: "C:/Users/pc/Desktop/이미지테스트/dtetest.png",
      //     // filePath: "C:/Users/pc/Desktop/이미지테스트/dte이미지테스트.png",
      //     // contentType: "application/png",
      //   },
      // ],
      // html: `<b>${generatedAuthNumber}</b>`,
    });
    console.log("Message sent: %s", info.messageId);
    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Sent Auth Email",
    });
  };
  main().catch(console.error);
});

module.exports = router;
