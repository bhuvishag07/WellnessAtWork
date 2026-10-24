export const universalAvatars = [
  {
    id: "avatar-1",
    name: "Classic Lilac",
    category: "Female Portrait",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "avatar-2",
    name: "Pastel Radiance",
    category: "Female Portrait",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "avatar-3",
    name: "Zen Serenity",
    category: "Female Portrait",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "avatar-4",
    name: "Nordic Minimal",
    category: "Female Portrait",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "avatar-5",
    name: "Engineering Lead",
    category: "Male Portrait",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "avatar-6",
    name: "Product Architect",
    category: "Male Portrait",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "avatar-7",
    name: "Calm Focus",
    category: "Male Portrait",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "avatar-8",
    name: "Minimal Geometric",
    category: "Abstract Vector",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23E6D7FF'/%3E%3Cstop offset='100%25' stop-color='%239452E8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23g)'/%3E%3Ccircle cx='50' cy='50' r='32' fill='%23ffffff' opacity='0.85'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%236B31B8'/%3E%3C/svg%3E"
  },
  {
    id: "avatar-9",
    name: "Monogram Initials",
    category: "Initials Badge",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='m' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FAF5FF'/%3E%3Cstop offset='100%25' stop-color='%23D2AFFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23m)'/%3E%3Ctext x='50' y='60' font-family='sans-serif' font-weight='800' font-size='32' text-anchor='middle' fill='%2343197E'%3EWA%3C/text%3E%3C/svg%3E"
  },
  {
    id: "avatar-10",
    name: "Mindful Silhouette",
    category: "Gender-Neutral",
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='n' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23D8B9FF'/%3E%3Cstop offset='100%25' stop-color='%23B882FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23n)'/%3E%3Ccircle cx='50' cy='40' r='16' fill='%23ffffff'/%3E%3Cpath d='M24 82 C24 64, 36 58, 50 58 C64 58, 76 64, 76 82 Z' fill='%23ffffff'/%3E%3C/svg%3E"
  }
];

export const currentUser = {
  id: "emp-7201",
  fullName: "Bhuvisha Manish Gohil",
  firstName: "Bhuvisha",
  email: "bhuvisha.gohil@company.com",
  department: "Engineering (Frontend)",
  role: "Employee",
  academicContext: {
    student: "Bhuvisha Manish Gohil",
    course: "B.Tech Computer Science & Engineering",
    year: "Second Year",
    institution: "ITM Skills University",
    caseStudy: "Case Study 72 - Corporate Employee Wellness Platform"
  },
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  totalPoints: 850,
  activeChallengesCount: 3,
  currentRank: 12,
  upcomingSessionsCount: 2,
  tier: "Silver Pioneer",
  nextTierPoints: 1000,
  streakDays: 14,
  progressPercentage: 85, // 850/1000
};

