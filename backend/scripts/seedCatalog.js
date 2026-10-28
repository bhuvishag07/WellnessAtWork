import 'dotenv/config';
import mongoose from 'mongoose';
import Challenge from '../src/models/Challenge.js';
import SessionBooking from '../src/models/SessionBooking.js';
import WellnessResource from '../src/models/WellnessResource.js';
import Reward from '../src/models/Reward.js';
import User from '../src/models/User.js';
import UserChallenge from '../src/models/UserChallenge.js';
import ActivityLog from '../src/models/ActivityLog.js';
import PointTransaction from '../src/models/PointTransaction.js';
import Team from '../src/models/Team.js';

const uri = process.env.MONGODB_URI;

const challenges = [
  {
    slug: '30-day-walking',
    title: '30-Day Walking Challenge',
    category: 'Steps & Fitness',
    categoryKey: 'steps',
    description: 'Build an active habit by aiming for 10,000 steps each day and steadily improving cardiovascular health.',
    duration: '30 Days',
    targetGoal: '10,000 steps / day',
    unit: 'steps',
    rewardPoints: 300,
    totalDays: 30,
    status: 'active'
  },
  {
    slug: 'mindful-minutes',
    title: 'Daily Meditation Challenge',
    category: 'Mindfulness',
    categoryKey: 'meditation',
    description: 'Take a mindful pause each day with guided or silent meditation to support focus and calm.',
    duration: '21 Days',
    targetGoal: '15 min / day',
    unit: 'minutes',
    rewardPoints: 250,
    totalDays: 21,
    status: 'active'
  },
  {
    slug: 'hydration-hero',
    title: 'Hydration Hero',
    category: 'Habit & Vitality',
    categoryKey: 'habit',
    description: 'Build a consistent hydration habit by tracking water intake throughout the workday.',
    duration: '14 Days',
    targetGoal: '2.5 Liters / day',
    unit: 'liters',
    rewardPoints: 150,
    totalDays: 14,
    status: 'active'
  },
  {
    slug: 'screen-break-challenge',
    title: 'Screen Break 20-20-20',
    category: 'Micro-Breaks',
    categoryKey: 'habits',
    description: 'Take short movement and eye-rest breaks during the workday to reduce prolonged screen strain.',
    duration: '10 Days',
    targetGoal: '3 breaks / day',
    unit: 'breaks',
    rewardPoints: 120,
    totalDays: 10,
    status: 'available'
  },
  {
    slug: 'desk-yoga-flow',
    title: 'Desk Yoga & Posture Flow',
    category: 'Flexibility',
    categoryKey: 'exercise',
    description: 'Use brief, desk-friendly movement routines to release shoulder tension and improve posture.',
    duration: '15 Days',
    targetGoal: '10 min / day',
    unit: 'minutes',
    rewardPoints: 180,
    totalDays: 15,
    status: 'available'
  },
  {
    slug: 'digital-sunset',
    title: 'Digital Sunset Sleep Prep',
    category: 'Sleep Hygiene',
    categoryKey: 'mindfulness',
    description: 'Create an evening screen-free routine that supports rest and a healthier work-life boundary.',
    duration: '7 Days',
    targetGoal: '45 min screen-off',
    unit: 'sessions',
    rewardPoints: 100,
    totalDays: 7,
    status: 'available'
  }
];

