const { TravelCompanion, CompanionRequest, ChatRoom } = require('../models');

exports.getPotentialMatches = async (userId) => {
  const userProfiles = await TravelCompanion.find({ userId });
  if (userProfiles.length === 0) return [];

  const otherProfiles = await TravelCompanion.find({ userId: { $ne: userId } }).populate('userId', 'username profileImage');
  const existingRequests = await CompanionRequest.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  });

  const requestedPairSet = new Set();
  existingRequests.forEach(req => {
    requestedPairSet.add(`${req.senderCompanionId}-${req.receiverCompanionId}`);
    requestedPairSet.add(`${req.receiverCompanionId}-${req.senderCompanionId}`);
  });

  let potentialMatches = [];

  for (const myProfile of userProfiles) {
    for (const otherProfile of otherProfiles) {
      if (requestedPairSet.has(`${myProfile._id}-${otherProfile._id}`)) continue;

      const matchScore = calculateMatchScore(myProfile, otherProfile);
      if (matchScore > 0) {
        potentialMatches.push({
          myProfileId: myProfile._id,
          companionProfile: {
            id: otherProfile._id,
            userId: otherProfile.userId?._id,
            username: otherProfile.userId?.username,
            destinationName: otherProfile.destinationName,
            travelDates: otherProfile.travelDates,
            interests: otherProfile.interests,
            bio: otherProfile.bio,
            budgetMin: otherProfile.budgetMin,
            budgetMax: otherProfile.budgetMax
          },
          matchScore
        });
      }
    }
  }

  return potentialMatches.sort((a, b) => b.matchScore - a.matchScore);
};

exports.sendRequest = async (senderId, myCompanionId, receiverCompanionId, message) => {
  const receiverProfile = await TravelCompanion.findById(receiverCompanionId);
  if (!receiverProfile) throw new Error('Companion profile not found');

  const myProfile = await TravelCompanion.findById(myCompanionId);
  if (!myProfile) throw new Error('Your companion profile not found');

  const existingRequest = await CompanionRequest.findOne({
    $or: [
      { senderId, receiverId: receiverProfile.userId },
      { senderId: receiverProfile.userId, receiverId: senderId }
    ],
    status: { $ne: 'REJECTED' }
  });

  if (existingRequest) {
    throw new Error('A request already exists between you and this user');
  }

  const matchScore = calculateMatchScore(myProfile, receiverProfile);

  const request = new CompanionRequest({
    senderId,
    receiverId: receiverProfile.userId,
    senderCompanionId: myCompanionId,
    receiverCompanionId,
    message,
    matchScore,
    status: 'PENDING'
  });

  await request.save();
  return request;
};

exports.getRequests = async (userId) => {
  return await CompanionRequest.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  })
  .populate('senderId', 'username')
  .populate('receiverId', 'username')
  .populate('senderCompanionId')
  .populate('receiverCompanionId')
  .sort({ createdAt: -1 });
};

exports.acceptRequest = async (requestId, userId) => {
  const request = await CompanionRequest.findById(requestId);
  if (!request) throw new Error('Request not found');
  if (request.receiverId.toString() !== userId.toString()) {
    throw new Error('Unauthorized');
  }

  request.status = 'ACCEPTED';
  await request.save();

  const chatRoom = new ChatRoom({
    participants: [request.senderId, request.receiverId],
    companionRequestId: request._id
  });
  await chatRoom.save();

  return request;
};

exports.rejectRequest = async (requestId, userId) => {
  const request = await CompanionRequest.findById(requestId);
  if (!request) throw new Error('Request not found');
  if (request.receiverId.toString() !== userId.toString()) {
    throw new Error('Unauthorized');
  }

  request.status = 'REJECTED';
  await request.save();
  return request;
};

exports.getAcceptedMatches = async (userId) => {
  return await CompanionRequest.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
    status: 'ACCEPTED'
  })
  .populate('senderId', 'username')
  .populate('receiverId', 'username')
  .populate('senderCompanionId')
  .populate('receiverCompanionId');
};

function calculateMatchScore(profile1, profile2) {
  let score = 0;

  if (profile1.destinationName.toLowerCase() === profile2.destinationName.toLowerCase()) {
    score += 40;
  } else if (profile1.destinationName.toLowerCase().includes(profile2.destinationName.toLowerCase()) || 
             profile2.destinationName.toLowerCase().includes(profile1.destinationName.toLowerCase())) {
    score += 20;
  }

  const overlap = Math.max(0, Math.min(profile1.budgetMax, profile2.budgetMax) - Math.max(profile1.budgetMin, profile2.budgetMin));
  if (overlap > 0) {
    score += 20;
  }

  if (profile1.travelDates && profile2.travelDates) {
    if (profile1.travelDates.toLowerCase() === profile2.travelDates.toLowerCase()) {
      score += 20;
    } else if (profile1.travelDates.toLowerCase().includes(profile2.travelDates.toLowerCase().split(' ')[0])) {
      score += 10;
    }
  }

  const interests1 = (profile1.interests || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const interests2 = (profile2.interests || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (interests1.length > 0 && interests2.length > 0) {
    const intersection = interests1.filter(i => interests2.includes(i));
    const union = [...new Set([...interests1, ...interests2])];
    score += (intersection.length / union.length) * 20;
  }

  return Math.round(score);
}
