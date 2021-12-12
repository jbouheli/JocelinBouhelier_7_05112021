const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  if (req.user != null)
        return next();

  if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')
        && req.headers.authorization.split(' ')[0] === 'Bearer' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
        let token = req.headers.authorization.split(' ')[1]
        try {
          const validToken = verify(token, process.env.JWT_SECRET);
          req.user = validToken;
          
          if (!validToken) {
            return res.status(401).json({ error: "action restrint , veuillez vous authentifiez" });
          }

          return next();
        } catch (err) {
          return res.status(401).json({ error: "action restrint , veuillez vous authentifiez" });
        }
  } else {
        return next();
  }

};

module.exports = { validateToken };