const sessions = [
  {
    title: '1-on-1 Confidential Counseling',
    category: '1-on-1 Counseling',
    categoryBadge: 'Confidential Care',
    facilitator: 'Dr. Ananya Sen',
    facilitatorTitle: 'Licensed Clinical Psychologist',
    facilitatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    daysAhead: 1,
    time: '3:30 PM - 4:15 PM',
    duration: '45 mins',
    mode: 'Private Video Consultation',
    availableSlots: 3,
    maxSlots: 3,
    description: 'A confidential space to discuss workplace stress, anxiety, or personal challenges. Session details are not shared with HR.'
  },
  {
    title: 'Yoga & Desk Stretching for Spine & Posture',
    category: 'Yoga / Desk Stretching',
    categoryBadge: 'Ergonomics & Movement',
    facilitator: 'Rohan Patel',
    facilitatorTitle: 'Certified Hatha & Ergonomics Instructor',
    facilitatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    daysAhead: 3,
    time: '11:00 AM - 11:30 AM',
    duration: '30 mins',
    mode: 'Live Group Studio Session',
    availableSlots: 15,
    maxSlots: 15,
    description: 'Desk-friendly movement to ease neck tension, improve posture, and restore mobility during the workday.'
  },
  {
    title: 'Guided Mindfulness & Stress Release',
    category: 'Guided Meditation',
    categoryBadge: 'Mental Clarity',
    facilitator: 'Meera Nambiar',
    facilitatorTitle: 'Mindfulness Coach & Breathwork Specialist',
    facilitatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    daysAhead: 5,
    time: '4:00 PM - 4:25 PM',
    duration: '25 mins',
    mode: 'Live Audio & Visual Session',
    availableSlots: 20,
    maxSlots: 20,
    description: 'A guided midday reset with breathing and grounding practices for a calmer transition back to work.'
  },
  {
    title: 'Nutrition for Steady Workday Energy',
    category: 'Nutrition & Vitality',
    categoryBadge: 'Metabolic Health',
    facilitator: 'Kritika Sunder',
    facilitatorTitle: 'Sports Nutrition Specialist',
    facilitatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    daysAhead: 7,
    time: '2:00 PM - 2:45 PM',
    duration: '45 mins',
    mode: 'Live Masterclass & Q&A',
    availableSlots: 25,
    maxSlots: 25,
    description: 'Practical nutrition strategies and balanced snack ideas to maintain energy and focus through the workday.'
  }
];

const resources = [
  {
    title: 'Managing Stress at Work: Cognitive Re-centering',
    category: 'Mental Well-being',
    readTime: '8 min read',
    type: 'Article & Framework',
    description: 'Practical reframing techniques to respond thoughtfully to demanding deadlines and workplace stress.',
    tags: ['Burnout', 'Stress', 'Mental Fitness'],
    content: 'Pause to identify what is urgent, what is important, and which next step is within your control. Short recovery breaks and clear priorities can help restore perspective.',
    icon: 'Brain'
  },
  {
    title: 'Better Sleep Habits for High-Performance Teams',
    category: 'Sleep Architecture',
    readTime: '6 min read',
    type: 'Sleep Guide',
    description: 'Simple routines for a more restful sleep environment and a healthier transition away from screens.',
    tags: ['Sleep', 'Recovery', 'Circadian'],
    content: 'Keep a regular wind-down routine, reduce bright light before bed, and make the sleep space quiet and comfortable. Consistency can support restorative rest.',
    icon: 'Moon'
  },
  {
    title: '5-Minute Interactive Box Breathing Exercise',
    category: 'Interactive Practice',
    readTime: '5 min practice',
    type: 'Interactive Tool',
    description: 'Practice a steady four-count inhale, hold, exhale, and pause to create a mindful break.',
    tags: ['Breathwork', 'Quick Calm', 'Mindfulness'],
    isInteractiveBreath: true,
    icon: 'Wind'
  },
  {
    title: 'Work-Life Boundaries in Hybrid Work',
    category: 'Workplace Health',
    readTime: '10 min read',
    type: 'Guide & Templates',
    description: 'Ideas for setting communication boundaries and building a clear end-of-workday routine.',
    tags: ['Boundaries', 'Hybrid Work', 'Balance'],
    content: 'A short shutdown routine can help create a transition between work and personal time. Set expectations for response windows and protect focused recovery time.',
    icon: 'Shield'
  },
  {
    title: 'The Ergonomic Desk Setup Guide',
    category: 'Workplace Health',
    readTime: '7 min read',
    type: 'Ergonomics Checklist',
    description: 'A practical checklist for monitor placement, comfortable posture, and neutral wrist positioning.',
    tags: ['Ergonomics', 'Posture', 'Desk Setup'],
    content: 'Position your monitor comfortably in front of you, keep shoulders relaxed, and adjust the chair and desk to support a neutral posture. Take regular movement breaks.',
    icon: 'Shield'
  },
  {
    title: 'Micro-Moments of Mindfulness',
    category: 'Mental Well-being',
    readTime: '5 min read',
    type: 'Practical Protocol',
    description: 'Use short pauses between tasks to reset attention and reduce prolonged periods of intense focus.',
    tags: ['Mental Fitness', 'Focus', 'Mindfulness'],
    content: 'Between tasks, look away from the screen, relax your shoulders, and take a few slow breaths before choosing your next action.',
    icon: 'Brain'
  }
];

