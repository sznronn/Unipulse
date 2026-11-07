import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Bell,
  Search,
  Upload,
  Plus,
  FileText,
  ThumbsUp,
  Bookmark,
  ExternalLink,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  ChevronDown,
  X,
  Sun,
  Moon,
  Filter,
  Download,
  Share2,
  Sparkles,
  GraduationCap,
  Laptop,
  Code2,
  Terminal,
  Layers,
  ArrowRight,
  Eye,
  Check,
  Award,
  BookMarked,
  CalendarCheck,
  FolderOpen
} from 'lucide-react';

// ==========================================
// DATA MODELS & TYPES
// ==========================================

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  department: string;
  semester: string;
  studentId: string;
  reputationPoints: number;
  badge: string;
  subscribedCourses: string[];
}

export type FileType = 'pdf' | 'docx' | 'slides' | 'zip' | 'notes';

export interface AcademicResource {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  department: string;
  semester: string;
  topicTags: string[];
  fileType: FileType;
  fileSize: string;
  pagesCount: number;
  uploadedBy: string;
  uploadedAt: string;
  upvotes: number;
  isUpvoted: boolean;
  isBookmarked: boolean;
  downloadsCount: number;
  previewSnippet: string;
}

export type EventCategory = 'Hackathon' | 'Workshop' | 'AI Demo' | 'Coding Contest' | 'Guest Talk';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  department: string;
  date: string;
  time: string;
  venueOrLink: string;
  locationType: 'In-Person' | 'Virtual' | 'Hybrid';
  organizer: string;
  tags: string[];
  rsvpCount: number;
  rsvpCapacity: number;
  isRsvp: boolean;
  featured: boolean;
}

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  category: 'events' | 'uploads' | 'rsvp' | 'system';
  timestamp: string;
  read: boolean;
  resourceId?: string;
  eventId?: string;
}

// ==========================================
// INITIAL MOCK DATA
// ==========================================

const INITIAL_USER: UserProfile = {
  id: 'usr-10492',
  name: 'Alex Rivera',
  handle: '@arivera_cs',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  department: 'Computer Science & Engineering',
  semester: 'Senior · Semester 7',
  studentId: 'CSE-2023-894',
  reputationPoints: 480,
  badge: 'Senior Contributor',
  subscribedCourses: ['CS 440', 'CS 380', 'MATH 240', 'CS 320']
};

