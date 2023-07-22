// Import the getUser function from your service/auth module
const { getUser } = require('../service/auth');

async function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if (!tokenCookie) return next();

  try {
    const user = await getUser(tokenCookie);
    if (user) {
      req.user = user;
      console.log("Authentication done. User:", user);
    } else {
      console.log("Authentication failed. User not found.");
    }

    return next();
  } catch (err) {
    console.error("Error during authentication:", err);
    return res.redirect('/login');
  }
}

const restrictTo = (roles) => (req, res, next) => {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "Unauthorized." });
      }
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Access forbidden." });
      }
      next();
    };

module.exports = {checkForAuthentication, restrictTo};


