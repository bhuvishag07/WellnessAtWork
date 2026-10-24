import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Challenge from '../src/models/Challenge.js';
import UserChallenge from '../src/models/UserChallenge.js';
import Team from '../src/models/Team.js';
import ActivityLog from '../src/models/ActivityLog.js';
import PointTransaction from '../src/models/PointTransaction.js';
import Reward from '../src/models/Reward.js';
import RewardLedger from '../src/models/RewardLedger.js';
import SessionBooking from '../src/models/SessionBooking.js';
import WellnessResource from '../src/models/WellnessResource.js';
import Notification from '../src/models/Notification.js';
import MentalHealthCheckIn from '../src/models/MentalHealthCheckIn.js';
import Webinar from '../src/models/Webinar.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wellnessatwork';
const databaseName = decodeURIComponent(new URL(uri).pathname.replace(/^\//, ''));
const isDisposableDatabase = /(^|[_-])(test|dev|local)([_-]|$)/i.test(databaseName);
const seedPasswords = {
  employee: process.env.SEED_EMPLOYEE_PASSWORD,
  admin: process.env.SEED_ADMIN_PASSWORD,
  colleague: process.env.SEED_COLLEAGUE_PASSWORD
};

const seedDatabase = async () => {
  try {
    if (!isDisposableDatabase && process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
      throw new Error('Refusing to clear collections in a database not named as test, dev, or local.');
    }
    if (Object.values(seedPasswords).some((password) => !password || password.length < 12)) {
      throw new Error('Set SEED_EMPLOYEE_PASSWORD, SEED_ADMIN_PASSWORD, and SEED_COLLEAGUE_PASSWORD (12+ characters each).');
    }

    await mongoose.connect(uri);
    console.log(`[Seed] Connected to MongoDB database: ${mongoose.connection.name}`);

    // Clean existing data for clean idempotent seed
    console.log('[Seed] Clearing previous collections...');
    await Promise.all([
      User.deleteMany({}),
      Challenge.deleteMany({}),
      UserChallenge.deleteMany({}),
      Team.deleteMany({}),
      ActivityLog.deleteMany({}),
      PointTransaction.deleteMany({}),
      Reward.deleteMany({}),
      RewardLedger.deleteMany({}),
      SessionBooking.deleteMany({}),
      WellnessResource.deleteMany({}),
      Notification.deleteMany({}),
      MentalHealthCheckIn.deleteMany({}),
      Webinar.deleteMany({})
    ]);

    console.log('[Seed] Inserting users...');
    const employeePasswordHash = await User.hashPassword(seedPasswords.employee);
    const adminPasswordHash = await User.hashPassword(seedPasswords.admin);
    const colleaguePasswordHash = await User.hashPassword(seedPasswords.colleague);

    // 1. Admin
    const admin = await User.create({
      fullName: 'HR Administration',
      email: 'admin.hr@company.com',
      passwordHash: adminPasswordHash,
      department: 'Human Resources',
      role: 'admin',
      totalPoints: 1080,
      tier: 'Gold Elite',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    });

    // 2. Primary Employee (Bhuvisha)
    const bhuvisha = await User.create({
      fullName: 'Bhuvisha Manish Gohil',
      email: 'bhuvisha.gohil@company.com',
      passwordHash: employeePasswordHash,
      department: 'Engineering (Frontend)',
      role: 'employee',
      totalPoints: 850,
      streakDays: 14,
      tier: 'Silver Pioneer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      notificationPreferences: {
        challengeAlerts: true,
        sessionReminders: true,
        rewardUpdates: true,
        emailWeeklyDigest: true,
        leaderboardAlerts: true
      },
      privacySettings: {
        leaderboardVisibility: true,
        shareStepCounts: true,
        counselingConfidentialityFence: true,
        activityFeedVisibility: 'colleagues'
      }
    });

    // 3. Colleagues for realistic Leaderboard & Teams
    const colleaguesData = [
      { name: 'Priya Sharma', email: 'priya.sharma@company.com', department: 'Product Design', points: 1420, streak: 28, tier: 'Grandmaster Champion', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      { name: 'Arjun Mehta', email: 'arjun.mehta@company.com', department: 'Product Ops', points: 1280, streak: 22, tier: 'Gold Elite', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { name: 'Sneha Kapoor', email: 'sneha.kapoor@company.com', department: 'Engineering', points: 1190, streak: 19, tier: 'Gold Elite', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
      { name: 'Devansh Nair', email: 'devansh.nair@company.com', department: 'Marketing', points: 1120, streak: 17, tier: 'Gold Elite', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
      { name: 'Ritika Roy', email: 'ritika.roy@company.com', department: 'Human Resources', points: 1080, streak: 16, tier: 'Gold Elite', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
      { name: 'Kabir Sengupta', email: 'kabir.sengupta@company.com', department: 'Engineering', points: 1040, streak: 15, tier: 'Gold Elite', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
      { name: 'Ananya Iyer', email: 'ananya.iyer@company.com', department: 'Finance', points: 980, streak: 14, tier: 'Silver Pioneer', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
      { name: 'Vikram Malhotra', email: 'vikram.malhotra@company.com', department: 'Sales', points: 950, streak: 15, tier: 'Silver Pioneer', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },
      { name: 'Tanvi Deshmukh', email: 'tanvi.deshmukh@company.com', department: 'Product Design', points: 920, streak: 12, tier: 'Silver Pioneer', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' },
      { name: 'Rohan Varma', email: 'rohan.varma@company.com', department: 'Engineering', points: 890, streak: 13, tier: 'Silver Pioneer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
      { name: 'Megha Joshi', email: 'megha.joshi@company.com', department: 'Legal', points: 870, streak: 14, tier: 'Silver Pioneer', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80' },
      { name: 'Siddharth Jain', email: 'siddharth.jain@company.com', department: 'Product', points: 820, streak: 11, tier: 'Silver Pioneer', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' },
      { name: 'Pooja Hegde', email: 'pooja.hegde@company.com', department: 'Marketing', points: 790, streak: 9, tier: 'Bronze Starter', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80' }
    ];

    const insertedColleagues = [];
    for (const c of colleaguesData) {
      const u = await User.create({
        fullName: c.name,
        email: c.email,
        passwordHash: colleaguePasswordHash,
        department: c.department,
        role: 'employee',
        totalPoints: c.points,
        streakDays: c.streak,
        tier: c.tier,
        avatar: c.avatar
      });
      insertedColleagues.push(u);
    }

    console.log('[Seed] Inserting challenges...');
    const ch1 = await Challenge.create({
      slug: '30-day-walking',
      title: '30-Day Walking Challenge',
      category: 'Steps & Fitness',
      categoryKey: 'steps',
      description: 'Build an active habit by hitting 10,000 brisk steps every day. Improve cardiovascular endurance and combat sedentary screen hours.',
      duration: '30 Days',
      targetGoal: '10,000 steps / day',
      unit: 'steps',
      rewardPoints: 300,
      participantsCount: 142,
      totalDays: 30,
      currentDay: 18,
      startDate: new Date('2026-09-14'),
      endDate: new Date('2026-10-14'),
      status: 'active',
      milestones: [
        { day: 5, label: '5-Day Kickoff', completed: true, points: 50 },
        { day: 10, label: '100k Steps Club', completed: true, points: 75 },
        { day: 18, label: 'Midpoint Momentum', completed: true, points: 75 },
        { day: 25, label: 'Peak Endurance', completed: false, points: 50 },
        { day: 30, label: '30-Day Champion', completed: false, points: 50 }
      ],
      createdBy: admin._id
    });

    const ch2 = await Challenge.create({
      slug: 'mindful-minutes',
      title: 'Daily Meditation Challenge',
      category: 'Mindfulness',
      categoryKey: 'meditation',
      description: 'Decompress between high-intensity sprints with 15 minutes of guided or silent mindfulness to enhance cognitive clarity and calm.',
      duration: '21 Days',
      targetGoal: '15 min / day',
      unit: 'minutes',
      rewardPoints: 250,
      participantsCount: 89,
      totalDays: 21,
      currentDay: 10,
      startDate: new Date('2026-09-22'),
      endDate: new Date('2026-10-13'),
      status: 'active',
      milestones: [
        { day: 7, label: 'Mindful Spark', completed: true, points: 50 },
        { day: 14, label: 'Zen State', completed: false, points: 100 },
        { day: 21, label: 'Habit Master', completed: false, points: 100 }
      ],
      createdBy: admin._id
    });

    const ch3 = await Challenge.create({
      slug: 'hydration-hero',
      title: 'Hydration Hero',
      category: 'Habit & Vitality',
      categoryKey: 'habit',
      description: 'Keep mental fog at bay by drinking at least 2.5 liters of water daily. Log your hydration checkpoints during the workday.',
      duration: '14 Days',
      targetGoal: '2.5 Liters / day',
      unit: 'liters',
      rewardPoints: 150,
      participantsCount: 112,
      totalDays: 14,
      currentDay: 11,
      startDate: new Date('2026-09-21'),
      endDate: new Date('2026-10-05'),
      status: 'active',
      milestones: [
        { day: 5, label: 'Well Hydrated', completed: true, points: 50 },
        { day: 10, label: 'Vital Flow', completed: true, points: 50 },
        { day: 14, label: 'Hero Cleanser', completed: false, points: 50 }
      ],
      createdBy: admin._id
    });

    const ch4 = await Challenge.create({
      slug: 'screen-break-challenge',
      title: 'Screen Break 20-20-20',
      category: 'Micro-Breaks',
      categoryKey: 'habits',
      description: 'Rest your eyes and stretch posture every 90 minutes. Simple 5-minute movement sessions to prevent neck strain and eye fatigue.',
      duration: '10 Days',
      targetGoal: '3 breaks / day',
      unit: 'breaks',
      rewardPoints: 120,
      participantsCount: 67,
      totalDays: 10,
      currentDay: 1,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-11'),
      status: 'available',
      createdBy: admin._id
    });

    const ch5 = await Challenge.create({
      slug: 'desk-yoga-flow',
      title: 'Desk Yoga & Posture Flow',
      category: 'Flexibility',
      categoryKey: 'exercise',
      description: 'Release spinal compression and tight shoulders with 10-minute seated ergonomic yoga routines designed specifically for office desks.',
      duration: '15 Days',
      targetGoal: '10 min / day',
      unit: 'minutes',
      rewardPoints: 180,
      participantsCount: 95,
      totalDays: 15,
      currentDay: 1,
      startDate: new Date('2026-10-05'),
      endDate: new Date('2026-10-20'),
      status: 'available',
      createdBy: admin._id
    });

    const ch6 = await Challenge.create({
      slug: 'digital-sunset',
      title: 'Digital Sunset Sleep Prep',
      category: 'Sleep Hygiene',
      categoryKey: 'mindfulness',
      description: 'Switch off mobile and laptop screens 45 minutes before bedtime to reset circadian melatonin rhythms and enjoy restorative sleep.',
      duration: '7 Days',
      targetGoal: '45 min screen-off',
      unit: 'sessions',
      rewardPoints: 100,
      participantsCount: 53,
      totalDays: 7,
      currentDay: 7,
      startDate: new Date('2026-09-10'),
      endDate: new Date('2026-09-17'),
      status: 'completed',
      createdBy: admin._id
    });

    const ch7 = await Challenge.create({
      slug: 'gratitude-reflections',
      title: 'Daily Gratitude & Mindset Reset',
      category: 'Mindfulness',
      categoryKey: 'mindfulness',
      description: 'Write down 3 specific things you are grateful for each evening to rewire cognitive positivity and lower work-related cortisol.',
      duration: '14 Days',
      targetGoal: '3 reflections / day',
      unit: 'entries',
      rewardPoints: 150,
      participantsCount: 88,
      totalDays: 14,
      currentDay: 1,
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-24'),
      status: 'available',
      createdBy: admin._id
    });

    const ch8 = await Challenge.create({
      slug: 'stair-climbing-pioneer',
      title: 'Stairway to Vitality',
      category: 'Steps & Fitness',
      categoryKey: 'steps',
      description: 'Skip the elevator for up to 3 flights of stairs daily. Boost VO2 max, activate glute stabilizers, and elevate cardiovascular health.',
      duration: '21 Days',
      targetGoal: '6 flights / day',
      unit: 'flights',
      rewardPoints: 220,
      participantsCount: 76,
      totalDays: 21,
      currentDay: 1,
      startDate: new Date('2026-10-08'),
      endDate: new Date('2026-10-29'),
      status: 'available',
      createdBy: admin._id
    });

    console.log('[Seed] Enrolling Bhuvisha into challenges...');
    await UserChallenge.create([
      { userId: bhuvisha._id, challengeId: ch1._id, currentProgress: 64, completed: false, joinedAt: new Date('2026-09-14') },
      { userId: bhuvisha._id, challengeId: ch2._id, currentProgress: 48, completed: false, joinedAt: new Date('2026-09-22') },
      { userId: bhuvisha._id, challengeId: ch3._id, currentProgress: 75, completed: false, joinedAt: new Date('2026-09-21') },
      { userId: bhuvisha._id, challengeId: ch6._id, currentProgress: 100, completed: true, completedAt: new Date('2026-09-17') }
    ]);

    console.log('[Seed] Creating Teams...');
    const teamEng = await Team.create({
      name: 'Engineering Sprint Racers',
      department: 'Engineering',
      description: 'Daily 10k steps and coding ergonomics',
      totalPoints: 16420,
      members: [
        { userId: bhuvisha._id, role: 'member' },
        { userId: insertedColleagues[2]._id, role: 'leader' },
        { userId: insertedColleagues[5]._id, role: 'member' }
      ]
    });

    const teamDesign = await Team.create({
      name: 'Pixel Pacers & Yogis',
      department: 'Product Design',
      description: 'Mindful breathing and posture realignment',
      totalPoints: 10180,
      members: [
        { userId: insertedColleagues[0]._id, role: 'leader' },
        { userId: insertedColleagues[8]._id, role: 'member' }
      ]
    });

    console.log('[Seed] Inserting activities and point transactions for Bhuvisha...');
    const act1 = await ActivityLog.create({
      userId: bhuvisha._id,
      challengeId: ch1._id,
      challengeTitle: '30-Day Walking Challenge',
      activityType: 'Walking',
      category: 'Fitness',
      value: '10,240',
      numericValue: 10240,
      unit: 'steps',
      durationMinutes: 52,
      pointsEarned: 100,
      source: 'wearable',
      timestamp: new Date()
    });

    const act2 = await ActivityLog.create({
      userId: bhuvisha._id,
      challengeId: ch2._id,
      challengeTitle: 'Daily Meditation Challenge',
      activityType: 'Meditation',
      category: 'Mindfulness',
      value: '15',
      numericValue: 15,
      unit: 'minutes',
      durationMinutes: 15,
      pointsEarned: 40,
      source: 'manual',
      timestamp: new Date(Date.now() - 24 * 3600 * 1000)
    });

    const act3 = await ActivityLog.create({
      userId: bhuvisha._id,
      challengeId: ch3._id,
      challengeTitle: 'Hydration Hero',
      activityType: 'Hydration',
      category: 'Vitality',
      value: '2.8',
      numericValue: 2.8,
      unit: 'liters',
      durationMinutes: 0,
      pointsEarned: 30,
      source: 'manual',
      timestamp: new Date(Date.now() - 28 * 3600 * 1000)
    });

    const act4 = await ActivityLog.create({
      userId: bhuvisha._id,
      challengeId: ch1._id,
      challengeTitle: '30-Day Walking Challenge',
      activityType: 'Walking',
      category: 'Fitness',
      value: '11,100',
      numericValue: 11100,
      unit: 'steps',
      durationMinutes: 58,
      pointsEarned: 100,
      source: 'manual',
      timestamp: new Date(Date.now() - 48 * 3600 * 1000)
    });

    await PointTransaction.create([
      { userId: bhuvisha._id, type: 'earned', points: 100, source: 'activity', description: 'Logged 10,240 steps for 30-Day Walking Challenge', balanceAfter: 850, relatedActivity: act1._id },
      { userId: bhuvisha._id, type: 'earned', points: 40, source: 'activity', description: 'Logged 15 mins for Daily Meditation Challenge', balanceAfter: 750, relatedActivity: act2._id },
      { userId: bhuvisha._id, type: 'earned', points: 30, source: 'activity', description: 'Logged 2.8L for Hydration Hero', balanceAfter: 710, relatedActivity: act3._id },
      { userId: bhuvisha._id, type: 'earned', points: 100, source: 'activity', description: 'Logged 11,100 steps for 30-Day Walking Challenge', balanceAfter: 680, relatedActivity: act4._id },
      { userId: bhuvisha._id, type: 'earned', points: 100, source: 'challenge_completion', description: 'Completed Digital Sunset Sleep Prep Challenge', balanceAfter: 580 }
    ]);

    console.log('[Seed] Inserting Rewards Catalog...');
    const rew1 = await Reward.create({
      title: 'Artisan Coffee Voucher ($15)',
      category: 'Daily Treats',
      pointsCost: 500,
      partner: 'Blue Tokai / Starbucks / Local Cafes',
      description: 'Enjoy your favorite specialty roast, cappuccino, or matcha latte on us.',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=350&q=80',
      active: true
    });

    const rew2 = await Reward.create({
      title: 'Ergonomic Wellness Kit',
      category: 'Workspace Health',
      pointsCost: 750,
      partner: 'ErgoCare Labs',
      description: 'Includes an acupressure mat, memory foam lumbar support cushion, and posture stretch bands.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=350&q=80',
      active: true
    });

    const rew3 = await Reward.create({
      title: 'Premium 1-on-1 Wellness Session',
      category: 'Specialist Care',
      pointsCost: 1000,
      partner: 'MindBody Elite Network',
      description: 'A private 60-minute session with a top executive life coach or master nutritionist.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=350&q=80',
      active: true
    });

    const rew4 = await Reward.create({
      title: 'Quarterly Gym & Fitness Allowance ($100)',
      category: 'Active Lifestyle',
      pointsCost: 1500,
      partner: 'Cult.fit / Equinox / Any Gym',
      description: 'Direct reimbursement towards your monthly gym membership, rock climbing pass, or swimming pool.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=350&q=80',
      active: true
    });

    const rew5 = await Reward.create({
      title: 'Bose Noise-Cancelling Headphones Voucher ($50)',
      category: 'Deep Focus',
      pointsCost: 1200,
      partner: 'Bose / Amazon Corporate Perk',
      description: 'Voucher contribution towards premium active noise-cancelling headphones for deep focus work sessions.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=350&q=80',
      active: true
    });

    const rew6 = await Reward.create({
      title: 'Curated Organic Herbal Tea & Adaptogen Tonic Box',
      category: 'Vitality',
      pointsCost: 600,
      partner: 'Vahdam / Traditional Medicinals',
      description: 'An artisan selection of organic chamomile, ashwagandha, matcha, and peppermint teas designed for all-day wellness.',
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=350&q=80',
      active: true
    });

    console.log('[Seed] Inserting Wellness Sessions...');
    await SessionBooking.create([
      {
        title: '1-on-1 Confidential Counseling',
        category: '1-on-1 Counseling',
        categoryBadge: 'Confidential Care',
        facilitator: 'Dr. Ananya Sen',
        facilitatorTitle: 'Ph.D., Licensed Clinical Psychologist',
        facilitatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        date: 'Tomorrow, Oct 2',
        time: '3:30 PM - 4:15 PM',
        duration: '45 mins',
        mode: 'Private Video Consultation',
        availableSlots: 2,
        maxSlots: 3,
        description: 'Safe, confidential space to discuss workplace anxiety, imposter syndrome, stress burnout, or personal challenges. Never shared with HR.',
        status: 'booked',
        bookedUsers: [{ userId: bhuvisha._id, bookedAt: new Date() }]
      },
      {
        title: 'Yoga & Desk Stretching for Spine & Posture',
        category: 'Yoga / Desk Stretching',
        categoryBadge: 'Ergonomics & Movement',
        facilitator: 'Rohan Patel',
        facilitatorTitle: 'Certified Hatha & Ergonomics Instructor',
        facilitatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        date: 'Friday, Oct 3',
        time: '11:00 AM - 11:30 AM',
        duration: '30 mins',
        mode: 'Live Group Studio Session',
        availableSlots: 14,
        maxSlots: 15,
        description: 'Targeted desk-friendly poses to relieve neck tension, release thoracic stiffness, and re-engage postural core muscles.',
        status: 'booked',
        bookedUsers: [{ userId: bhuvisha._id, bookedAt: new Date() }]
      },
      {
        title: 'Guided Mindfulness & Stress Release',
        category: 'Guided Meditation',
        categoryBadge: 'Mental Clarity',
        facilitator: 'Meera Nambiar',
        facilitatorTitle: 'Mindfulness Coach & Breathwork Specialist',
        facilitatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
        date: 'Monday, Oct 6',
        time: '4:00 PM - 4:25 PM',
        duration: '25 mins',
        mode: 'Live Audio & Visual Sanctuary',
        availableSlots: 28,
        maxSlots: 30,
        description: 'A calming midday reset focusing on physiological sighs, body scan, and cognitive grounding to eliminate afternoon mental fatigue.',
        status: 'available',
        bookedUsers: []
      },
      {
        title: 'Sound Bath & Deep Nervous System Reset',
        category: 'Guided Meditation',
        categoryBadge: 'Deep Rest',
        facilitator: 'Kavi Sharma',
        facilitatorTitle: 'Acoustic Vibrational Therapist',
        facilitatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        date: 'Wednesday, Oct 8',
        time: '5:30 PM - 6:05 PM',
        duration: '35 mins',
        mode: 'Live Binaural Stream',
        availableSlots: 6,
        maxSlots: 6,
        description: 'Immerse in gentle Himalayan singing bowls and theta wave frequencies to soothe the sympathetic nervous system.',
        status: 'available',
        bookedUsers: []
      },
      {
        title: 'Nutritional Biohacking: Beating the 3 PM Slump',
        category: 'Nutrition & Vitality',
        categoryBadge: 'Metabolic Health',
        facilitator: 'Kritika Sunder',
        facilitatorTitle: 'M.Sc. Sports Nutrition & Functional Medicine',
        facilitatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        date: 'Tuesday, Oct 14',
        time: '2:00 PM - 2:45 PM',
        duration: '45 mins',
        mode: 'Live Masterclass & Q&A',
        availableSlots: 20,
        maxSlots: 25,
        description: 'Learn practical glucose balancing hacks, adaptogenic herbs, and desk-friendly snacks to maintain sustained cognitive energy throughout your workday.',
        status: 'available',
        bookedUsers: []
      },
      {
        title: 'Breathwork for High-Stakes Public Speaking',
        category: 'Guided Meditation',
        categoryBadge: 'Executive Calm',
        facilitator: 'Samir Kothari',
        facilitatorTitle: 'Performance Breath Coach & Voice Specialist',
        facilitatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        date: 'Thursday, Oct 16',
        time: '5:00 PM - 5:30 PM',
        duration: '30 mins',
        mode: 'Interactive Breathing Workshop',
        availableSlots: 15,
        maxSlots: 20,
        description: 'Master diaphragmatic grounding techniques used by elite speakers to regulate heart rate variability and speak with commanding confidence under pressure.',
        status: 'available',
        bookedUsers: []
      }
    ]);

    console.log('[Seed] Inserting Wellness Resources...');
    await WellnessResource.create([
      {
        title: 'Managing Stress at Work: Cognitive Re-centering',
        category: 'Mental Well-being',
        readTime: '8 min read',
        type: 'Article & Framework',
        description: 'Practical cognitive reframing techniques to decouple urgent corporate deadlines from fight-or-flight physiological responses.',
        tags: ['Burnout', 'Stress', 'Mental Fitness'],
        content: 'When high-stakes deadlines arrive, the amygdala triggers cortisol surges. By applying cognitive reappraisal and the 4-quadrant urgency matrix, you regain agency...',
        icon: 'Brain',
        createdBy: admin._id
      },
      {
        title: 'Better Sleep Habits for High-Performance Tech Teams',
        category: 'Sleep Architecture',
        readTime: '6 min read',
        type: 'Sleep Guide',
        description: 'How to engineer your sleep sanctuary, optimize non-REM restorative sleep, and mitigate late-night blue-light damage.',
        tags: ['Sleep', 'Recovery', 'Circadian'],
        content: 'Deep sleep allows glymphatic brain clearance of neurotoxins. Learn how maintaining a 68°F room temperature and dimming ambient lighting after 9 PM transforms REM quality...',
        icon: 'Moon',
        createdBy: admin._id
      },
      {
        title: '5-Minute Interactive Box Breathing Exercise',
        category: 'Interactive Practice',
        readTime: '5 min practice',
        type: 'Interactive Tool',
        description: '4 seconds inhale, 4 seconds hold, 4 seconds exhale, 4 seconds hold. Clinically proven to activate the vagus nerve in under 2 minutes.',
        tags: ['Breathwork', 'Quick Calm', 'Vagus Nerve'],
        isInteractiveBreath: true,
        icon: 'Wind',
        createdBy: admin._id
      },
      {
        title: 'Work-Life Boundaries in Hybrid Remote Environments',
        category: 'Workplace Health',
        readTime: '10 min read',
        type: 'Guide & Templates',
        description: 'Establishing asynchronous communication boundaries, shutting down slack guilt-free, and creating a mental end-of-day commute ritual.',
        tags: ['Boundaries', 'Hybrid Work', 'Balance'],
        content: 'Hybrid work often blurs the threshold between home and office. A transitional shutdown routine creates the psychological cue needed to mentally log off...',
        icon: 'Shield',
        createdBy: admin._id
      },
      {
        title: 'The Ultimate Ergonomic Desk Setup Guide',
        category: 'Workplace Health',
        readTime: '7 min read',
        type: 'Ergonomics Checklist',
        description: 'Detailed checklist for monitor eye-level alignment, 90-degree elbow posture, lumbar support angles, and wrist positioning to prevent carpal tunnel syndrome.',
        tags: ['Ergonomics', 'Posture', 'Desk Setup'],
        content: 'Position your primary monitor directly in front of you so your line of sight hits the top third of the screen. Keep wrists neutral and elbows at 90-100 degrees...',
        icon: 'Shield',
        createdBy: admin._id
      },
      {
        title: 'Micro-Moments of Mindfulness for Programmers & Engineers',
        category: 'Mental Well-being',
        readTime: '5 min read',
        type: 'Practical Protocol',
        description: 'How to use build and compilation wait times to unhook from hyper-focused cognitive tunnel vision and refresh executive mental bandwidth.',
        tags: ['Mental Fitness', 'Coding', 'Focus'],
        content: 'When a test suite runs or code compiles, resist the urge to tab over to social media. Instead, look 20 feet into the distance and take three slow, deliberate nasal breaths...',
        icon: 'Brain',
        createdBy: admin._id
      }
    ]);

    console.log('[Seed] Inserting Notifications for Bhuvisha...');
    await Notification.create([
      {
        recipient: bhuvisha._id,
        title: 'Challenge Milestone Reached! 🏆',
        message: 'You crushed Day 18 of the 30-Day Walking Challenge. +75 bonus milestone points awarded!',
        type: 'challenge',
        read: false,
        actionLink: '/challenges/30-day-walking',
        createdAt: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        recipient: bhuvisha._id,
        title: 'Session Reminder: Tomorrow 3:30 PM',
        message: 'Your 1-on-1 Confidential Counseling with Dr. Ananya Sen begins in 18 hours. Link is ready.',
        type: 'session',
        read: false,
        actionLink: '/sessions',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000)
      },
      {
        recipient: bhuvisha._id,
        title: 'Leaderboard Update: You climbed to #12! 🚀',
        message: 'Your recent 10,240-step log pushed you up 2 positions ahead of Siddharth Jain.',
        type: 'leaderboard',
        read: true,
        actionLink: '/leaderboard',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000)
      },
      {
        recipient: bhuvisha._id,
        title: 'New Reward Unlocked 🎉',
        message: 'You have 850 points! The Ergonomic Wellness Kit (750 pts) is now available for redemption.',
        type: 'reward',
        read: true,
        actionLink: '/rewards',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000)
      }
    ]);

    console.log('[Seed] Inserting Webinars...');
    await Webinar.create([
      {
        title: 'Beating Executive Burnout: Science-Backed Recovery',
        description: 'Practical neurobiology strategies to regulate cortisol and prevent long-term corporate exhaustion.',
        facilitator: 'Dr. Marcus Vance, MD & Behavioral Scientist',
        scheduledAt: new Date(Date.now() + 5 * 24 * 3600 * 1000),
        durationMinutes: 60,
        meetingLink: 'https://meet.google.com/waw-burnout-recovery',
        capacity: 150,
        participants: [bhuvisha._id],
        status: 'scheduled',
        createdBy: admin._id
      },
      {
        title: 'Ergonomics for Remote & Hybrid Workstations',
        description: 'Optimizing screen height, lumbar curve, and keyboard angles for zero thoracic strain.',
        facilitator: 'Sarah Lin, DPT',
        scheduledAt: new Date(Date.now() + 9 * 24 * 3600 * 1000),
        durationMinutes: 45,
        meetingLink: 'https://meet.google.com/waw-ergo-hybrid',
        capacity: 100,
        participants: [],
        status: 'scheduled',
        createdBy: admin._id
      }
    ]);

    console.log('[Seed] Inserting Anonymous Mental Health Check-Ins...');
    await MentalHealthCheckIn.create([
      { wellbeingRating: 4, stressLevel: 2, sentimentCategory: 'thriving', optionalAnonymousResponse: 'Feeling motivated after the project deadline pass.', departmentAggregateTag: 'Engineering' },
      { wellbeingRating: 3, stressLevel: 3, sentimentCategory: 'balanced', optionalAnonymousResponse: 'Good rhythm, but lots of sprint reviews.', departmentAggregateTag: 'Product' },
      { wellbeingRating: 2, stressLevel: 4, sentimentCategory: 'fatigued', optionalAnonymousResponse: 'Long zoom calls are creating mental fatigue.', departmentAggregateTag: 'Design' },
      { wellbeingRating: 4, stressLevel: 1, sentimentCategory: 'thriving', optionalAnonymousResponse: 'Loving the team walking challenge.', departmentAggregateTag: 'Marketing' },
      { wellbeingRating: 3, stressLevel: 3, sentimentCategory: 'balanced', optionalAnonymousResponse: 'Normal quarterly workload.', departmentAggregateTag: 'Human Resources' },
      { wellbeingRating: 1, stressLevel: 5, sentimentCategory: 'at_risk', optionalAnonymousResponse: 'Struggling with work-life balance this week.', departmentAggregateTag: 'Sales' }
    ]);

    console.log('===========================================================');
    console.log('  ✅ DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('===========================================================');
    console.log('  Demo Accounts:');
    console.log('  • Employee: bhuvisha.gohil@company.com / Wellness#2026!');
    console.log('  • HR Admin: admin.hr@company.com / AdminPassword#2026');
    console.log('===========================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
