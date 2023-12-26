const jwt = require('jsonwebtoken')

const dateFormatter = (date) => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour:'numeric',
        minute: 'numeric'
      });
      const formattedDate = formatter.format(date);
      console.log(formattedDate);
      return formattedDate
}

const verifyAccessToken = (req, res, next) => {
    const accessToken = req.body.accessToken || req.query.accessToken || req.headers["x-access-token"];
    // const refreshToken = req.body.refreshToken || req.params.refreshToken || req.headers["x-refresh-token"];
    console.log('token  ', accessToken);
    if(!accessToken) {
        res.status(403).json({data:[], err:"Token not found"})
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.SECRET_ACCESS_KEY)
        req.user = decoded
    } catch (err) {
        // token is invalid
    //    verifyRefressToken(refreshToken, res, next);
        // return res.status(401).json({data:[], err:"Invalid Token"});
        return res.status(401).send("Invalid Token");
      }
      return next();
}

const verifyRefressToken = (refreshToken, res, next) => {
    if(!refreshToken) {
        res.status(403).json({data:[], err:"Refresh Token not found"})
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY)
        req.user = decoded
    } catch (err) {
        return res.status(401).json({data:[], err:"Invalid Token"});
      }
      return next();
}


module.exports = {
    dateFormatter, verifyAccessToken
}