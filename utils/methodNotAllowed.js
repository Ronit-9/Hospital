export const methodNotAllowed = (req, res) => {
  return res.status(405).json({
    success: false,
    message: `Method ${req.method} not allowed on ${req.originalUrl}`,
  })
}