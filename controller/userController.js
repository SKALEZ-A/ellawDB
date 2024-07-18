const User = require('../models/user');

const User = require('../models/user');


exports.registerUser = async (req, res) => {
  try {
    const { userId, inviterUsername, username } = req.body;

    console.log(`Registering user: ${username} with inviter: ${inviterUsername}`); // Log for debugging

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = new User({
      userId,
      inviterUsername,
      username,
    });

    if (inviterUsername) {
      const inviter = await User.findOne({ username: inviterUsername });
      if (inviter) {
        inviter.referralBalance += 100;
        inviter.invitedUsers.push(newUser._id);
        await inviter.save();
        console.log(`Updated inviter: ${inviterUsername} with new invitee: ${username}`); // Log for debugging
      } else {
        console.log(`Inviter not found: ${inviterUsername}`); // Log if inviter not found
      }
    }

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

exports.getInvitedUsers = async (req, res) => {
  try {
    const { username } = req.params;
    const inviter = await User.findOne({ username }).populate('invitedUsers');
    if (!inviter) {
      return res.status(404).json({ message: 'Inviter not found' });
    }

    res.status(200).json(inviter.invitedUsers);
  } catch (error) {
    console.error('Error getting invited users:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Fetching user by username:", username);

    const user = await User.findOne({ username }).populate('invitedUsers');
    if (!user) {
      console.log("User not found:", username);
      const newUser = new User({ username, userId: username });
      await newUser.save();
      return res.status(201).json(newUser);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user by username:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};





exports.updateUserScore = async (req, res) => {
  try {
    const { username, score } = req.body;
    console.log("Update score request received:", { username, score });

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ message: 'User not found' });
    }

    user.gameBalance += score;
    await user.save();
    console.log("User score updated successfully:", user);

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user score:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Delete user request received:", { username });

    const user = await User.findOneAndDelete({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User deleted successfully:", user);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};
