const Post = require("../models/Post");
const Company = require("../models/Company");
const Internship = require("../models/Internship");
const router = require("express").Router();
const verify = require("../middlewares/verifyToken");
const {
  newPostValidation,
  editPostValidation,
} = require("../middlewares/validation");

router.post("/find", async (req, res) => {

  const searchRegex = new RegExp(req.body.title, 'i');

  const post = await Post.find({$or: [{
    title: searchRegex,},
    {description: searchRegex}],

  }).and({location: req.body.location});
  res.send(post);
});

router.post("/new", verify.companyVerification, async (req, res) => {
  const validation = newPostValidation(req.body);

  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  } else {
    const company = await Company.findById(req.user._id);
    if (!company) return res.sendStatus(401);

    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      location: company.location,
      publisher: company.name,
      phone: company.phone,
      email: company.email,
      companyId: company._id,
    });

    try {
      await post.save();
      res.send(post);
    } catch (e) {
      res.status(400).send(e);
    }
  }
});

router.get("/postsByCompany", verify.companyVerification, async (req, res) => {
  const companiesPosts = await Post.find({ companyId: req.user._id });
  if (companiesPosts.length === 0)
    return res.status(400).send("no posts posted yet");
  res.status(200).send(companiesPosts);
});

router.get("/all", async (req, res) => {
  res.send(await Post.find({}));
});

router.get("/internship", verify.studentVerification, async (req, res) => {
  const internships = await Internship.find({ studentId: req.user._id });
  if (internships.length === 0)
    return res.status(400).send("no accepted internships yet");

    var post = [];
    
    for (let i = 0; i < internships.length; i++) {
      const internship = internships[i];
      internship.post = await Post.findOne({ _id: internship.postId });

      post.push(internship.post)
    }
    res.status(200).send(post);

  
});

router.put("/edit", verify.companyVerification, async (req, res) => {
  const validation = editPostValidation(req.body);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  } else {
    const title = req.body.title;
    const description = req.body.description;

    if (title && description) {
      const post = await Post.findOneAndUpdate(
        { _id: req.body.postId, companyId: req.user._id },
        { title: title, description: description }
      );
      res.status(200).send(post);
    } else if (title && !description) {
      const post = await Post.findByIdAndUpdate(req.body.postId, {
        title: title,
      });
      res.status(200).send(post);
    } else if (!title && description) {
      const post = await Post.findByIdAndUpdate(req.body.postId, {
        description: description,
      });
      res.status(200).send(post);
    } else {
      res.sendStatus(400);
    }
  }
});

module.exports = router;
