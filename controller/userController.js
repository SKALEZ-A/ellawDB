const User = require('../models/user');

exports.registerUser = async (req, res) => {
  try {
    const { userId, inviterUsername, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(200).json(existingUser); // Return existing user if found
    }

    // Create new user
    const newUser = new User({
      userId,
      inviterUsername,
      username,
    });

    // If there is an inviter, update the inviter's referral balance and invited users list
    if (inviterUsername) {
      const inviter = await User.findOne({ username: inviterUsername });
      if (inviter) {
        inviter.referralBalance += 100;
        inviter.invitedUsers.push(newUser._id);
        await inviter.save();
      }
    }

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};


exports.updateUserScore = async (req, res) => {
  try {
    const { username, score } = req.body;
    console.log("Update score request received:", { username, score }); // Debug log

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username); // Debug log
      return res.status(404).json({ message: 'User not found' });
    }

    user.gameBalance += score;
    await user.save();
    console.log("User score updated successfully:", user); // Debug log

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user score:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Fetching user by username:", username); // Debug log

    const user = await User.findOne({ username }).populate('invitedUsers');
    if (!user) {
      console.log("User not found:", username); // Debug log
      // Automatically register the user if not found
      const newUser = new User({ username, userId: username }); // Assuming userId is the same as username
      await newUser.save();
      return res.status(201).json(newUser);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user by username:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

exports.getInvitedUsers = async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Fetching invited users for username:", username); // Debug log

    const inviter = await User.findOne({ username }).populate('invitedUsers');
    if (!inviter) {
      console.log("Inviter not found:", username); // Debug log
      return res.status(404).json({ message: 'Inviter not found' });
    }

    res.status(200).json(inviter.invitedUsers);
  } catch (error) {
    console.error('Error getting invited users:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username'); // Fetch only the usernames
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error.message);
    res.status(500).json({ error: error.message });
  }
};
