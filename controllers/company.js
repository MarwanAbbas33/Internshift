const router = require("express").Router();
const Company = require("../models/Company");
const verify = require("../middlewares/verifyToken");


router.put("/edit", verify.companyVerification, async (req, res) => {
  const company = await Company.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      location: req.body.location,
      phone: req.body.phone,
      email: req.body.email,
    },
    { new: true }
  );
  if (!company) return res.sendStatus(400);
  res.sendStatus(200);
});

router.put('/password', verify.studentVerification, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const student = await Student.findByIdAndUpdate(req.user._id,{password: hashedPassword},{new: true});
  res.send(student).status(200);
})

module.exports = router;
