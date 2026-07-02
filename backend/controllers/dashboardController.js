const DashboardService = require('../services/DashboardService');

const getDashboard = async (req, res) => {
  try {
    const data = await DashboardService.getDashboardData(req.user.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboard
};