const rewards = [
  {
    title: 'Artisan Coffee Voucher',
    category: 'Daily Treats',
    pointsCost: 500,
    partner: 'Participating Local Cafes',
    description: 'A voucher toward a specialty coffee, tea, or other cafe drink.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=350&q=80'
  },
  {
    title: 'Ergonomic Wellness Kit',
    category: 'Workspace Health',
    pointsCost: 750,
    partner: 'ErgoCare Labs',
    description: 'A collection of practical accessories to support comfort at your desk.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=350&q=80'
  },
  {
    title: 'Premium Wellness Session',
    category: 'Specialist Care',
    pointsCost: 1000,
    partner: 'MindBody Network',
    description: 'A private session with a qualified wellness or nutrition specialist.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=350&q=80'
  },
  {
    title: 'Fitness Allowance',
    category: 'Active Lifestyle',
    pointsCost: 1500,
    partner: 'Participating Fitness Providers',
    description: 'A contribution toward an eligible gym membership or fitness activity.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=350&q=80'
  }
];

const colleaguesData = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    department: 'Product Design',
    points: 1420,
    streak: 28,
    tier: 'Grandmaster Champion',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Meditation', value: '20', durationMinutes: 20, pointsEarned: 50, challengeSlug: 'mindful-minutes' }
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@company.com',
    department: 'Product Ops',
    points: 1280,
    streak: 22,
    tier: 'Gold Elite',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Walking', value: '10,500', durationMinutes: 50, pointsEarned: 100, challengeSlug: '30-day-walking' }
  },
  {
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@company.com',
    department: 'Engineering',
    points: 1190,
    streak: 19,
    tier: 'Gold Elite',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Walking', value: '9,800', durationMinutes: 45, pointsEarned: 90, challengeSlug: '30-day-walking' }
  },
  {
    name: 'Devansh Nair',
    email: 'devansh.nair@company.com',
    department: 'Marketing',
    points: 1120,
    streak: 17,
    tier: 'Gold Elite',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Hydration', value: '3.0', durationMinutes: 0, pointsEarned: 40, challengeSlug: 'hydration-hero' }
  },
  {
    name: 'Ritika Roy',
    email: 'ritika.roy@company.com',
    department: 'Human Resources',
    points: 1080,
    streak: 16,
    tier: 'Gold Elite',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Meditation', value: '15', durationMinutes: 15, pointsEarned: 40, challengeSlug: 'mindful-minutes' }
  },
  {
    name: 'Kabir Sengupta',
    email: 'kabir.sengupta@company.com',
    department: 'Engineering',
    points: 1040,
    streak: 15,
    tier: 'Gold Elite',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Walking', value: '8,500', durationMinutes: 40, pointsEarned: 80, challengeSlug: '30-day-walking' }
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@company.com',
    department: 'Finance',
    points: 980,
    streak: 14,
    tier: 'Silver Pioneer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Hydration', value: '2.5', durationMinutes: 0, pointsEarned: 30, challengeSlug: 'hydration-hero' }
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@company.com',
    department: 'Sales',
    points: 950,
    streak: 15,
    tier: 'Silver Pioneer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Walking', value: '11,000', durationMinutes: 55, pointsEarned: 100, challengeSlug: '30-day-walking' }
  },
  {
    name: 'Tanvi Deshmukh',
    email: 'tanvi.deshmukh@company.com',
    department: 'Product Design',
    points: 920,
    streak: 12,
    tier: 'Silver Pioneer',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Meditation', value: '15', durationMinutes: 15, pointsEarned: 40, challengeSlug: 'mindful-minutes' }
  },
  {
    name: 'Rohan Varma',
    email: 'rohan.varma@company.com',
    department: 'Engineering',
    points: 890,
    streak: 13,
    tier: 'Silver Pioneer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Walking', value: '9,000', durationMinutes: 42, pointsEarned: 90, challengeSlug: '30-day-walking' }
  },
  {
    name: 'Megha Joshi',
    email: 'megha.joshi@company.com',
    department: 'Legal',
    points: 870,
    streak: 14,
    tier: 'Silver Pioneer',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Hydration', value: '2.5', durationMinutes: 0, pointsEarned: 30, challengeSlug: 'hydration-hero' }
  },
  {
    name: 'Siddharth Jain',
    email: 'siddharth.jain@company.com',
    department: 'Product',
    points: 820,
    streak: 11,
    tier: 'Silver Pioneer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Meditation', value: '10', durationMinutes: 10, pointsEarned: 30, challengeSlug: 'mindful-minutes' }
  },
  {
    name: 'Pooja Hegde',
    email: 'pooja.hegde@company.com',
    department: 'Marketing',
    points: 790,
    streak: 9,
    tier: 'Bronze Starter',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80',
    activity: { activityType: 'Walking', value: '7,500', durationMinutes: 35, pointsEarned: 70, challengeSlug: '30-day-walking' }
  }
];

