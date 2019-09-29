const requireSuperAdmin = (req, res, next) => {
  try {
    const { admin } = req;
    if (!admin) {
      throw new Error("Invalid credential");
    }
    if (admin.role !== 1) {
      throw new Error("No permission for this operation. Super admin required");
    }
    next();
  } catch (e) {
    res.status(401).send({
      message: e.message
    });
  }
};

module.exports = {
  requireSuperAdmin
};
