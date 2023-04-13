export default function handler(req, res) {
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  res
    .status(200)
    .json({
      ipv4: req?.headers?.["x-forwarded-for"],
      ipv6: req?.socket?.remoteAddress,
    });
}
