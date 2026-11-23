import {
  Activity,
  Atom,
  BookOpen,
  Briefcase,
  Brain,
  Coins,
  Heart,
  Landmark,
  Sprout,
  Users,
} from 'lucide-react'

/*
 * The 10 wellness dimensions around the tree.
 * x / y are percentages of the scene artwork (the tree trunk is at x ≈ 53%),
 * so the labels stay attached to the tree on every screen size.
 */
export const DIMENSIONS = [
  { name: 'Occupational', icon: Briefcase, x: 35, y: 21 },
  { name: 'Quantum', icon: Atom, x: 66, y: 17 },
  { name: 'Financial', icon: Coins, x: 33, y: 36 },
  { name: 'Emotional', icon: Heart, x: 76, y: 29 },
  { name: 'Mental', icon: Brain, x: 38, y: 49 },
  { name: 'Social', icon: Users, x: 74, y: 45 },
  { name: 'Cultural', icon: Landmark, x: 43, y: 61 },
  { name: 'Physical', icon: Activity, x: 70, y: 58 },
  { name: 'Intellectual', icon: BookOpen, x: 39, y: 73 },
  { name: 'Environmental', icon: Sprout, x: 67, y: 72 },
]