export const initialChallenges = [
  {
    id: "30-day-walking",
    title: "30-Day Walking Challenge",
    category: "Steps & Fitness",
    categoryKey: "steps",
    description: "Build an active habit by hitting 10,000 brisk steps every day. Improve cardiovascular endurance and combat sedentary screen hours.",
    duration: "30 Days",
    targetGoal: "10,000 steps / day",
    unit: "steps",
    rewardPoints: 300,
    participantsCount: 142,
    progress: 64,
    currentDay: 18,
    totalDays: 30,
    startDate: "2026-09-14",
    endDate: "2026-10-14",
    status: "active",
    joined: true,
    completed: false,
    milestones: [
      { day: 5, label: "5-Day Kickoff", completed: true, points: 50 },
      { day: 10, label: "100k Steps Club", completed: true, points: 75 },
      { day: 18, label: "Midpoint Momentum", completed: true, points: 75 },
      { day: 25, label: "Peak Endurance", completed: false, points: 50 },
      { day: 30, label: "30-Day Champion", completed: false, points: 50 },
    ],
    peerLeaderboard: [
      { rank: 1, name: "Priya Sharma", department: "Product Design", steps: "188,400", points: 280, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
      { rank: 2, name: "Arjun Mehta", department: "Product Ops", steps: "179,200", points: 270, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
      { rank: 3, name: "Sneha Kapoor", department: "Engineering", steps: "168,900", points: 255, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
      { rank: 12, name: "Bhuvisha Gohil (You)", department: "Engineering", steps: "142,000", points: 210, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", isCurrentUser: true },
    ]
  },
  {
    id: "mindful-minutes",
    title: "Daily Meditation Challenge",
    category: "Mindfulness",
    categoryKey: "meditation",
    description: "Decompress between high-intensity sprints with 15 minutes of guided or silent mindfulness to enhance cognitive clarity and calm.",
    duration: "21 Days",
    targetGoal: "15 min / day",
    unit: "minutes",
    rewardPoints: 250,
    participantsCount: 89,
    progress: 48,
    currentDay: 10,
    totalDays: 21,
    startDate: "2026-09-22",
    endDate: "2026-10-13",
    status: "active",
    joined: true,
    completed: false,
    milestones: [
      { day: 7, label: "Mindful Spark", completed: true, points: 50 },
      { day: 14, label: "Zen State", completed: false, points: 100 },
      { day: 21, label: "Habit Master", completed: false, points: 100 },
    ]
  },
  {
    id: "hydration-hero",
    title: "Hydration Hero",
    category: "Habit & Vitality",
    categoryKey: "habit",
    description: "Keep mental fog at bay by drinking at least 2.5 liters of water daily. Log your hydration checkpoints during the workday.",
    duration: "14 Days",
    targetGoal: "2.5 Liters / day",
    unit: "liters",
    rewardPoints: 150,
    participantsCount: 112,
    progress: 75,
    currentDay: 11,
    totalDays: 14,
    startDate: "2026-09-21",
    endDate: "2026-10-05",
    status: "active",
    joined: true,
    completed: false,
    milestones: [
      { day: 5, label: "Well Hydrated", completed: true, points: 50 },
      { day: 10, label: "Vital Flow", completed: true, points: 50 },
      { day: 14, label: "Hero Cleanser", completed: false, points: 50 },
    ]
  },
  {
    id: "screen-break-challenge",
    title: "Screen Break 20-20-20",
    category: "Micro-Breaks",
    categoryKey: "habits",
    description: "Rest your eyes and stretch posture every 90 minutes. Simple 5-minute movement sessions to prevent neck strain and eye fatigue.",
    duration: "10 Days",
    targetGoal: "3 breaks / day",
    unit: "breaks",
    rewardPoints: 120,
    participantsCount: 67,
    progress: 0,
    currentDay: 1,
    totalDays: 10,
    startDate: "2026-10-01",
    endDate: "2026-10-11",
    status: "available",
    joined: false,
    completed: false,
  },
  {
    id: "desk-yoga-flow",
    title: "Desk Yoga & Posture Flow",
    category: "Flexibility",
    categoryKey: "exercise",
    description: "Release spinal compression and tight shoulders with 10-minute seated ergonomic yoga routines designed specifically for office desks.",
    duration: "15 Days",
    targetGoal: "10 min / day",
    unit: "minutes",
    rewardPoints: 180,
    participantsCount: 95,
    progress: 0,
    currentDay: 1,
    totalDays: 15,
    startDate: "2026-10-05",
    endDate: "2026-10-20",
    status: "available",
    joined: false,
    completed: false,
  },
  {
    id: "digital-sunset",
    title: "Digital Sunset Sleep Prep",
    category: "Sleep Hygiene",
    categoryKey: "mindfulness",
    description: "Switch off mobile and laptop screens 45 minutes before bedtime to reset circadian melatonin rhythms and enjoy restorative sleep.",
    duration: "7 Days",
    targetGoal: "45 min screen-off",
    unit: "sessions",
    rewardPoints: 100,
    participantsCount: 53,
    progress: 100,
    currentDay: 7,
    totalDays: 7,
    startDate: "2026-09-10",
    endDate: "2026-09-17",
    status: "completed",
    joined: true,
    completed: true,
  },
  {
    id: "gratitude-reflections",
    title: "Daily Gratitude & Mindset Reset",
    category: "Mindfulness",
    categoryKey: "mindfulness",
    description: "Write down 3 specific things you are grateful for each evening to rewire cognitive positivity and lower work-related cortisol.",
    duration: "14 Days",
    targetGoal: "3 reflections / day",
    unit: "reflections",
    rewardPoints: 150,
    participantsCount: 88,
    progress: 35,
    currentDay: 5,
    totalDays: 14,
    startDate: "2026-10-10",
    endDate: "2026-10-24",
    status: "active",
    joined: true,
    completed: false,
    milestones: [
      { day: 3, label: "Gratitude Spark", completed: true, points: 30 },
      { day: 7, label: "Weekly Reflection", completed: false, points: 50 },
      { day: 14, label: "Mindset Transformation", completed: false, points: 70 }
    ]
  },
  {
    id: "stairway-to-vitality",
    title: "Stairway to Vitality",
    category: "Steps & Fitness",
    categoryKey: "steps",
    description: "Skip the elevator for up to 3 flights of stairs daily. Boost VO2 max, activate glute stabilizers, and elevate cardiovascular health.",
    duration: "21 Days",
    targetGoal: "6 flights / day",
    unit: "flights",
    rewardPoints: 220,
    participantsCount: 76,
    progress: 28,
    currentDay: 6,
    totalDays: 21,
    startDate: "2026-10-08",
    endDate: "2026-10-29",
    status: "active",
    joined: true,
    completed: false,
    milestones: [
      { day: 7, label: "Elevator Free Week", completed: false, points: 50 },
      { day: 14, label: "Cardio Climber", completed: false, points: 70 },
      { day: 21, label: "Peak Climber Master", completed: false, points: 100 }
    ]
  }
];

export const initialActivities = [
  {
    id: "act-1",
    type: "Walking",
    category: "Fitness",
    value: "10,240",
    unit: "steps",
    duration: 52,
    points: 100,
    timestamp: "Today, 8:45 AM",
    challengeTitle: "30-Day Walking Challenge"
  },
  {
    id: "act-2",
    type: "Meditation",
    category: "Mindfulness",
    value: "15",
    unit: "minutes",
    duration: 15,
    points: 40,
    timestamp: "Yesterday, 6:30 PM",
    challengeTitle: "Daily Meditation Challenge"
  },
  {
    id: "act-3",
    type: "Hydration",
    category: "Vitality",
    value: "2.8",
    unit: "liters",
    duration: 0,
    points: 30,
    timestamp: "Yesterday, 9:00 PM",
    challengeTitle: "Hydration Hero"
  },
  {
    id: "act-4",
    type: "Walking",
    category: "Fitness",
    value: "11,100",
    unit: "steps",
    duration: 58,
    points: 100,
    timestamp: "2 days ago",
    challengeTitle: "30-Day Walking Challenge"
  }
];

export const leaderboardData = {
  overall: [
    { rank: 1, name: "Priya Sharma", department: "Product Design", points: 1420, progress: 98, streak: 28, badge: "Grandmaster", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
    { rank: 2, name: "Arjun Mehta", department: "Product Ops", points: 1280, progress: 91, streak: 22, badge: "Master", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
    { rank: 3, name: "Sneha Kapoor", department: "Engineering", points: 1190, progress: 87, streak: 19, badge: "Elite", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
    { rank: 4, name: "Devansh Nair", department: "Marketing", points: 1120, progress: 84, streak: 17, badge: "Elite", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
    { rank: 5, name: "Ritika Roy", department: "Human Resources", points: 1080, progress: 82, streak: 16, badge: "Elite", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
    { rank: 6, name: "Kabir Sengupta", department: "Engineering", points: 1040, progress: 80, streak: 15, badge: "Gold", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
    { rank: 7, name: "Ananya Iyer", department: "Finance", points: 980, progress: 78, streak: 14, badge: "Gold", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
    { rank: 8, name: "Vikram Malhotra", department: "Sales", points: 950, progress: 77, streak: 15, badge: "Gold", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" },
    { rank: 9, name: "Tanvi Deshmukh", department: "Design", points: 920, progress: 76, streak: 12, badge: "Silver", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80" },
    { rank: 10, name: "Rohan Varma", department: "Engineering", points: 890, progress: 75, streak: 13, badge: "Silver", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" },
    { rank: 11, name: "Megha Joshi", department: "Legal", points: 870, progress: 75, streak: 14, badge: "Silver", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80" },
    { rank: 12, name: "Bhuvisha Manish Gohil", department: "Engineering", points: 850, progress: 74, streak: 14, badge: "Silver Pioneer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", isCurrentUser: true },
    { rank: 13, name: "Siddharth Jain", department: "Product", points: 820, progress: 72, streak: 11, badge: "Silver", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80" },
    { rank: 14, name: "Pooja Hegde", department: "Marketing", points: 790, progress: 70, streak: 9, badge: "Bronze", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80" }
  ]
};

export const wellnessSessions = [
  {
    id: "sess-1",
    title: "1-on-1 Confidential Counseling",
    category: "1-on-1 Counseling",
    categoryBadge: "Confidential Care",
    facilitator: "Dr. Ananya Sen",
    facilitatorTitle: "Ph.D., Licensed Clinical Psychologist",
    facilitatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    date: "Tomorrow, Oct 2",
    time: "3:30 PM - 4:15 PM",
    duration: "45 mins",
    mode: "Private Video Consultation",
    availableSlots: 2,
    description: "Safe, confidential space to discuss workplace anxiety, imposter syndrome, stress burnout, or personal challenges. Never shared with HR.",
    booked: true,
    userBookedDate: "Oct 2, 3:30 PM"
  },
  {
    id: "sess-2",
    title: "Yoga & Desk Stretching for Spine & Posture",
    category: "Yoga / Desk Stretching",
    categoryBadge: "Ergonomics & Movement",
    facilitator: "Rohan Patel",
    facilitatorTitle: "Certified Hatha & Ergonomics Instructor",
    facilitatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    date: "Friday, Oct 3",
    time: "11:00 AM - 11:30 AM",
    duration: "30 mins",
    mode: "Live Group Studio Session",
    availableSlots: 14,
    description: "Targeted desk-friendly poses to relieve neck tension, release thoracic stiffness, and re-engage postural core muscles.",
    booked: true,
    userBookedDate: "Oct 3, 11:00 AM"
  },
  {
    id: "sess-3",
    title: "Guided Mindfulness & Stress Release",
    category: "Guided Meditation",
    categoryBadge: "Mental Clarity",
    facilitator: "Meera Nambiar",
    facilitatorTitle: "Mindfulness Coach & Breathwork Specialist",
    facilitatorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    date: "Monday, Oct 6",
    time: "4:00 PM - 4:25 PM",
    duration: "25 mins",
    mode: "Live Audio & Visual Sanctuary",
    availableSlots: 28,
    description: "A calming midday reset focusing on physiological sighs, body scan, and cognitive grounding to eliminate afternoon mental fatigue.",
    booked: false
  },
  {
    id: "sess-4",
    title: "Sound Bath & Deep Nervous System Reset",
    category: "Guided Meditation",
    categoryBadge: "Deep Rest",
    facilitator: "Kavi Sharma",
    facilitatorTitle: "Acoustic Vibrational Therapist",
    facilitatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    date: "Wednesday, Oct 8",
    time: "5:30 PM - 6:05 PM",
    duration: "35 mins",
    mode: "Live Binaural Stream",
    availableSlots: 6,
    description: "Immerse in gentle Himalayan singing bowls and theta wave frequencies to soothe the sympathetic nervous system.",
    booked: false
  },
  {
    id: "sess-5",
    title: "Nutritional Biohacking: Beating the 3 PM Slump",
    category: "Nutrition & Vitality",
    categoryBadge: "Metabolic Health",
    facilitator: "Kritika Sunder",
    facilitatorTitle: "M.Sc. Sports Nutrition & Functional Medicine",
    facilitatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    date: "Tuesday, Oct 14",
    time: "2:00 PM - 2:45 PM",
    duration: "45 mins",
    mode: "Live Masterclass & Q&A",
    availableSlots: 20,
    description: "Learn practical glucose balancing hacks, adaptogenic herbs, and desk-friendly snacks to maintain sustained cognitive energy throughout your workday.",
    booked: false
  },
  {
    id: "sess-6",
    title: "Breathwork for High-Stakes Public Speaking",
    category: "Guided Meditation",
    categoryBadge: "Executive Calm",
    facilitator: "Samir Kothari",
    facilitatorTitle: "Performance Breath Coach & Voice Specialist",
    facilitatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    date: "Thursday, Oct 16",
    time: "5:00 PM - 5:30 PM",
    duration: "30 mins",
    mode: "Interactive Breathing Workshop",
    availableSlots: 15,
    description: "Master diaphragmatic grounding techniques used by elite speakers to regulate heart rate variability and speak with commanding confidence under pressure.",
    booked: false
  }
];

export const wellnessResources = [
  {
    id: "res-1",
    title: "Managing Stress at Work: Cognitive Re-centering",
    category: "Mental Well-being",
    readTime: "8 min read",
    type: "Article & Framework",
    description: "Practical cognitive reframing techniques to decouple urgent corporate deadlines from fight-or-flight physiological responses.",
    tags: ["Burnout", "Stress", "Mental Fitness"],
    content: "When high-stakes deadlines arrive, the amygdala triggers cortisol surges. By applying cognitive reappraisal and the 4-quadrant urgency matrix, you regain agency...",
    icon: "Brain"
  },
  {
    id: "res-2",
    title: "Better Sleep Habits for High-Performance Tech Teams",
    category: "Sleep Architecture",
    readTime: "6 min read",
    type: "Sleep Guide",
    description: "How to engineer your sleep sanctuary, optimize non-REM restorative sleep, and mitigate late-night blue-light damage.",
    tags: ["Sleep", "Recovery", "Circadian"],
    content: "Deep sleep allows glymphatic brain clearance of neurotoxins. Learn how maintaining a 68°F room temperature and dimming ambient lighting after 9 PM transforms REM quality...",
    icon: "Moon"
  },
  {
    id: "res-3",
    title: "5-Minute Interactive Box Breathing Exercise",
    category: "Interactive Practice",
    readTime: "5 min practice",
    type: "Interactive Tool",
    description: "4 seconds inhale, 4 seconds hold, 4 seconds exhale, 4 seconds hold. Clinically proven to activate the vagus nerve in under 2 minutes.",
    tags: ["Breathwork", "Quick Calm", "Vagus Nerve"],
    isInteractiveBreath: true,
    icon: "Wind"
  },
  {
    id: "res-4",
    title: "Work-Life Boundaries in Hybrid Remote Environments",
    category: "Workplace Health",
    readTime: "10 min read",
    type: "Guide & Templates",
    description: "Establishing asynchronous communication boundaries, shutting down slack guilt-free, and creating a mental end-of-day commute ritual.",
    tags: ["Boundaries", "Hybrid Work", "Balance"],
    content: "Hybrid work often blurs the threshold between home and office. A transitional shutdown routine creates the psychological cue needed to mentally log off...",
    icon: "Shield"
  },
  {
    id: "res-5",
    title: "Ultimate Ergonomic Desk Setup Guide",
    category: "Workplace Health",
    readTime: "7 min read",
    type: "Ergonomics Checklist",
    description: "Detailed checklist for monitor eye-level alignment, 90-degree elbow posture, lumbar support angles, and wrist positioning to prevent carpal tunnel syndrome.",
    tags: ["Ergonomics", "Posture", "Desk Setup"],
    content: "Position your primary monitor directly in front of you so your line of sight hits the top third of the screen, approximately an arm's length away. Maintain elbows and knees at a relaxed 90-to-100 degree angle to relieve strain on tendons and lower lumbar discs. Keep wrists in a neutral, unbent position using an ergonomic palm rest. Take 30-second micro-breaks every 30 minutes to roll shoulders and re-engage postural stabilizer muscles.",
    icon: "Shield"
  },
  {
    id: "res-6",
    title: "Micro-Moments of Mindfulness for Programmers & Engineers",
    category: "Mental Well-being",
    readTime: "5 min read",
    type: "Practical Protocol",
    description: "How to use build and compilation wait times to unhook from hyper-focused cognitive tunnel vision and refresh executive mental bandwidth.",
    tags: ["Mental Fitness", "Coding", "Focus"],
    content: "When a test suite runs, code compiles, or Docker containers spin up, resist the reflex to switch context to email or social feeds. Instead, practice the 20-20-20 rule: gaze at an object 20 feet away for 20 seconds, drop shoulder tension, and take three diaphragmatic nasal breaths. This micro-reset preserves executive functioning and prevents cognitive fatigue over 8-hour sprint cycles.",
    icon: "Brain"
  }
];

export const rewardsStore = [
  {
    id: "rew-1",
    title: "Artisan Coffee Voucher ($15)",
    category: "Daily Treats",
    pointsCost: 500,
    partner: "Blue Tokai / Starbucks / Local Cafes",
    description: "Enjoy your favorite specialty roast, cappuccino, or matcha latte on us.",
    status: "available",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=350&q=80"
  },
  {
    id: "rew-2",
    title: "Ergonomic Wellness Kit",
    category: "Workspace Health",
    pointsCost: 750,
    partner: "ErgoCare Labs",
    description: "Includes an acupressure mat, memory foam lumbar support cushion, and posture stretch bands.",
    status: "available",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=350&q=80"
  },
  {
    id: "rew-3",
    title: "Premium 1-on-1 Wellness Session",
    category: "Specialist Care",
    pointsCost: 1000,
    partner: "MindBody Elite Network",
    description: "A private 60-minute session with a top executive life coach or master nutritionist.",
    status: "locked",
    neededPoints: 150,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=350&q=80"
  },
  {
    id: "rew-4",
    title: "Quarterly Gym & Fitness Allowance ($100)",
    category: "Active Lifestyle",
    pointsCost: 1500,
    partner: "Cult.fit / Equinox / Any Gym",
    description: "Direct reimbursement towards your monthly gym membership, rock climbing pass, or swimming pool.",
    status: "locked",
    neededPoints: 650,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=350&q=80"
  },
  {
    id: "rew-5",
    title: "Bose Noise-Cancelling Headphones Contribution",
    category: "Deep Focus",
    pointsCost: 1200,
    partner: "Bose / Amazon Corporate Perk ($50 Voucher)",
    description: "$50 voucher contribution towards premium active noise-cancelling headphones for deep focus work sessions and acoustic sanctuary.",
    status: "locked",
    neededPoints: 350,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=350&q=80"
  },
  {
    id: "rew-6",
    title: "Organic Herbal Tea & Adaptogen Tonic Box",
    category: "Vitality",
    pointsCost: 600,
    partner: "Vahdam / Traditional Medicinals",
    description: "An artisan selection of organic chamomile, ashwagandha, matcha, and peppermint teas designed for all-day focus, calm, and metabolic balance.",
    status: "available",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=350&q=80"
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    title: "Challenge Milestone Reached! 🏆",
    message: "You crushed Day 18 of the 30-Day Walking Challenge. +75 bonus milestone points awarded!",
    timestamp: "10 mins ago",
    read: false,
    type: "challenge",
    actionLink: "/challenges/30-day-walking"
  },
  {
    id: "notif-2",
    title: "Session Reminder: Tomorrow 3:30 PM",
    message: "Your 1-on-1 Confidential Counseling with Dr. Ananya Sen begins in 18 hours. Link is ready.",
    timestamp: "2 hours ago",
    read: false,
    type: "session",
    actionLink: "/sessions"
  },
  {
    id: "notif-3",
    title: "Leaderboard Update: You climbed to #12! 🚀",
    message: "Your recent 10,240-step log pushed you up 2 positions ahead of Siddharth Jain.",
    timestamp: "5 hours ago",
    read: true,
    type: "leaderboard",
    actionLink: "/leaderboard"
  },
  {
    id: "notif-4",
    title: "New Reward Unlocked 🎉",
    message: "You have 850 points! The Ergonomic Wellness Kit (750 pts) is now available for redemption.",
    timestamp: "1 day ago",
    read: true,
    type: "reward",
    actionLink: "/rewards"
  }
];

export const adminMetrics = {
  totalEmployees: 248,
  activeChallenges: 12,
  participationRate: "78%",
  activitiesLogged: "1,482",
  pointsDistributed: "42,850",
  sessionsBooked: 96,
  burnoutRiskReduction: "-34%",
  departmentParticipation: [
    { department: "Engineering", employees: 92, participation: 84, points: 16420, avgSteps: 9450 },
    { department: "Product & Design", employees: 44, participation: 88, points: 10180, avgSteps: 9820 },
    { department: "Marketing & Growth", employees: 38, participation: 76, points: 6450, avgSteps: 8300 },
    { department: "Human Resources", employees: 26, participation: 92, points: 5120, avgSteps: 8900 },
    { department: "Sales & Operations", employees: 48, participation: 68, points: 4680, avgSteps: 7650 }
  ],
  weeklyActivityTrend: [
    { day: "Mon", steps: 320000, mindfulnessMin: 1840, sessions: 18 },
    { day: "Tue", steps: 385000, mindfulnessMin: 2150, sessions: 22 },
    { day: "Wed", steps: 412000, mindfulnessMin: 2420, sessions: 25 },
    { day: "Thu", steps: 395000, mindfulnessMin: 2280, sessions: 19 },
    { day: "Fri", steps: 440000, mindfulnessMin: 2790, sessions: 12 },
    { day: "Sat", steps: 290000, mindfulnessMin: 1450, sessions: 0 },
    { day: "Sun", steps: 310000, mindfulnessMin: 1600, sessions: 0 }
  ]
};
