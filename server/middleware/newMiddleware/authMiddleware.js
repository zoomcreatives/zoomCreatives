// const JWT = require ('jsonwebtoken');
// const authModel = require('../../models/newModel/authModel');


// exports.requireLogin = async (req, res, next)=>{

//     const token = req.header('Authorization');

//     if(!token){
//         return res.status(401).json({success: false, message: 'Unauthorized : Login First'})
//     }

//     try {
//         const decoded = JWT.verify(token.replace("Bearer", "") ,process.env.SECRET_KEY);
//         req.user = decoded;
//         next();
       
//     } catch (error) {
//         return res.status(401).json({success: false, message: 'Unauthorized : Invalid Token'})
        
//     }
// }


// // *********************ISADMIN*******************************
// exports.isAdmin = async (req, res, next) => {
//     try {
//         const user = await authModel.findById(req.user._id);
//         if (!user || user.role !== 'admin') {
//             return res.status(401).json({ success: false, message: 'You don\'t have permission to access this resource.' });
//         }
//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: 'Unauthorized Access. Please log in and try again!' });
//     }
// };








const JWT = require('jsonwebtoken');
const authModel = require('../../models/newModel/authModel');

exports.requireLogin = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Login First' });
  }

  try {
    // Remove "Bearer" and trim whitespace
    const decoded = JWT.verify(token.replace("Bearer ", "").trim(), process.env.SECRET_KEY);

    req.user = decoded; // Attach user payload to req
    next(); // Proceed to next middleware
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Token' });
  }
};







exports.isAdmin = async (req, res, next) => {
    try {
      const user = await authModel.findById(req.user._id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
      }
      next();
    } catch (error) {
      console.error('Admin Check Error:', error.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  