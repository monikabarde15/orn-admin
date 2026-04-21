// Mock course data for course-preview and view course pages
// This file exports an array of course objects for free, monthly, yearly, and hourly (pay per lab) plans
// Structure matches backend API for easy integration

export type QuizOption = {
  id: number;
  text: string;
  is_correct: boolean;
};

export type Quiz = {
  id: number;
  question: string;
  options: QuizOption[];
};

export type Chapter = {
  id: number;
  title: string;
  description: string;
  video: string | null;
  file: string | null;
  quizzes: Quiz[];
  created_at: string;
  updated_at: string;
  user: number;
  module: number;
};

export type Module = {
  id: number;
  title: string;
  description: string;
  order: number;
  video: string | null;
  user: number;
  course: number;
  created_at: string;
  updated_at: string;
  chapters: Chapter[];
};

export type Thumbnail = {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
  user: number;
  course: number;
};

export type Course = {
  id: number;
  subscription_name: string;
  modules: Module[];
  thumbnail: Thumbnail;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  instructor: string;
  learningOutcomes: string;
  prerequisites: string;
  isPublished: boolean;
  user: number;
  plan: 'free' | 'monthly' | 'yearly' | 'hourly';
  price?: number;
};

export const courses: Course[] = [
  // Free plan courses
  {
    id: 1,
    subscription_name: 'Linux',
    modules: [],
    thumbnail: {
      id: 1001,
      image: 'via.placeholder.com/400x200.png?text=Linux',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 1,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Linux',
    description: '2 Node Configuration; SSH Access; Basic Support; List of Lab Access',
    category: 'linux',
    difficulty: 'beginner',
    duration: 'Free',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'free',
  },
  {
    id: 2,
    subscription_name: 'Terraform',
    modules: [],
    thumbnail: {
      id: 1002,
      image: 'via.placeholder.com/400x200.png?text=Terraform',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 2,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Terraform',
    description: 'Terraform Setup; State Management; Multiple Providers; Best Practices Guide; List of Lab Access',
    category: 'terraform',
    difficulty: 'beginner',
    duration: 'Free',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'free',
  },
  {
    id: 3,
    subscription_name: 'Kubernetes',
    modules: [],
    thumbnail: {
      id: 1003,
      image: 'via.placeholder.com/400x200.png?text=Kubernetes',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 3,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Kubernetes',
    description: 'K8s Cluster; Kubectl Access; Helm Charts; Load Balancing; List of Lab Access',
    category: 'kubernetes',
    difficulty: 'beginner',
    duration: 'Free',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'free',
  },
  {
    id: 4,
    subscription_name: 'Redhat Cluster',
    modules: [],
    thumbnail: {
      id: 1004,
      image: 'via.placeholder.com/400x200.png?text=Redhat+Cluster',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 4,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Redhat Cluster',
    description: '3-node RHEL cluster; SCSI storage (server + client); Web SSH server; 24×7 continuous availability; Fully explained, practical, step-by-step setup with video guide',
    category: 'redhat',
    difficulty: 'beginner',
    duration: 'Free',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'free',
  },
  {
    id: 5,
    subscription_name: 'Docker',
    modules: [],
    thumbnail: {
      id: 1005,
      image: 'via.placeholder.com/400x200.png?text=Docker',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 5,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Docker',
    description: 'Limited Access Lab (60 mins); No real-time project environments; Read-only access to blogs and tutorials; Community Support',
    category: 'docker',
    difficulty: 'beginner',
    duration: 'Free',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'free',
  },
  // Only two pay per lab (hourly) courses
  // ...existing code...

  // Monthly plan courses
  {
    id: 11,
    subscription_name: 'Linux',
    modules: [],
    thumbnail: {
      id: 1011,
      image: 'via.placeholder.com/400x200.png?text=Linux',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 11,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Linux',
    description: '2 Node Configuration; SSH Access; Basic Support; List of Lab Access',
    category: 'linux',
    difficulty: 'beginner',
    duration: 'Monthly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'monthly',
    price: 500,
  },
  {
    id: 12,
    subscription_name: 'Terraform',
    modules: [],
    thumbnail: {
      id: 1012,
      image: 'via.placeholder.com/400x200.png?text=Terraform',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 12,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Terraform',
    description: 'Terraform Setup; State Management; Multiple Providers; Best Practices Guide; List of Lab Access',
    category: 'terraform',
    difficulty: 'beginner',
    duration: 'Monthly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'monthly',
    price: 500,
  },
  {
    id: 13,
    subscription_name: 'Kubernetes',
    modules: [],
    thumbnail: {
      id: 1013,
      image: 'via.placeholder.com/400x200.png?text=Kubernetes',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 13,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Kubernetes',
    description: 'K8s Cluster; Kubectl Access; Helm Charts; Load Balancing; List of Lab Access',
    category: 'kubernetes',
    difficulty: 'beginner',
    duration: 'Monthly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'monthly',
    price: 500,
  },
  {
    id: 14,
    subscription_name: 'Redhat Cluster',
    modules: [],
    thumbnail: {
      id: 1014,
      image: 'via.placeholder.com/400x200.png?text=Redhat+Cluster',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 14,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Redhat Cluster',
    description: '3-node RHEL cluster; SCSI storage (server + client); Web SSH server; 24×7 continuous availability; Fully explained, practical, step-by-step setup with video guide',
    category: 'redhat',
    difficulty: 'beginner',
    duration: 'Monthly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'monthly',
    price: 500,
    features: [
      'Introduction',
      'WEBSSH into the instance',
      'Installing the HA Packages and Agents',
      'Creating a Cluster',
      'Installing the AWS CLI on the Nodes',
      'Creating a Fencing Device',
      'Configuring Private and Virtual IP Resources',
      'Configuring GFS2 on RedHat Cluster',
      'Creating an Elastic IP Address',
      'Configuring Apache Webserver',
      'Configure ISCSI target and Initiator',
    ],
  },
  {
    id: 15,
    subscription_name: 'Docker',
    modules: [],
    thumbnail: {
      id: 1015,
      image: 'via.placeholder.com/400x200.png?text=Docker',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 15,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Docker',
    description: 'Limited Access Lab (60 mins); No real-time project environments; Read-only access to blogs and tutorials; Community Support',
    category: 'docker',
    difficulty: 'beginner',
    duration: 'Monthly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'monthly',
    price: 500,
  },

  // Yearly plan courses
  {
    id: 21,
    subscription_name: 'Linux',
    modules: [],
    thumbnail: {
      id: 1021,
      image: 'via.placeholder.com/400x200.png?text=Linux',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 21,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Linux',
    description: '2 Node Configuration; SSH Access; Basic Support; List of Lab Access',
    category: 'linux',
    difficulty: 'beginner',
    duration: 'Yearly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'yearly',
    price: 4000,
  },
  {
    id: 22,
    subscription_name: 'Terraform',
    modules: [],
    thumbnail: {
      id: 1022,
      image: 'via.placeholder.com/400x200.png?text=Terraform',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 22,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Terraform',
    description: 'Terraform Setup; State Management; Multiple Providers; Best Practices Guide; List of Lab Access',
    category: 'terraform',
    difficulty: 'beginner',
    duration: 'Yearly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'yearly',
    price: 4000,
  },
  {
    id: 23,
    subscription_name: 'Kubernetes',
    modules: [],
    thumbnail: {
      id: 1023,
      image: 'via.placeholder.com/400x200.png?text=Kubernetes',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 23,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Kubernetes',
    description: 'K8s Cluster; Kubectl Access; Helm Charts; Load Balancing; List of Lab Access',
    category: 'kubernetes',
    difficulty: 'beginner',
    duration: 'Yearly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'yearly',
    price: 4000,
  },
  {
    id: 24,
    subscription_name: 'Redhat Cluster',
    modules: [],
    thumbnail: {
      id: 1024,
      image: 'via.placeholder.com/400x200.png?text=Redhat+Cluster',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 24,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Redhat Cluster',
    description: '3-node RHEL cluster; SCSI storage (server + client); Web SSH server; 24×7 continuous availability; Fully explained, practical, step-by-step setup with video guide',
    category: 'redhat',
    difficulty: 'beginner',
    duration: 'Yearly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'yearly',
    price: 4000,
    features: [
      'Introduction',
      'WEBSSH into the instance',
      'Installing the HA Packages and Agents',
      'Creating a Cluster',
      'Installing the AWS CLI on the Nodes',
      'Creating a Fencing Device',
      'Configuring Private and Virtual IP Resources',
      'Configuring GFS2 on RedHat Cluster',
      'Creating an Elastic IP Address',
      'Configuring Apache Webserver',
      'Configure ISCSI target and Initiator',
    ],
  },
  {
    id: 25,
    subscription_name: 'Docker',
    modules: [],
    thumbnail: {
      id: 1025,
      image: 'via.placeholder.com/400x200.png?text=Docker',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 25,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Docker',
    description: 'Limited Access Lab (60 mins); No real-time project environments; Read-only access to blogs and tutorials; Community Support',
    category: 'docker',
    difficulty: 'beginner',
    duration: 'Yearly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'yearly',
    price: 4000,
  },

  // Only two pay per lab (hourly) courses
  {
    id: 44,
    subscription_name: 'Redhat Cluster',
    modules: [],
    thumbnail: {
      id: 1044,
      image: 'via.placeholder.com/400x200.png?text=Redhat+Cluster',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 44,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Redhat Cluster',
    description: '3-node RHEL cluster; SCSI storage (server + client); Web SSH server; 24×7 continuous availability; Fully explained, practical, step-by-step setup with video guide',
    category: 'redhat',
    difficulty: 'beginner',
    duration: 'Hourly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'hourly',
    price: 49,
  },
  {
    id: 45,
    subscription_name: 'Docker',
    modules: [],
    thumbnail: {
      id: 1045,
      image: 'via.placeholder.com/400x200.png?text=Docker',
      created_at: '2026-04-01T10:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
      user: 1,
      course: 45,
    },
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
    title: 'Docker',
    description: 'Limited Access Lab (60 mins); No real-time project environments; Read-only access to blogs and tutorials; Community Support',
    category: 'docker',
    difficulty: 'beginner',
    duration: 'Hourly',
    instructor: '',
    learningOutcomes: '',
    prerequisites: '',
    isPublished: true,
    user: 1,
    plan: 'hourly',
    price: 49,
  }
];