const INITIAL_RESOURCES: AcademicResource[] = [
  {
    id: 'res-1',
    title: 'Distributed Systems & Raft Consensus Architecture',
    description: 'Detailed synthesis of distributed consensus protocols, RPC fault-tolerance models, state machine replication, and vector clocks.',
    courseCode: 'CS 440',
    courseName: 'Distributed Operating Systems',
    department: 'Computer Science',
    semester: 'Fall 2026',
    topicTags: ['Raft Protocol', 'Consensus', 'Fault Tolerance', 'RPCs'],
    fileType: 'pdf',
    fileSize: '4.8 MB',
    pagesCount: 34,
    uploadedBy: 'Elena Vance',
    uploadedAt: '2 hours ago',
    upvotes: 68,
    isUpvoted: false,
    isBookmarked: true,
    downloadsCount: 194,
    previewSnippet: 'Section 3.2: Leader Election in Raft\nWhen servers boot, they initialize in the follower state. If election timeout elapses without heartbeat from the leader, follower transitions to candidate...'
  },
  {
    id: 'res-2',
    title: 'Deep Learning & Transformer Attention Mechanisms',
    description: 'Mathematical derivation of scaled dot-product attention, multi-head projections, positional encodings, and FlashAttention 2 benchmark notes.',
    courseCode: 'CS 380',
    courseName: 'Machine Learning & Neural Nets',
    department: 'Artificial Intelligence',
    semester: 'Fall 2026',
    topicTags: ['Transformers', 'Attention', 'PyTorch', 'Math Derivation'],
    fileType: 'pdf',
    fileSize: '6.2 MB',
    pagesCount: 42,
    uploadedBy: 'Marcus Brody',
    uploadedAt: 'Yesterday',
    upvotes: 112,
    isUpvoted: true,
    isBookmarked: false,
    downloadsCount: 340,
    previewSnippet: 'Equation 4: Scaled Dot-Product Attention\nAttention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V\nThe scale factor 1/sqrt(d_k) prevents dot products from growing excessively large for large dimensions...'
  },
  {
    id: 'res-3',
    title: 'Linear Algebra: Eigenvalues, SVD & PCA Cheatsheet',
    description: 'High-yield exam review sheet for Singular Value Decomposition, spectral theorem, orthogonal projections, and dimensionality reduction proofs.',
    courseCode: 'MATH 240',
    courseName: 'Applied Linear Algebra',
    department: 'Mathematics',
    semester: 'Fall 2026',
    topicTags: ['Eigenvalues', 'SVD', 'PCA', 'Midterm Cheatsheet'],
    fileType: 'docx',
    fileSize: '1.9 MB',
    pagesCount: 12,
    uploadedBy: 'Sarah Lin',
    uploadedAt: '3 days ago',
    upvotes: 89,
    isUpvoted: false,
    isBookmarked: true,
    downloadsCount: 285,
    previewSnippet: 'Theorem: Spectral Decomposition for Symmetric Matrices\nEvery real symmetric matrix A can be factored as A = Q * Lambda * Q^T where Q is an orthogonal matrix of eigenvectors...'
  },
  {
    id: 'res-4',
    title: 'Computer Architecture: RISC-V Pipeline Hazards & Cache',
    description: 'Visual hazard resolution diagrams (data, control, structural), branch prediction branch target buffers, and multi-level set-associative cache design.',
    courseCode: 'CS 320',
    courseName: 'Computer Architecture & Systems',
    department: 'Computer Science',
    semester: 'Spring 2026',
    topicTags: ['RISC-V', 'Pipelining', 'Data Hazards', 'Cache Associativity'],
    fileType: 'slides',
    fileSize: '14.5 MB',
    pagesCount: 56,
    uploadedBy: 'Julian Meyer',
    uploadedAt: '5 days ago',
    upvotes: 45,
    isUpvoted: false,
    isBookmarked: false,
    downloadsCount: 142,
    previewSnippet: 'Hazard Unit Logic: IF/ID.RegisterRs1 == ID/EX.RegisterRd\nWhen an instruction in the decode stage depends on the immediately preceding arithmetic instruction, forwarding or a stall cycle must be injected...'
  },
  {
    id: 'res-5',
    title: 'Relational Database Internals: B+ Trees & ACID Isolation',
    description: 'Storage engine layouts, slotted page structures, WAL (Write-Ahead Logging) protocols, and multi-version concurrency control (MVCC) implementations.',
    courseCode: 'CS 410',
    courseName: 'Database Systems Implementation',
    department: 'Computer Science',
    semester: 'Fall 2026',
    topicTags: ['B+ Trees', 'WAL Logging', 'MVCC', 'ACID'],
    fileType: 'pdf',
    fileSize: '3.7 MB',
    pagesCount: 26,
    uploadedBy: 'Alex Rivera',
    uploadedAt: '1 week ago',
    upvotes: 73,
    isUpvoted: true,
    isBookmarked: false,
    downloadsCount: 210,
    previewSnippet: 'ARIES Recovery Algorithm Overview:\n1. Analysis Phase: Scan WAL forward from last checkpoint to reconstruct Dirty Page Table (DPT).\n2. Redo Phase: Reapply all logged operations.\n3. Undo Phase: Reverse changes of active transactions.'
  },
  {
    id: 'res-6',
    title: 'Quantum Computing Foundations & Qiskit Labs',
    description: 'Qubit superposition matrices, Deutsch-Jozsa algorithm derivation, Grover search oracle implementations with verified Qiskit Jupyter notebooks.',
    courseCode: 'PHYS 350',
    courseName: 'Quantum Information & Computing',
    department: 'Physics',
    semester: 'Fall 2026',
    topicTags: ['Qiskit', 'Qubits', 'Grover Search', 'Superposition'],
    fileType: 'zip',
    fileSize: '8.4 MB',
    pagesCount: 18,
    uploadedBy: 'Dr. Priya Natarajan',
    uploadedAt: '2 weeks ago',
    upvotes: 54,
    isUpvoted: false,
    isBookmarked: false,
    downloadsCount: 98,
    previewSnippet: 'Quantum State Vector Transformation:\nApplying the Hadamard gate H to state |0> yields (|0> + |1>)/sqrt(2).\nIn Grover Search, amplitude amplification inverts probabilities around the mean value.'
  }
];

