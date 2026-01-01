import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sampleUsers = [
  {
    name: "Arjun Kumar",
    email: "arjun.kumar@example.com",
    roll: "CS001",
    password: "password123",
    posts: 45,
    votes: 320,
    feedbacks: 28,
    rank: 1,
    bio: "Python enthusiast and competitive programmer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    isVerified: true,
  },
  {
    name: "Priya Singh",
    email: "priya.singh@example.com",
    roll: "CS002",
    password: "password123",
    posts: 38,
    votes: 290,
    feedbacks: 22,
    rank: 2,
    bio: "Full stack developer with 2 years experience",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    isVerified: true,
  },
  {
    name: "Rajesh Patel",
    email: "rajesh.patel@example.com",
    roll: "CS003",
    password: "password123",
    posts: 52,
    votes: 410,
    feedbacks: 35,
    rank: 3,
    bio: "Backend developer and database expert",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    isVerified: true,
  },
  {
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    roll: "CS004",
    password: "password123",
    posts: 33,
    votes: 250,
    feedbacks: 18,
    rank: 4,
    bio: "React specialist and UI designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
    isVerified: true,
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    roll: "CS005",
    password: "password123",
    posts: 41,
    votes: 380,
    feedbacks: 30,
    rank: 5,
    bio: "DevOps engineer and system architect",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    isVerified: true,
  },
  {
    name: "Anjali Sharma",
    email: "anjali.sharma@example.com",
    roll: "CS006",
    password: "password123",
    posts: 29,
    votes: 210,
    feedbacks: 15,
    rank: 6,
    bio: "Machine learning enthusiast",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
    isVerified: true,
  },
  {
    name: "Aditya Verma",
    email: "aditya.verma@example.com",
    roll: "CS007",
    password: "password123",
    posts: 47,
    votes: 340,
    feedbacks: 26,
    rank: 7,
    bio: "Web3 developer and blockchain expert",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
    isVerified: true,
  },
  {
    name: "Sneha Desai",
    email: "sneha.desai@example.com",
    roll: "CS008",
    password: "password123",
    posts: 36,
    votes: 275,
    feedbacks: 20,
    rank: 8,
    bio: "Mobile app developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    isVerified: true,
  },
  {
    name: "Rohan Bhatt",
    email: "rohan.bhatt@example.com",
    roll: "CS009",
    password: "password123",
    posts: 44,
    votes: 330,
    feedbacks: 25,
    rank: 9,
    bio: "Algorithm and data structure specialist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
    isVerified: true,
  },
  {
    name: "Divya Nair",
    email: "divya.nair@example.com",
    roll: "CS010",
    password: "password123",
    posts: 31,
    votes: 230,
    feedbacks: 17,
    rank: 10,
    bio: "Cloud infrastructure specialist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Divya",
    isVerified: true,
  },
  {
    name: "Harsh Patel",
    email: "harsh.patel@example.com",
    roll: "CS011",
    password: "password123",
    posts: 26,
    votes: 190,
    feedbacks: 14,
    rank: 11,
    bio: "Security and penetration tester",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harsh",
    isVerified: false,
  },
  {
    name: "Tanya Malhotra",
    email: "tanya.malhotra@example.com",
    roll: "CS012",
    password: "password123",
    posts: 39,
    votes: 295,
    feedbacks: 21,
    rank: 12,
    bio: "Frontend architect and design system expert",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanya",
    isVerified: true,
  },
  {
    name: "Sameer Khan",
    email: "sameer.khan@example.com",
    roll: "CS013",
    password: "password123",
    posts: 43,
    votes: 315,
    feedbacks: 23,
    rank: 13,
    bio: "API design and REST architecture specialist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sameer",
    isVerified: true,
  },
  {
    name: "Pooja Singh",
    email: "pooja.singh@example.com",
    roll: "CS014",
    password: "password123",
    posts: 35,
    votes: 265,
    feedbacks: 19,
    rank: 14,
    bio: "Database optimization expert",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja",
    isVerified: true,
  },
  {
    name: "Nikhil Reddy",
    email: "nikhil.reddy@example.com",
    roll: "CS015",
    password: "password123",
    posts: 28,
    votes: 205,
    feedbacks: 16,
    rank: 15,
    bio: "Software architect and system designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nikhil",
    isVerified: true,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing users (optional - remove this line if you want to preserve existing data)
    console.log("🗑️  Clearing existing users...");
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing users`);

    // Hash passwords and insert users
    console.log("🌱 Seeding database with sample users...");
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcryptjs.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    const insertedUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Successfully inserted ${insertedUsers.length} users`);

    // Display summary
    console.log("\n📊 Database Seeding Summary:");
    console.log("━".repeat(50));
    insertedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.roll}) - ${user.posts} posts, ${user.votes} votes`);
    });
    console.log("━".repeat(50));

    // Get some statistics
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const totalVotes = await User.aggregate([{ $group: { _id: null, total: { $sum: "$votes" } } }]);
    const totalPosts = await User.aggregate([{ $group: { _id: null, total: { $sum: "$posts" } } }]);

    console.log("\n📈 Database Statistics:");
    console.log("━".repeat(50));
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Verified Users: ${verifiedUsers}`);
    console.log(`Total Votes: ${totalVotes[0]?.total || 0}`);
    console.log(`Total Posts: ${totalPosts[0]?.total || 0}`);
    console.log("━".repeat(50));

    console.log("\n✨ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
