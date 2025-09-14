import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.header.authorization;
  if (!authHeader?.startWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);
    req.user = decode;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token Invalid" });
  }
};