const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'HackCampus 2026: Autonomous Agents & Edge Systems',
    description: 'Annual 36-hour flagship hackathon. Build multi-agent platforms, robotics integration, or edge AI applications. $18,000 in sponsor tracks, hardware lab access, and direct recruiter coffee chats.',
    category: 'Hackathon',
    department: 'ACM Student Chapter & Robotics Lab',
    date: 'Nov 20 - Nov 22, 2026',
    time: 'Fri 06:00 PM - Sun 04:00 PM EST',
    venueOrLink: 'Engineering Quad Atrium & MakerLab',
    locationType: 'In-Person',
    organizer: 'ACM Student Board',
    tags: ['Agents', 'Hardware', 'Prizes $18K', 'Mentors', 'Food Provided'],
    rsvpCount: 184,
    rsvpCapacity: 250,
    isRsvp: true,
    featured: true
  },
  {
    id: 'evt-2',
    title: 'Hands-on Workshop: Building Local LLM Inference with Ollama & Rust',
    description: 'Deep dive into deploying quantized open-weights models (Llama 3.3, Mistral) on Apple Silicon and Linux workstations with custom token streaming servers.',
    category: 'Workshop',
    department: 'Computer Science Department',
    date: 'Nov 12, 2026',
    time: '04:00 PM - 06:30 PM EST',
    venueOrLink: 'Turing Hall, Lab 304 (Bring Laptop)',
    locationType: 'Hybrid',
    organizer: 'Open Source Developer Guild',
    tags: ['Rust', 'Local LLMs', 'Quantization', 'Hands-on'],
    rsvpCount: 78,
    rsvpCapacity: 90,
    isRsvp: false,
    featured: false
  },
  {
    id: 'evt-3',
    title: 'Bi-Weekly Competitive Programming Contest: Graph Theory Sprint',
    description: 'Speed algorithmic contest covering Dijkstra variants, Eulerian paths, Tarjan strongly connected components, and bipartite matching with live scoreboard.',
    category: 'Coding Contest',
    department: 'Algorithms Society',
    date: 'Nov 15, 2026',
    time: '02:00 PM - 05:00 PM EST',
    venueOrLink: 'Codeforces Gym & Lab 102',
    locationType: 'Hybrid',
    organizer: 'ICPC University Team',
    tags: ['Algorithms', 'Graphs', 'Codeforces', 'Leaderboard'],
    rsvpCount: 62,
    rsvpCapacity: 100,
    isRsvp: true,
    featured: false
  },
  {
    id: 'evt-4',
    title: 'AI Lab Live Demo: Autonomous Drone Swarm Fleet Telemetry',
    description: 'Live field demonstration of distributed decentralized consensus among 12 quadcopters executing obstacle avoidance without central controller.',
    category: 'AI Demo',
    department: 'Robotics & Autonomous Systems Institute',
    date: 'Nov 18, 2026',
    time: '01:00 PM - 02:30 PM EST',
    venueOrLink: 'North Campus Flight Pavilion',
    locationType: 'In-Person',
    organizer: 'AeroRobotics Lab',
    tags: ['Drones', 'Swarm Robotics', 'ROS 2', 'Live Demo'],
    rsvpCount: 140,
    rsvpCapacity: 150,
    isRsvp: false,
    featured: true
  },
  {
    id: 'evt-5',
    title: 'Industry Fireside: Distributed Infrastructure at Scale',
    description: 'Q&A session with alumni infrastructure staff engineers discussing global multi-region database failovers, distributed tracing, and graduate engineering career paths.',
    category: 'Guest Talk',
    department: 'Career & Alumni Association',
    date: 'Nov 24, 2026',
    time: '05:30 PM - 07:00 PM EST',
    venueOrLink: 'Main Auditorium & Zoom Live Stream',
    locationType: 'Hybrid',
    organizer: 'Tech Alumni Network',
    tags: ['Career', 'Distributed Systems', 'Alumni', 'Q&A'],
    rsvpCount: 110,
    rsvpCapacity: 200,
    isRsvp: false,
    featured: false
  }
];

