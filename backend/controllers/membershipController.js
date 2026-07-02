const User = require('../models/User');

const upgradeMembership = async (req, res) => {
  try {
    const { plan } = req.body; // 'Starter', 'Pro', 'Elite'
    if (!plan || !['Starter', 'Pro', 'Elite'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid membership plan selected' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save previous membership to history if it changed
    if (user.membershipType !== plan) {
      user.membershipHistory.push({
        previousPlan: user.membershipType || 'Starter',
        newPlan: plan,
        changedAt: new Date()
      });
    }

    user.membershipType = plan;
    user.membershipStatus = 'Active';
    user.membershipStartDate = new Date();
    // Expiry after 1 month for Pro/Elite, null for Starter
    user.membershipEndDate = plan === 'Starter' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await user.save();

    console.log(`💳 Membership Updated: User: ${user.name} (${user.email}) upgraded to ${plan} inside zenfit.users`);

    res.status(200).json({
      message: `Successfully upgraded to ${plan} membership plan`,
      user: {
        membershipType: user.membershipType,
        membershipStatus: user.membershipStatus,
        membershipStartDate: user.membershipStartDate,
        membershipEndDate: user.membershipEndDate,
        membershipHistory: user.membershipHistory,
        streak: user.streak,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        level: user.level,
        xp: user.xp,
        xpToNextLevel: user.xpToNextLevel,
        badges: user.badges
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upgradeMembership
};
