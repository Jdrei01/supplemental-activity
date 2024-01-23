const router = require('express').Router();
const { User } = require('./User');


// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userData = await User.create({
      username,
      password,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.username = userData.username;

    const redirectStatus = req.session.logged_in ? 301 : 302;
            res.redirect(redirectStatus, '/');



    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create user' });
  }
});

  // Log in
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userData = await User.findOne({ where: { username } });
    if (!userData) {
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(password);
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.username = userData.username;

    const redirectStatus = req.session.logged_in ? 301 : 302;
            res.redirect(redirectStatus, '/');
            
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to log in' });
  }
});


  // Log out
  router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
  
  module.exports = router;