const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: 'notif-1',
    title: 'New Study Guide in CS 440',
    message: 'Elena Vance just uploaded "Distributed Systems & Raft Consensus Architecture" with 34 pages of notes.',
    category: 'uploads',
    timestamp: '2 hours ago',
    read: false,
    resourceId: 'res-1'
  },
  {
    id: 'notif-2',
    title: 'RSVP Confirmed: HackCampus 2026',
    message: 'Your spot for HackCampus 2026 is confirmed. Check the Discord server for team matching.',
    category: 'rsvp',
    timestamp: '5 hours ago',
    read: false,
    eventId: 'evt-1'
  },
  {
    id: 'notif-3',
    title: 'Reminder: Graph Theory Sprint Contest',
    message: 'The algorithmic sprint begins this Saturday at 02:00 PM. Make sure your Codeforces handle is linked.',
    category: 'events',
    timestamp: '1 day ago',
    read: false,
    eventId: 'evt-3'
  },
  {
    id: 'notif-4',
    title: 'Semester Midterm Repository Archive',
    message: 'All department past exams from 2024–2025 have been indexed into the archive repository.',
    category: 'system',
    timestamp: '3 days ago',
    read: true
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<'resources' | 'events' | 'workspace'>('resources');
  const [eventViewMode, setEventViewMode] = useState<'list' | 'calendar'>('list');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // State Collections
  const [resources, setResources] = useState<AcademicResource[]>(INITIAL_RESOURCES);
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [notifications, setNotifications] = useState<CampusNotification[]>(INITIAL_NOTIFICATIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedFileType, setSelectedFileType] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'downloads'>('popular');

  // Event Filters
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('All');

  // Modals & Drawers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<AcademicResource | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'events' | 'uploads' | 'rsvp'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States for Upload Material
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    courseCode: '',
    courseName: '',
    department: 'Computer Science',
    semester: 'Fall 2026',
    topicTags: '',
    fileType: 'pdf' as FileType,
    description: '',
    sampleSnippet: ''
  });

  // Form States for Create Event
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    category: 'Hackathon' as EventCategory,
    department: 'Computer Science Club',
    date: '',
    time: '',
    venueOrLink: '',
    locationType: 'In-Person' as 'In-Person' | 'Virtual' | 'Hybrid',
    rsvpCapacity: 100,
    tags: ''
  });

  // Sync Dark Mode class with root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toast Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // ==========================================
  // HANDLERS
  // ==========================================

  // Upvote Resource
  const handleToggleUpvote = (id: string) => {
    setResources(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextIsUpvoted = !item.isUpvoted;
          return {
            ...item,
            isUpvoted: nextIsUpvoted,
            upvotes: nextIsUpvoted ? item.upvotes + 1 : item.upvotes - 1
          };
        }
        return item;
      })
    );
  };

  // Bookmark Resource
  const handleToggleBookmark = (id: string) => {
    setResources(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextSaved = !item.isBookmarked;
          showToast(nextSaved ? 'Saved note to your workspace' : 'Removed note from bookmarks');
          return {
            ...item,
            isBookmarked: nextSaved
          };
        }
        return item;
      })
    );
  };

  // Download Simulation
  const handleDownload = (resource: AcademicResource) => {
    setResources(prev =>
      prev.map(item => (item.id === resource.id ? { ...item, downloadsCount: item.downloadsCount + 1 } : item))
    );
    showToast(`Downloading "${resource.title}.${resource.fileType}" (${resource.fileSize})`);
  };

  // RSVP Event
  const handleToggleRSVP = (id: string) => {
    setEvents(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextRsvp = !item.isRsvp;
          if (nextRsvp) {
            showToast(`RSVP Confirmed for "${item.title}"`);
            // Add notification
            const newNotif: CampusNotification = {
              id: `notif-${Date.now()}`,
              title: `RSVP Confirmed`,
              message: `You are registered for ${item.title}. We've saved the schedule to your dashboard.`,
              category: 'rsvp',
              timestamp: 'Just now',
              read: false,
              eventId: item.id
            };
            setNotifications(n => [newNotif, ...n]);
          } else {
            showToast(`RSVP Cancelled for "${item.title}"`);
          }
          return {
            ...item,
            isRsvp: nextRsvp,
            rsvpCount: nextRsvp ? item.rsvpCount + 1 : Math.max(0, item.rsvpCount - 1)
          };
        }
        return item;
      })
    );
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Submit Upload Material
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.title.trim() || !uploadFormData.courseCode.trim()) {
      showToast('Please provide a course code and document title.');
      return;
    }

    const tagsArray = uploadFormData.topicTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newResource: AcademicResource = {
      id: `res-${Date.now()}`,
      title: uploadFormData.title,
      description: uploadFormData.description || 'Shared student study notes and preparation guide.',
      courseCode: uploadFormData.courseCode.toUpperCase(),
      courseName: uploadFormData.courseName || `${uploadFormData.courseCode.toUpperCase()} Core Materials`,
      department: uploadFormData.department,
      semester: uploadFormData.semester,
      topicTags: tagsArray.length > 0 ? tagsArray : ['Study Notes', 'Core Exam'],
      fileType: uploadFormData.fileType,
      fileSize: '3.4 MB',
      pagesCount: 16,
      uploadedBy: userProfile.name,
      uploadedAt: 'Just now',
      upvotes: 1,
      isUpvoted: true,
      isBookmarked: true,
      downloadsCount: 1,
      previewSnippet: uploadFormData.sampleSnippet || 'Verified student notes uploaded for community review.'
    };

    setResources(prev => [newResource, ...prev]);
    setUserProfile(prev => ({
      ...prev,
      reputationPoints: prev.reputationPoints + 25
    }));

    // Add alert
    const newNotif: CampusNotification = {
      id: `notif-${Date.now()}`,
      title: `Material Uploaded Successfully`,
      message: `Your resource "${newResource.title}" is now indexed in ${newResource.courseCode}.`,
      category: 'uploads',
      timestamp: 'Just now',
      read: false,
      resourceId: newResource.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    setIsUploadModalOpen(false);
    showToast('Resource uploaded! +25 reputation points earned.');

    // Reset Form
    setUploadFormData({
      title: '',
      courseCode: '',
      courseName: '',
      department: 'Computer Science',
      semester: 'Fall 2026',
      topicTags: '',
      fileType: 'pdf',
      description: '',
      sampleSnippet: ''
    });
  };

  // Submit Create Event
  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.title.trim() || !eventFormData.date.trim()) {
      showToast('Please provide event title, date, and venue.');
      return;
    }

    const tagsArray = eventFormData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newEvent: CampusEvent = {
      id: `evt-${Date.now()}`,
      title: eventFormData.title,
      description: eventFormData.description || 'Campus student-led initiative open to all students.',
      category: eventFormData.category,
      department: eventFormData.department,
      date: eventFormData.date,
      time: eventFormData.time || '05:00 PM EST',
      venueOrLink: eventFormData.venueOrLink || 'Student Activity Center',
      locationType: eventFormData.locationType,
      organizer: userProfile.name,
      tags: tagsArray.length > 0 ? tagsArray : ['Student Led', 'Tech Meetup'],
      rsvpCount: 1,
      rsvpCapacity: Number(eventFormData.rsvpCapacity) || 100,
      isRsvp: true,
      featured: false
    };

    setEvents(prev => [newEvent, ...prev]);

    // Add notification
    const newNotif: CampusNotification = {
      id: `notif-${Date.now()}`,
      title: `Event Announcement Published`,
      message: `Your event "${newEvent.title}" is live on the Campus Events board.`,
      category: 'events',
      timestamp: 'Just now',
      read: false,
      eventId: newEvent.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    setIsCreateEventModalOpen(false);
    showToast('Event created and published to campus calendar!');

    // Reset Form
    setEventFormData({
      title: '',
      description: '',
      category: 'Hackathon',
      department: 'Computer Science Club',
      date: '',
      time: '',
      venueOrLink: '',
      locationType: 'In-Person',
      rsvpCapacity: 100,
      tags: ''
    });
  };

  // Open Preview Modal
  const handleOpenPreview = (resource: AcademicResource) => {
    setPreviewResource(resource);
    setIsPreviewModalOpen(true);
  };

  // ==========================================
  // COMPUTED / FILTERED LISTS
  // ==========================================

  // Filtered Resources
  const filteredResources = useMemo(() => {
    return resources
      .filter(item => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCode = item.courseCode.toLowerCase().includes(q);
          const matchCourse = item.courseName.toLowerCase().includes(q);
          const matchAuthor = item.uploadedBy.toLowerCase().includes(q);
          const matchTag = item.topicTags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchCode && !matchCourse && !matchAuthor && !matchTag) {
            return false;
          }
        }
        // Department filter
        if (selectedDepartment !== 'All' && item.department !== selectedDepartment) {
          return false;
        }
        // File Type filter
        if (selectedFileType !== 'All' && item.fileType.toLowerCase() !== selectedFileType.toLowerCase()) {
          return false;
        }
        // Semester filter
        if (selectedSemester !== 'All' && item.semester !== selectedSemester) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.upvotes - a.upvotes;
        if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
        return 0; // default initial order
      });
  }, [resources, searchQuery, selectedDepartment, selectedFileType, selectedSemester, sortBy]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(item => {
      if (eventCategoryFilter !== 'All' && item.category !== eventCategoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchDept = item.department.toLowerCase().includes(q);
        const matchTag = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchDept && !matchTag) return false;
      }
      return true;
    });
  }, [events, eventCategoryFilter, searchQuery]);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    if (notificationFilter === 'all') return notifications;
    return notifications.filter(n => n.category === notificationFilter);
  }, [notifications, notificationFilter]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Quick stats computed
  const myUploads = useMemo(() => {
    return resources.filter(r => r.uploadedBy === userProfile.name);
  }, [resources, userProfile.name]);

  const myBookmarks = useMemo(() => {
    return resources.filter(r => r.isBookmarked);
  }, [resources]);

  const myRsvps = useMemo(() => {
    return events.filter(e => e.isRsvp);
  }, [events]);

  const departmentList = ['All', 'Computer Science', 'Artificial Intelligence', 'Mathematics', 'Physics', 'Electrical Eng'];
  const fileTypeList = ['All', 'PDF', 'DOCX', 'Slides', 'ZIP'];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col antialiased transition-colors duration-200">
      {/* Toast Bar */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-lg shadow-lg text-sm font-medium border border-neutral-700/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR (Strict Top Bar Contract: 3 Zones) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setActiveTab('resources');
              }}
              className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors"
            >
              UniPulse
            </a>
          </div>

          {/* Zone 2: Navigation Links (Single-Line Prose) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <button
              onClick={() => setActiveTab('resources')}
              className={`hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'resources'
                  ? 'border-indigo-600 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Academic Repository
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'events'
                  ? 'border-indigo-600 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Tech & Campus Events
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              className={`hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'workspace'
                  ? 'border-indigo-600 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'border-transparent'
              }`}
            >
              My Workspace
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle theme"
              className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell with Dynamic Drawer */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Notifications"
                className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>

              {/* Notification Drawer Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                          ({unreadCount} new)
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Filter tabs */}
                  <div className="flex gap-1 py-2 text-xs border-b border-neutral-100 dark:border-neutral-800">
                    {(['all', 'events', 'uploads', 'rsvp'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNotificationFilter(cat)}
                        className={`px-2 py-1 rounded capitalize transition-colors ${
                          notificationFilter === cat
                            ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Feed Items */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 mt-2">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-neutral-400">
                        No notifications in this category.
                      </div>
                    ) : (
                      filteredNotifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`py-3 px-1 text-xs transition-colors ${
                            !notif.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {notif.title}
                            </span>
                            <span className="text-neutral-400 text-[11px] whitespace-nowrap">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Share Notes</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 bg-neutral-50 dark:bg-neutral-900 text-xs font-medium justify-around">
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-1 ${activeTab === 'resources' ? 'text-indigo-600 font-bold' : 'text-neutral-500'}`}
          >
            Academic
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-1 ${activeTab === 'events' ? 'text-indigo-600 font-bold' : 'text-neutral-500'}`}
          >
            Tech Events
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`py-1 ${activeTab === 'workspace' ? 'text-indigo-600 font-bold' : 'text-neutral-500'}`}
          >
            My Workspace
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================
            TAB 1: ACADEMIC RESOURCE HUB
        ======================================================== */}
        {activeTab === 'resources' && (
          <section className="space-y-8">
            {/* Hero / Header Lead */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Academic Study Repository
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
                  Peer-reviewed lecture notes, exam cheatsheets, problem sets, and syllabus study guides across university engineering and sciences.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>
            </div>

            {/* Filter & Instant Search Strip */}
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by course code (e.g. CS 440), topic, or instructor..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 whitespace-nowrap">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 py-2 px-3 rounded-lg font-medium text-neutral-700 dark:text-neutral-300 focus:outline-hidden"
                  >
                    <option value="popular">Most Upvoted</option>
                    <option value="downloads">Most Downloaded</option>
                    <option value="recent">Latest Uploads</option>
                  </select>
                </div>
              </div>

              {/* Department & Format Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-neutral-400 font-medium">Department:</span>
                <div className="flex flex-wrap gap-1">
                  {departmentList.map(dept => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDepartment(dept)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        selectedDepartment === dept
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>

                <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-2 hidden sm:block" />

                <span className="text-neutral-400 font-medium">Format:</span>
                <div className="flex gap-1">
                  {fileTypeList.map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFileType(fmt)}
                      className={`px-2 py-1 rounded-md transition-colors ${
                        selectedFileType === fmt
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Stats Count */}
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
              <span>Showing {filteredResources.length} verified academic resources</span>
              {selectedDepartment !== 'All' && <span>Filtered by: {selectedDepartment}</span>}
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8">
                <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  No study resources matched your criteria
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, selecting "All Departments", or be the first to upload notes for this course.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDepartment('All');
                    setSelectedFileType('All');
                  }}
                  className="mt-4 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => (
                  <article
                    key={resource.id}
                    className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-shadow shadow-xs hover:shadow-md"
                  >
                    <div>
                      {/* Zero-Pill Unboxed Course & File Metadata */}
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                          <span>{resource.courseCode}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-sans font-normal text-neutral-500 dark:text-neutral-400">
                            {resource.department}
                          </span>
                        </div>
                        <span className="uppercase text-[11px] tracking-wider font-semibold text-neutral-600 dark:text-neutral-400">
                          {resource.fileType}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => handleOpenPreview(resource)}
                        className="text-base font-semibold text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors line-clamp-2 leading-snug"
                      >
                        {resource.title}
                      </h3>

                      {/* Brief Excerpt */}
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                        {resource.description}
                      </p>

                      {/* Tags as quiet inline text */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                        {resource.topicTags.map((tag, idx) => (
                          <span key={tag}>
                            #{tag}
                            {idx < resource.topicTags.length - 1 && <span className="ml-2 text-neutral-300 dark:text-neutral-700">·</span>}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata & Interactivity */}
                    <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                        <span>by {resource.uploadedBy}</span>
                        <div className="flex items-center gap-2 tabular-nums">
                          <span>{resource.fileSize}</span>
                          <span aria-hidden="true">·</span>
                          <span>{resource.pagesCount} pgs</span>
                        </div>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Upvote Button */}
                        <button
                          onClick={() => handleToggleUpvote(resource.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            resource.isUpvoted
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{resource.upvotes}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {/* Bookmark Button */}
                          <button
                            onClick={() => handleToggleBookmark(resource.id)}
                            aria-label="Bookmark"
                            className={`p-2 rounded-lg text-xs transition-colors ${
                              resource.isBookmarked
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? 'fill-current' : ''}`} />
                          </button>

                          {/* Quick Preview Button */}
                          <button
                            onClick={() => handleOpenPreview(resource)}
                            aria-label="Preview"
                            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Download Button */}
                          <button
                            onClick={() => handleDownload(resource)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Get</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            TAB 2: TECH & CAMPUS EVENTS BOARD
        ======================================================== */}
        {activeTab === 'events' && (
          <section className="space-y-8">
            {/* Header & View Mode Switch */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Tech & Campus Events Board
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
                  Student-led hackathons, AI architecture demos, developer workshops, and campus technical sessions.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* View toggle (List vs Calendar) */}
                <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setEventViewMode('list')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      eventViewMode === 'list'
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setEventViewMode('calendar')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      eventViewMode === 'calendar'
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Calendar Agenda
                  </button>
                </div>

                {/* Create Event CTA */}
                <button
                  onClick={() => setIsCreateEventModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Host Event</span>
                </button>
              </div>
            </div>

            {/* Category Segmented Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Hackathon', 'Workshop', 'AI Demo', 'Coding Contest', 'Guest Talk'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setEventCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      eventCategoryFilter === cat
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                {filteredEvents.length} events scheduled
              </div>
            </div>

            {/* LIST VIEW */}
            {eventViewMode === 'list' && (
              <div className="space-y-4">
                {filteredEvents.map(event => {
                  const capacityPercent = Math.min(100, Math.round((event.rsvpCount / event.rsvpCapacity) * 100));
                  return (
                    <div
                      key={event.id}
                      className={`bg-white dark:bg-neutral-900 rounded-xl border ${
                        event.featured
                          ? 'border-indigo-300 dark:border-indigo-800/80 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800'
                      } p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all`}
                    >
                      {/* Left: Date badge + Details */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Compact Date Box */}
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center text-center shrink-0 border border-neutral-200 dark:border-neutral-700">
                          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                            {event.date.split(' ')[0]}
                          </span>
                          <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                            {event.date.split(' ')[1]?.replace(',', '')}
                          </span>
                        </div>

                        {/* Title, Category & Description */}
                        <div className="space-y-1.5 flex-1">
                          {/* Unboxed Metadata Line */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                              {event.category}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{event.department}</span>
                            <span aria-hidden="true">·</span>
                            <span>{event.locationType}</span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {event.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
                            {event.description}
                          </p>

                          {/* Time, Venue & Organizer */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                              {event.venueOrLink}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-neutral-400" />
                              Organized by {event.organizer}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: RSVP Counter & Action */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800 shrink-0">
                        {/* Capacity meter */}
                        <div className="text-right">
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                              {event.rsvpCount}
                            </span>{' '}
                            / {event.rsvpCapacity} RSVPs
                          </div>
                          <div className="w-32 bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full ${
                                capacityPercent >= 90 ? 'bg-amber-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${capacityPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Interactive RSVP Action */}
                        <button
                          onClick={() => handleToggleRSVP(event.id)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                            event.isRsvp
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-xs'
                          }`}
                        >
                          {event.isRsvp ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>RSVP Confirmed</span>
                            </>
                          ) : (
                            <span>Claim RSVP Spot</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CALENDAR AGENDA VIEW */}
            {eventViewMode === 'calendar' && (
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      November 2026 Academic Calendar
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Synchronized university tech events and hackathons schedule
                    </p>
                  </div>
                  <div className="text-xs text-neutral-400">Timezone: America/New_York (EST)</div>
                </div>

                {/* Calendar Days Agenda Strip */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { day: 'Wed, Nov 12', title: 'Local LLMs with Ollama', type: 'Workshop', time: '4:00 PM' },
                    { day: 'Sat, Nov 15', title: 'Graph Theory Sprint', type: 'Contest', time: '2:00 PM' },
                    { day: 'Tue, Nov 18', title: 'Autonomous Drone Swarm', type: 'AI Demo', time: '1:00 PM' },
                    { day: 'Fri, Nov 20', title: 'HackCampus 2026 Kickoff', type: 'Hackathon', time: '6:00 PM' }
                  ].map(slot => (
                    <div
                      key={slot.day}
                      className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-200">{slot.day}</span>
                        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">{slot.type}</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{slot.title}</h4>
                      <p className="text-xs text-neutral-500">{slot.time} EST</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                    <CalendarCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Sync calendar feed with Google Calendar or Apple iCal via .ics format</span>
                  </div>
                  <button
                    onClick={() => showToast('Calendar subscription link copied to clipboard')}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Copy Subscription URL
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            TAB 3: USER WORKSPACE & DASHBOARD
        ======================================================== */}
        {activeTab === 'workspace' && (
          <section className="space-y-8">
            {/* User Profile Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xl">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      {userProfile.name}
                    </h2>
                    <span className="text-xs font-mono text-neutral-400">{userProfile.handle}</span>
                  </div>
                  {/* Unboxed details */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span>{userProfile.department}</span>
                    <span aria-hidden="true">·</span>
                    <span>{userProfile.semester}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{userProfile.studentId}</span>
                  </div>
                </div>
              </div>

              {/* Reputation & Contributor Tier */}
              <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-950 px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <div className="text-right">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Community Score</div>
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {userProfile.reputationPoints} pts
                  </div>
                </div>
                <div className="w-px h-8 bg-neutral-200 dark:border-neutral-700" />
                <div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Status</div>
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {userProfile.badge}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar (Tabular Numerals) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>My Document Uploads</span>
                  <FileText className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {myUploads.length}
                </div>
                <p className="text-xs text-neutral-400">Shared with department peers</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Saved Notes</span>
                  <BookMarked className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {myBookmarks.length}
                </div>
                <p className="text-xs text-neutral-400">Available offline & for exam review</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Upcoming RSVPs</span>
                  <CalendarCheck className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {myRsvps.length}
                </div>
                <p className="text-xs text-neutral-400">Hackathons & sessions registered</p>
              </div>
            </div>

            {/* Subscribed Courses & Bookmarked Notes Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Bookmarked Resources */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Bookmarked Study Notes
                  </h3>
                  <span className="text-xs text-neutral-500 tabular-nums">{myBookmarks.length} saved</span>
                </div>

                <div className="space-y-3">
                  {myBookmarks.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-6 text-center">
                      No bookmarks saved yet. Click the bookmark icon on any resource card.
                    </p>
                  ) : (
                    myBookmarks.map(res => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                            {res.courseCode} · {res.fileType.toUpperCase()}
                          </div>
                          <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {res.title}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenPreview(res)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownload(res)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right: Active RSVPs */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    My RSVP'd Tech Events
                  </h3>
                  <span className="text-xs text-neutral-500 tabular-nums">{myRsvps.length} active</span>
                </div>

                <div className="space-y-3">
                  {myRsvps.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-6 text-center">
                      You haven't RSVP'd to any events yet. Check the Tech & Campus Events board.
                    </p>
                  ) : (
                    myRsvps.map(evt => (
                      <div
                        key={evt.id}
                        className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] text-neutral-400">
                            {evt.date} · {evt.time}
                          </div>
                          <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {evt.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 truncate">{evt.venueOrLink}</div>
                        </div>

                        <button
                          onClick={() => handleToggleRSVP(evt.id)}
                          className="px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 border border-neutral-200 dark:border-neutral-700 rounded-md transition-colors whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ========================================================
          MODAL 1: UPLOAD STUDY NOTES
      ======================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Share Course Study Materials
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Upload lecture notes, synthesis cheatsheets, or lab guides to help peers in your department.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS 440"
                    value={uploadFormData.courseCode}
                    onChange={e => setUploadFormData({ ...uploadFormData, courseCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Operating Systems"
                    value={uploadFormData.courseName}
                    onChange={e => setUploadFormData({ ...uploadFormData, courseName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raft Consensus & State Machine Replication Synthesis"
                  value={uploadFormData.title}
                  onChange={e => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Department
                  </label>
                  <select
                    value={uploadFormData.department}
                    onChange={e => setUploadFormData({ ...uploadFormData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Electrical Eng">Electrical Eng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={uploadFormData.semester}
                    onChange={e => setUploadFormData({ ...uploadFormData, semester: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2026">Spring 2026</option>
                    <option value="Summer 2026">Summer 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    File Format
                  </label>
                  <select
                    value={uploadFormData.fileType}
                    onChange={e => setUploadFormData({ ...uploadFormData, fileType: e.target.value as FileType })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="slides">Presentation Slides</option>
                    <option value="zip">Source / ZIP Archive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Topic Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Consensus, Raft, Fault Tolerance, Midterm Prep"
                  value={uploadFormData.topicTags}
                  onChange={e => setUploadFormData({ ...uploadFormData, topicTags: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Description & Key Takeaways
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of what these notes cover, syllabus sections, or problem sets solved..."
                  value={uploadFormData.description}
                  onChange={e => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              {/* Simulated Dropzone */}
              <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-5 text-center bg-neutral-50/50 dark:bg-neutral-950/50">
                <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Drag and drop files here, or browse files
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Supports PDF, DOCX, PPTX, ZIP up to 50 MB
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CREATE EVENT ANNOUNCEMENT
      ======================================================== */}
      {isCreateEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateEventModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Publish Campus Tech Event
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Announce hackathons, coding workshops, AI demos, or club meetups to the entire university community.
              </p>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Edge AI & Robotics Hackathon 2026"
                  value={eventFormData.title}
                  onChange={e => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Event Category
                  </label>
                  <select
                    value={eventFormData.category}
                    onChange={e => setEventFormData({ ...eventFormData, category: e.target.value as EventCategory })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="AI Demo">AI Demo</option>
                    <option value="Coding Contest">Coding Contest</option>
                    <option value="Guest Talk">Guest Talk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Hosting Organization / Club
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ACM Student Chapter"
                    value={eventFormData.department}
                    onChange={e => setEventFormData({ ...eventFormData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Date & Schedule *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nov 28, 2026"
                    value={eventFormData.date}
                    onChange={e => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 05:00 PM - 08:30 PM EST"
                    value={eventFormData.time}
                    onChange={e => setEventFormData({ ...eventFormData, time: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Venue or Meeting Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Turing Hall Auditorium or Discord"
                    value={eventFormData.venueOrLink}
                    onChange={e => setEventFormData({ ...eventFormData, venueOrLink: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Attendance Format
                  </label>
                  <select
                    value={eventFormData.locationType}
                    onChange={e => setEventFormData({ ...eventFormData, locationType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Event Description & Registration Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the event schedule, target audience, prerequisites, prize pool, or refreshments..."
                  value={eventFormData.description}
                  onChange={e => setEventFormData({ ...eventFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateEventModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: RESOURCE PREVIEW MODAL
      ======================================================== */}
      {isPreviewModalOpen && previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] flex flex-col justify-between">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              {/* Top info */}
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                <span>{previewResource.courseCode}</span>
                <span aria-hidden="true">·</span>
                <span className="font-sans font-normal text-neutral-500">{previewResource.department}</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase">{previewResource.fileType}</span>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {previewResource.title}
              </h2>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2">
                {previewResource.description}
              </p>

              {/* Document Sample Preview Box */}
              <div className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-200 space-y-2 whitespace-pre-wrap max-h-56 overflow-y-auto">
                <div className="text-[11px] text-neutral-400 font-sans border-b border-neutral-200 dark:border-neutral-800 pb-1">
                  Document Excerpt Preview · Page 1 of {previewResource.pagesCount}
                </div>
                {previewResource.previewSnippet}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4 text-xs text-neutral-500">
                {previewResource.topicTags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-500">
                Uploaded by {previewResource.uploadedBy} · {previewResource.downloadsCount} total downloads
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleBookmark(previewResource.id)}
                  className="px-3 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {previewResource.isBookmarked ? 'Bookmarked' : 'Save to Workspace'}
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewResource);
                    setIsPreviewModalOpen(false);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">UniPulse Hub</span>
            <span aria-hidden="true">·</span>
            <span>University Academic Collaboration & Event Network</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:underline">Honor Code</a>
            <a href="#guidelines" className="hover:underline">Repository Guidelines</a>
            <a href="#support" className="hover:underline">Student Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
