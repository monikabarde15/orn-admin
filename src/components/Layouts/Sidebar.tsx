import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import React, { useEffect } from 'react';

import IconCaretsDown from '../Icon/IconCaretsDown';
import IconMinus from '../Icon/IconMinus';

import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';

import IconSettings from '../Icon/IconSettings';
import IconBox from '../Icon/IconBox';
import IconBlogs from '../Icon/IconBlogs';

import IconUser from '../Icon/IconUser';
import IconUsers from '../Icon/IconUsers';
import IconMessage2 from '../Icon/IconMessage2';

import IconOpenBook from '../Icon/IconOpenBook';
import IconDollarSign from '../Icon/IconDollarSign';
import IconBellBing from '../Icon/IconBellBing';

interface MenuItem {
    label?: string;
    icon?: any;
    path?: string;
    items?: MenuItem[];
    sectionLabel?: string;
}

const Sidebar = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);

    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const usern = JSON.parse(localStorage.getItem('user') || '{}');

    const role = usern?.accountType || '';

    useEffect(() => {
        const selector = document.querySelector(
            '.sidebar ul a[href="' + window.location.pathname + '"]'
        );

        if (selector) {
            selector.classList.add('active');
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    // =========================================================
    // ================= ROLE BASED SIDEBAR ====================
    // =========================================================

    let menuItems: MenuItem[] = [];

    // =========================================================
    // ======================= ADMIN ===========================
    // =========================================================

    if (role === 'Admin') {
        menuItems = [
            {
                sectionLabel: 'Core Dashboard',
                items: [
                    {
                        path: '/index',
                        label: 'Dashboard',
                        icon: IconMenuDashboard,
                    },
                    // {
                    //     path: '/analytics-reports',
                    //     label: 'Analytics & Reports',
                    //     icon: IconBox,
                    // },
                    // {
                    //     path: '/notifications-center',
                    //     label: 'Notifications Center',
                    //     icon: IconBellBing,
                    // },
                ],
            },

            {
                sectionLabel: 'User Management',
                items: [
                    // {
                    //     path: '/candidates',
                    //     label: 'Candidates / Consultants',
                    //     icon: IconUsers,
                    // },
                    {
                        path: '/students',
                        label: 'Students',
                        icon: IconUsers,
                    },
                    // {
                    //     path: '/recruiters',
                    //     label: 'Recruiters',
                    //     icon: IconUsers,
                    // },
                    // {
                    //     path: '/trainers',
                    //     label: 'Trainers & Mentors',
                    //     icon: IconUsers,
                    // },
                    // {
                    //     path: '/enterprise-clients',
                    //     label: 'Enterprise Clients',
                    //     icon: IconUsers,
                    // },
                    // {
                    //     path: '/admin-management',
                    //     label: 'Admin Management',
                    //     icon: IconUser,
                    // },
                    // {
                    //     path: '/roles-permissions',
                    //     label: 'Roles & Permissions',
                    //     icon: IconSettings,
                    // },
                ],
            },

            // {
            //     sectionLabel: 'Candidate Intelligence',
            //     items: [
            //         {
            //             path: '/candidate-assessments',
            //             label: 'Candidate Assessments',
            //             icon: IconMenuNotes,
            //         },
            //         {
            //             path: '/ai-assessment-scores',
            //             label: 'AI Assessment Scores',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/skill-gap-analysis',
            //             label: 'Skill Gap Analysis',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/employability-scoring',
            //             label: 'Employability Scoring',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/readiness-status',
            //             label: 'Readiness Status Management',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/skill-passport',
            //             label: 'Skill Passport Management',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/candidate-verification',
            //             label: 'Candidate Verification',
            //             icon: IconBox,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'CV & Resume Intelligence',
            //     items: [
            //         {
            //             path: '/cv-parser',
            //             label: 'CV Parser Management',
            //             icon: IconBlogs,
            //         },
            //         {
            //             path: '/masked-cv',
            //             label: 'Masked CV Management',
            //             icon: IconBlogs,
            //         },
            //         {
            //             path: '/resume-builder',
            //             label: 'Resume Builder',
            //             icon: IconBlogs,
            //         },
            //         {
            //             path: '/ats-optimization',
            //             label: 'ATS Optimization Engine',
            //             icon: IconBlogs,
            //         },
            //         {
            //             path: '/resume-review',
            //             label: 'Resume Review Queue',
            //             icon: IconBlogs,
            //         },
            //     ],
            // },

            {
                sectionLabel: 'LMS & Learning Ecosystem',
                items: [
                    {
                        path: '/courses',
                        label: 'Course Management',
                        icon: IconOpenBook,
                    },
                    // {
                    //     path: '/learning-paths',
                    //     label: 'Learning Paths',
                    //     icon: IconOpenBook,
                    // },
                    // {
                    //     path: '/course-categories',
                    //     label: 'Course Categories',
                    //     icon: IconBlogs,
                    // },
                    // {
                    //     path: '/modules',
                    //     label: 'Module Management',
                    //     icon: IconMenuTodo,
                    // },
                    // {
                    //     path: '/certifications',
                    //     label: 'Certifications',
                    //     icon: IconBox,
                    // },
                    // {
                    //     path: '/assessments',
                    //     label: 'Assessments & Quizzes',
                    //     icon: IconMenuNotes,
                    // },
                    // {
                    //     path: '/coding-labs',
                    //     label: 'Coding Labs',
                    //     icon: IconBox,
                    // },
                    // {
                    //     path: '/assignments',
                    //     label: 'Assignments',
                    //     icon: IconMenuTodo,
                    // },
                    // {
                    //     path: '/live-training',
                    //     label: 'Live Training Sessions',
                    //     icon: IconBellBing,
                    // },
                    // {
                    //     path: '/recorded-sessions',
                    //     label: 'Recorded Sessions',
                    //     icon: IconBellBing,
                    // },
                ],
            },

            // {
            //     sectionLabel: 'AI Upskilling Engine',
            //     items: [
            //         {
            //             path: '/ai-recommendations',
            //             label: 'AI Recommendations',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/upskilling-engine',
            //             label: 'Upskilling Engine',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/career-path-engine',
            //             label: 'Career Path Engine',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/ai-mentor',
            //             label: 'AI Mentor Management',
            //             icon: IconUser,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'Realtime Projects & Simulations',
            //     items: [
            //         {
            //             path: '/realtime-projects',
            //             label: 'Realtime Projects',
            //             icon: IconMenuScrumboard,
            //         },
            //         {
            //             path: '/industry-simulations',
            //             label: 'Industry Simulations',
            //             icon: IconMenuScrumboard,
            //         },
            //         {
            //             path: '/project-assignments',
            //             label: 'Project Assignments',
            //             icon: IconMenuTodo,
            //         },
            //         {
            //             path: '/team-collaboration',
            //             label: 'Team Collaboration',
            //             icon: IconUsers,
            //         },
            //         {
            //             path: '/project-evaluations',
            //             label: 'Project Evaluations',
            //             icon: IconBox,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'Recruiter Intelligence',
            //     items: [
            //         {
            //             path: '/recruiter-dashboard',
            //             label: 'Recruiter Dashboard',
            //             icon: IconUsers,
            //         },
            //         {
            //             path: '/job-opportunities',
            //             label: 'Job Opportunities',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/hiring-requests',
            //             label: 'Hiring Requests',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/ai-match-engine',
            //             label: 'AI Match Engine',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/candidate-ranking',
            //             label: 'Candidate Ranking',
            //             icon: IconBox,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'Placement & Hiring',
            //     items: [
            //         {
            //             path: '/placement-pipeline',
            //             label: 'Placement Pipeline',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/interview-coordination',
            //             label: 'Interview Coordination',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/mock-interviews',
            //             label: 'Mock Interviews',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/placement-readiness',
            //             label: 'Placement Readiness',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/offer-management',
            //             label: 'Offer Management',
            //             icon: IconDollarSign,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'Marketplace & Visibility',
            //     items: [
            //         {
            //             path: '/talent-marketplace',
            //             label: 'Talent Marketplace',
            //             icon: IconUsers,
            //         },
            //         {
            //             path: '/candidate-visibility',
            //             label: 'Candidate Visibility Controls',
            //             icon: IconUser,
            //         },
            //         {
            //             path: '/featured-talent',
            //             label: 'Featured Talent',
            //             icon: IconUsers,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'Communication & Engagement',
            //     items: [
            //         {
            //             path: '/email-campaigns',
            //             label: 'Email Campaigns',
            //             icon: IconMessage2,
            //         },
            //         {
            //             path: '/sms-whatsapp',
            //             label: 'SMS / WhatsApp Notifications',
            //             icon: IconBellBing,
            //         },
            //         {
            //             path: '/announcements',
            //             label: 'Announcements',
            //             icon: IconBellBing,
            //         },
            //         {
            //             path: '/community-forums',
            //             label: 'Community & Discussion Forums',
            //             icon: IconUsers,
            //         },
            //         {
            //             path: '/support-tickets',
            //             label: 'Support Tickets',
            //             icon: IconMessage2,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'Finance & Subscription',
            //     items: [
            //         {
            //             path: '/subscription-plans',
            //             label: 'Subscription Plans',
            //             icon: IconDollarSign,
            //         },
            //         {
            //             path: '/payments-billing',
            //             label: 'Payments & Billing',
            //             icon: IconDollarSign,
            //         },
            //         {
            //             path: '/invoice-management',
            //             label: 'Invoice Management',
            //             icon: IconDollarSign,
            //         },
            //         {
            //             path: '/revenue-analytics',
            //             label: 'Revenue Analytics',
            //             icon: IconDollarSign,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'Reports & Intelligence',
            //     items: [
            //         {
            //             path: '/placement-reports',
            //             label: 'Placement Reports',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/recruiter-analytics',
            //             label: 'Recruiter Analytics',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/skill-demand',
            //             label: 'Skill Demand Analytics',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/course-performance',
            //             label: 'Course Performance Reports',
            //             icon: IconBox,
            //         },
            //     ],
            // },

            // {
            //     sectionLabel: 'System Configuration',
            //     items: [
            //         {
            //             path: '/platform-settings',
            //             label: 'Platform Settings',
            //             icon: IconSettings,
            //         },
            //         {
            //             path: '/api-integrations',
            //             label: 'API Integrations',
            //             icon: IconSettings,
            //         },
            //         {
            //             path: '/security-audit',
            //             label: 'Security & Audit Logs',
            //             icon: IconSettings,
            //         },
            //         {
            //             path: '/backup-recovery',
            //             label: 'Data Backup & Recovery',
            //             icon: IconSettings,
            //         },
            //         {
            //             path: '/branding',
            //             label: 'Branding & White Label',
            //             icon: IconSettings,
            //         },
            //     ],
            // },
        ];
    }

    // ================= STUDENT =================

    else if (role === 'Student') {
        menuItems = [
            {
                sectionLabel: 'Student Dashboard',
                items: [
                    {
                        path: '/index/overview',
                        label: 'Dashboard',
                        icon: IconMenuDashboard,
                    },
                ],
            },

            {
                sectionLabel: 'Learning',
                items: [
                    {
                        path: '/my-courses',
                        label: 'My Courses',
                        icon: IconOpenBook,
                    },
                    // {
                    //     path: '/learning-paths',
                    //     label: 'Learning Paths',
                    //     icon: IconOpenBook,
                    // },
                    // {
                    //     path: '/assignments',
                    //     label: 'Assignments',
                    //     icon: IconMenuTodo,
                    // },
                    // {
                    //     path: '/assessments',
                    //     label: 'Assessments',
                    //     icon: IconMenuNotes,
                    // },
                    // {
                    //     path: '/certificates',
                    //     label: 'Certificates',
                    //     icon: IconBox,
                    // },
                ],
            },

            // {
            //     sectionLabel: 'Career',
            //     items: [
            //         {
            //             path: '/job-opportunities',
            //             label: 'Job Opportunities',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/mock-interviews',
            //             label: 'Mock Interviews',
            //             icon: IconBox,
            //         },
            //         {
            //             path: '/placement-readiness',
            //             label: 'Placement Readiness',
            //             icon: IconBox,
            //         },
            //     ],
            // },

            {
                sectionLabel: 'Profile',
                items: [
                    {
                        path: '/users/profile',
                        label: 'My Profile',
                        icon: IconUser,
                    },
                        // {
                        //     path: '/notifications',
                        //     label: 'Notifications',
                        //     icon: IconBellBing,
                        // },
                ],
            },
        ];
    }

    // ================= TRAINER =================

    else if (role === 'Trainer') {
        menuItems = [
            {
                sectionLabel: 'Trainer Dashboard',
                items: [
                    {
                        path: '/trainer-dashboard',
                        label: 'Dashboard',
                        icon: IconMenuDashboard,
                    },
                ],
            },

            {
                sectionLabel: 'Course Management',
                items: [
                    {
                        path: '/trainer-courses',
                        label: 'Manage Courses',
                        icon: IconOpenBook,
                    },
                    {
                        path: '/modules',
                        label: 'Modules',
                        icon: IconMenuTodo,
                    },
                    {
                        path: '/assignments',
                        label: 'Assignments',
                        icon: IconMenuTodo,
                    },
                    {
                        path: '/assessments',
                        label: 'Assessments',
                        icon: IconMenuNotes,
                    },
                ],
            },

            {
                sectionLabel: 'Students',
                items: [
                    {
                        path: '/students',
                        label: 'Students',
                        icon: IconUsers,
                    },
                    {
                        path: '/student-progress',
                        label: 'Student Progress',
                        icon: IconBox,
                    },
                ],
            },

            {
                sectionLabel: 'Sessions',
                items: [
                    {
                        path: '/live-sessions',
                        label: 'Live Sessions',
                        icon: IconBellBing,
                    },
                    {
                        path: '/recorded-sessions',
                        label: 'Recorded Sessions',
                        icon: IconBellBing,
                    },
                ],
            },
        ];
    }

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
                    semidark ? 'text-white-dark' : ''
                }`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-6 py-3">
                        <NavLink
                            to="/"
                            className="main-logo flex items-center shrink-0"
                        >
                            <img
                                className="w-20 flex-none rounded-full"
                                src={usern?.image}
                                alt="logo"
                            />
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>

                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-1 p-4 py-0">
                            {menuItems.map((menu, idx) => (
                                <React.Fragment key={idx}>
                                    {menu.sectionLabel && (
                                        <h2 className="py-3 px-4 text-xs uppercase font-bold text-primary">
                                            <IconMinus className="hidden" />
                                            <span>{t(menu.sectionLabel)}</span>
                                        </h2>
                                    )}

                                    {menu.items &&
                                        menu.items.map((it, i) => (
                                            <li className="nav-item" key={i}>
                                                <NavLink
                                                    to={it.path || '#'}
                                                    className="group"
                                                >
                                                    <div className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#181F32]">
                                                        {it.icon && (
                                                            <it.icon className="shrink-0" />
                                                        )}

                                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-white-light">
                                                            {t(it.label)}
                                                        </span>
                                                    </div>
                                                </NavLink>
                                            </li>
                                        ))}
                                </React.Fragment>
                            ))}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;