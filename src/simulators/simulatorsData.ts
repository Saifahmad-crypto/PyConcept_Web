import { SimulatorMeta } from '../types';

export const SIMULATORS_CATALOG: SimulatorMeta[] = [
  // Category A: Conditional Statement Simulators (4)
  {
    id: 'traffic-signal',
    number: '01',
    title: 'Traffic Signal Simulator',
    category: 'conditionals',
    difficulty: 'Beginner',
    shortDescription:
      'Control a busy intersection and watch vehicles and pedestrians respond to if-elif-else decisions.',
    realLifeScenario:
      'Traffic controllers check signal colors sequentially and pick exactly one movement rule.',
    concepts: ['if', 'elif', 'else', 'Conditional execution'],
  },
  {
    id: 'atm-decision',
    number: '02',
    title: 'ATM Decision Simulator',
    category: 'conditionals',
    difficulty: 'Intermediate',
    shortDescription:
      'Insert a demo card, verify a sample PIN, and validate account balance with nested conditions.',
    realLifeScenario:
      'Banking machines verify identity first, then check withdrawal limits and available demo balance.',
    concepts: ['if-else', 'Nested if', 'Logical operators', 'Comparison operators'],
  },
  {
    id: 'smart-ac',
    number: '03',
    title: 'Smart AC Controller',
    category: 'conditionals',
    difficulty: 'Beginner',
    shortDescription:
      'Adjust room temperature with a live slider and see how boolean comparisons switch cooling ON or OFF.',
    realLifeScenario:
      'Smart thermostats compare sensor readings against a comfort threshold to save energy.',
    concepts: ['if-else', 'Comparison operators', 'Boolean conditions'],
  },
  {
    id: 'shopping-discount',
    number: '04',
    title: 'Shopping Discount Calculator',
    category: 'conditionals',
    difficulty: 'Applied',
    shortDescription:
      'Add products to your cart and trace multi-tier checkout discount rules and final bill math.',
    realLifeScenario:
      'Online checkouts apply tiered percentage discounts from highest spend threshold to lowest.',
    concepts: ['if-elif-else', 'Comparison operators', 'Arithmetic operators'],
  },
  {
    id: 'grade-calculator',
    number: '05',
    title: 'Grade Calculator',
    category: 'conditionals',
    difficulty: 'Beginner',
    shortDescription:
      'Slide student marks from 0 to 100 and trace sequential if-elif-else grading branches.',
    realLifeScenario:
      'Academic evaluation systems check marks against descending thresholds to assign final grades.',
    concepts: ['if-elif-else', 'Comparison operators', 'Descending threshold chain'],
  },
  {
    id: 'leap-year',
    number: '06',
    title: 'Leap Year Checker',
    category: 'conditionals',
    difficulty: 'Intermediate',
    shortDescription:
      'Test years like 2024, 1900, and 2000 to master compound logical operators (and, or, not).',
    realLifeScenario:
      'Calendar systems evaluate astronomical leap rules with divisible by 4, century exclusions, and 400 overrides.',
    concepts: ['Compound booleans', 'and operator', 'or operator', 'Modulo arithmetic (%)'],
  },
  {
    id: 'electricity-bill',
    number: '07',
    title: 'Electricity Bill Calculator',
    category: 'conditionals',
    difficulty: 'Applied',
    shortDescription:
      'Input energy units consumed (kWh) and calculate progressive tariff slab-wise charges via elif.',
    realLifeScenario:
      'Power utilities apply progressive tiered pricing so low electricity usage remains affordable.',
    concepts: ['if-elif-else', 'Tiered pricing slabs', 'Cumulative math'],
  },

  // Category B: Loop Simulators (4)
  {
    id: 'elevator-floor',
    number: '08',
    title: 'Elevator Floor Simulator',
    category: 'loops',
    difficulty: 'Beginner',
    shortDescription:
      'Send an elevator between floors and watch a for loop with range() step floor by floor.',
    realLifeScenario:
      'Building elevators move sequentially across every intermediate floor until reaching the target.',
    concepts: ['for loop', 'range()', 'Iteration', 'Loop variables'],
  },
  {
    id: 'countdown-timer',
    number: '09',
    title: 'Countdown Timer',
    category: 'loops',
    difficulty: 'Beginner',
    shortDescription:
      'Launch a synchronized digital countdown driven by a while loop, condition checks, and break.',
    realLifeScenario:
      'Digital timers repeat an action while time remains and terminate automatically at zero.',
    concepts: ['while loop', 'Loop condition', 'Loop termination', 'break'],
  },
  {
    id: 'parking-scanner',
    number: '10',
    title: 'Parking Slot Scanner',
    category: 'loops',
    difficulty: 'Intermediate',
    shortDescription:
      'Scan parking bays one by one using continue to skip occupied spots and break when one is free.',
    realLifeScenario:
      'Smart garage guidance sensors skip full spaces and stop immediately upon finding an open bay.',
    concepts: ['for loop', 'while loop', 'break', 'continue'],
  },
  {
    id: 'atm-cash-counter',
    number: '11',
    title: 'ATM Cash Counter',
    category: 'loops',
    difficulty: 'Applied',
    shortDescription:
      'Feed ₹100, ₹200, and ₹500 notes into a counter and watch accumulation stop at target or tray empty.',
    realLifeScenario:
      'Currency counters increment note counts and running totals until all notes finish or a limit hits.',
    concepts: ['while loop', 'for loop', 'Accumulation', 'Conditional termination'],
  },
];
