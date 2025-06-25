// import Blacklist from '../models/blacklistModel'; // or wherever your model is

// const cleanupExpiredTokens = async () => {
//   const now = new Date();
//   try {
//     await Blacklist.deleteMany({ expiresAt: { $lt: now } });
//     console.log('Expired tokens cleaned up at', now);
//   } catch (error) {
//     console.error('Error during token cleanup:', error);
//   }
// };

// export const startTokenCleanupJob = () => {
//   // Run once every hour (3600000 ms)
//   setInterval(cleanupExpiredTokens, 3600000);
// };