const addIfMissing = async (Model, filter, record, collectionName) => {
  if (await Model.exists(filter)) {
    console.log(`[Catalog seed] Keeping existing ${collectionName} record: ${record.title || record.fullName || record.name}`);
    return false;
  }

  await Model.create(record);
  console.log(`[Catalog seed] Added ${collectionName} record: ${record.title || record.fullName || record.name}`);
  return true;
};

const formatSessionDate = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const seedCatalog = async () => {
  if (!uri) {
    throw new Error('MONGODB_URI must be set before running the catalog seed.');
  }

  const connectOptions = {};
  if (process.env.MONGODB_DB_NAME) {
    connectOptions.dbName = process.env.MONGODB_DB_NAME;
  }

  await mongoose.connect(uri, connectOptions);
  console.log(`[Catalog seed] Connected to MongoDB database: ${mongoose.connection.name}`);

  let insertedCount = 0;

  // 1. Challenges
  for (const challenge of challenges) {
    const wasAdded = await addIfMissing(
      Challenge,
      { $or: [{ slug: challenge.slug }, { title: challenge.title }] },
      challenge,
      'challenge'
    );
    if (wasAdded) insertedCount++;
  }

  // 2. Sessions (with dynamically calculated upcoming dates)
  for (const session of sessions) {
    const { daysAhead, ...record } = session;
    const wasAdded = await addIfMissing(
      SessionBooking,
      { title: record.title },
      { ...record, date: formatSessionDate(daysAhead), status: 'available', bookedUsers: [] },
      'session'
    );
    if (wasAdded) insertedCount++;
  }

  // 3. Resources
  for (const resource of resources) {
    const wasAdded = await addIfMissing(
      WellnessResource,
      { title: resource.title },
      resource,
      'resource'
    );
    if (wasAdded) insertedCount++;
  }

  // 4. Rewards
  for (const reward of rewards) {
    const wasAdded = await addIfMissing(
      Reward,
      { title: reward.title },
      { ...reward, active: true },
      'reward'
    );
    if (wasAdded) insertedCount++;
  }

  // 5. Baseline Admin (if none exists)
  const adminExists = await User.exists({ role: 'admin' });
  let adminId = null;
  if (!adminExists) {
    const adminPasswordHash = await User.hashPassword(process.env.SEED_ADMIN_PASSWORD || 'Admin#SecurePass2026!');
    const adminUser = await User.create({
      fullName: 'HR Administration',
      email: 'admin.hr@company.com',
      passwordHash: adminPasswordHash,
      department: 'Human Resources',
      role: 'admin',
      totalPoints: 1080,
      tier: 'Gold Elite',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    });
    console.log('[Catalog seed] Added baseline HR admin account (admin.hr@company.com)');
    adminId = adminUser._id;
    insertedCount++;
  } else {
    const existingAdmin = await User.findOne({ role: 'admin' });
    adminId = existingAdmin._id;
  }

  // 6. Colleagues for realistic Leaderboard competition
  const colleaguePasswordHash = await User.hashPassword(process.env.SEED_COLLEAGUE_PASSWORD || 'Colleague#2026Pass!');
  const colleagueUsers = [];

  for (const c of colleaguesData) {
    let user = await User.findOne({ email: c.email });
    if (!user) {
      user = await User.create({
        fullName: c.name,
        email: c.email,
        passwordHash: colleaguePasswordHash,
        department: c.department,
        role: 'employee',
        totalPoints: c.points,
        streakDays: c.streak,
        tier: c.tier,
        avatar: c.avatar,
        privacySettings: { leaderboardVisibility: true, shareStepCounts: true }
      });
      console.log(`[Catalog seed] Added colleague user: ${c.name} (${c.department})`);
      insertedCount++;
    }
    colleagueUsers.push({ user, activityMeta: c.activity });
  }

  // 7. Enroll Colleagues into Challenges & Log Real Activity
  for (const item of colleagueUsers) {
    const { user, activityMeta } = item;
    const challenge = await Challenge.findOne({
      $or: [{ slug: activityMeta.challengeSlug }, { title: { $regex: new RegExp(activityMeta.challengeSlug, 'i') } }]
    });

    if (challenge) {
      // Check enrollment
      let enrollment = await UserChallenge.findOne({ userId: user._id, challengeId: challenge._id });
      if (!enrollment) {
        const progress = Math.min(100, Math.round((activityMeta.pointsEarned / (challenge.rewardPoints || 300)) * 100));
        enrollment = await UserChallenge.create({
          userId: user._id,
          challengeId: challenge._id,
          currentProgress: progress,
          completed: progress >= 100,
          joinedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000)
        });
        await Challenge.findByIdAndUpdate(challenge._id, { $inc: { participantsCount: 1 } });
      }

      // Check activity log
      const existingActivity = await ActivityLog.findOne({
        userId: user._id,
        challengeId: challenge._id
      });

      if (!existingActivity) {
        const act = await ActivityLog.create({
          userId: user._id,
          challengeId: challenge._id,
          challengeTitle: challenge.title,
          activityType: activityMeta.activityType,
          category: activityMeta.activityType === 'Meditation' ? 'Mindfulness' : 'Fitness',
          value: activityMeta.value,
          numericValue: parseFloat(String(activityMeta.value).replace(/,/g, '')) || 0,
          unit: activityMeta.activityType === 'Walking' ? 'steps' : activityMeta.activityType === 'Hydration' ? 'liters' : 'minutes',
          durationMinutes: activityMeta.durationMinutes,
          pointsEarned: activityMeta.pointsEarned,
          source: 'manual',
          notes: `Regular participation in ${challenge.title}`,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 48) * 3600 * 1000)
        });

        await PointTransaction.create({
          userId: user._id,
          type: 'earned',
          points: activityMeta.pointsEarned,
          source: 'activity',
          description: `Logged ${activityMeta.value} for ${challenge.title}`,
          balanceAfter: user.totalPoints,
          relatedActivity: act._id
        });
      }
    }
  }

  // 8. Baseline Teams
  if (colleagueUsers.length >= 6) {
    const engTeamExists = await Team.exists({ name: 'Engineering Sprint Racers' });
    if (!engTeamExists) {
      const engMembers = colleagueUsers.filter(c => c.user.department === 'Engineering').slice(0, 3);
      if (engMembers.length > 0) {
        await Team.create({
          name: 'Engineering Sprint Racers',
          department: 'Engineering',
          description: 'Daily 10k steps and coding ergonomics',
          totalPoints: 12500,
          members: engMembers.map((m, idx) => ({
            userId: m.user._id,
            role: idx === 0 ? 'leader' : 'member'
          }))
        });
        console.log('[Catalog seed] Added baseline team: Engineering Sprint Racers');
        insertedCount++;
      }
    }

    const designTeamExists = await Team.exists({ name: 'Pixel Pacers & Yogis' });
    if (!designTeamExists) {
      const designMembers = colleagueUsers.filter(c => c.user.department === 'Product Design').slice(0, 2);
      if (designMembers.length > 0) {
        await Team.create({
          name: 'Pixel Pacers & Yogis',
          department: 'Product Design',
          description: 'Mindful breathing and posture realignment',
          totalPoints: 8900,
          members: designMembers.map((m, idx) => ({
            userId: m.user._id,
            role: idx === 0 ? 'leader' : 'member'
          }))
        });
        console.log('[Catalog seed] Added baseline team: Pixel Pacers & Yogis');
        insertedCount++;
      }
    }
  }

  console.log(`[Catalog seed] Complete. Seeded missing records (${insertedCount} inserted). All existing records and users were safely preserved.`);
  return { insertedCount };
};

// Auto-run if executed directly via CLI
if (process.argv[1]?.endsWith('seedCatalog.js')) {
  seedCatalog()
    .catch((error) => {
      console.error(`[Catalog seed] Failed: ${error.message}`);
      process.exitCode = 1;
    })
    .finally(async () => {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    });
}

export default seedCatalog;
