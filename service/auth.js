const jwt = require("jsonwebtoken"); 
const secret = "piyush$123@$"; 

function setUser( user){
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role, 
    }, secret);
}
function getUser(token) {
    if (!token) return null;
  try {
    const user = jwt.verify(token, secret);
    return user; // Return the user object instead of just the payload
  } catch (err) {
    console.error("JWT verification error:", err.message);
    console.log(token);
    return null;
  }
}
      

module.exports = {setUser, getUser}
