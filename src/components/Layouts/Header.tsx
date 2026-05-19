import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleRTL, toggleTheme, toggleSidebar } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconCalendar from '../Icon/IconCalendar';
import IconEdit from '../Icon/IconEdit';
import IconChatNotification from '../Icon/IconChatNotification';
import IconSearch from '../Icon/IconSearch';
import IconXCircle from '../Icon/IconXCircle';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconMailDot from '../Icon/IconMailDot';
import IconArrowLeft from '../Icon/IconArrowLeft';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconBellBing from '../Icon/IconBellBing';
import IconSettings from '../Icon/IconSettings';
import IconUser from '../Icon/IconUser';
import IconOpenBook from '../Icon/IconOpenBook';
import IconDollarSign from '../Icon/IconDollarSign';
import IconMail from '../Icon/IconMail';
import IconLockDots from '../Icon/IconLockDots';
import IconLogout from '../Icon/IconLogout';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuApps from '../Icon/Menu/IconMenuApps';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuMore from '../Icon/Menu/IconMenuMore';
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";
import { Trash2Icon } from 'lucide-react';

const Header = () => {
<ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    //   const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
const [profileLoading, setProfileLoading] = useState(true);
const fetchProfile = async () => {
  try {
    const res = await api.get("/api/v1/profile/getUserDetails");
    setProfile(res.data.data);
  } catch (err) {
    console.error("Profile fetch failed:", err);
  } finally {
    setProfileLoading(false);
  }
};
useEffect(() => {
  fetchProfile();
}, []);
const username =
  profile?.firstName || profile?.lastName
    ? `${profile?.firstName || ""} ${profile?.lastName || ""}`
    : "Admin";
    const email = profile?.email || "";
const profileImage = profile?.image
  ? profile.image.startsWith("http")
    ? profile.image
    : `https://${profile.image}`
  : "https://t4.ftcdn.net/jpg/01/24/65/69/240_F_124656969_x3y8YVzvrqFZyv3YLWNo6PJaC88SYxqM.jpg";

const role = profile?.role || "";

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    localStorage.getItem("access_token")

    const location = useLocation();
    useEffect(() => {
        const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
window.addEventListener("storage", (e) => {
  if (e.key === "access_token" && !e.newValue) {
    window.location.href = "/";
  }
});

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    function createMarkup(messages: any) {
        return { __html: messages };
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg g xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span className="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong className="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong className="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong className="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };
    

    const [search, setSearch] = useState(false);

    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const { t } = useTranslation();
const user = localStorage.getItem("user") || "{}";
const userIDnew = localStorage.getItem("userId") || "{}";


    const navigate = useNavigate();
   if (!userIDnew) {
  navigate('/');
}
useEffect(() => {
  const SESSION_TIME_MS = 15 * 60 * 1000; // 15 minutes
  let idleTimer: ReturnType<typeof setTimeout>;

  const resetIdleTimer = () => {
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
      logout(); // <-- YOUR logout function
    }, SESSION_TIME_MS);
  };

  // User activity events
  const events = [
    "mousemove",
    "mousedown",
    "click",
    "keydown",
    "scroll",
    "touchstart"
  ];

  events.forEach(event =>
    window.addEventListener(event, resetIdleTimer)
  );

  resetIdleTimer(); // start timer on load

  return () => {
    clearTimeout(idleTimer);
    events.forEach(event =>
      window.removeEventListener(event, resetIdleTimer)
    );
  };
}, []);
const deleteAccount = async () => {
  try {
    const res = await api.delete(
      "/api/v1/profile/deleteProfile"
    );


    toast.success("Account deleted successfully");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userId");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

  } catch (err) {
    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Delete account failed"
    );
  }
};
const logout = async () => {
  try {
    // ✅ HIT BACKEND LOGOUT API
    await api.post("/api/v1/users/auth/logout/");
  } catch (err) {
    // logout fail bhi ho to frontend clear hona chahiye
    console.warn("Logout API failed:", err);
  } finally {
    // ✅ CLEAR LOCAL STORAGE
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);

    toast.info("You have been logged out!", {
      position: "top-center",
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  }
};

const userID = localStorage.getItem("userId") || "{}";

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative bg-white flex w-full items-center px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center ltr:mr-2 rtl:ml-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ltr:-ml-1 rtl:-mr-1 inline" src="/assets/orllogo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300"></span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            onClick={() => {
                                dispatch(toggleSidebar());
                            }}
                        >
                            <IconMenu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="ltr:mr-2 rtl:ml-2 hidden sm:block">
                        <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                            
                            <li>
                                <Link to="/admin-change-password" className="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60">
                                    <IconEdit />
                                </Link>
                            </li>
{userID < 2 ? (
    <>
        <li>
            <Link to="/admin-messages" className="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60">
                <IconChatNotification />
            </Link>
        </li>
        <li>
            <Link to="/admin-notifications" className="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60">
                <IconBellBing />
            </Link>
        </li>
    </>
) : (
    <li>
        <Link to="/Messages" className="hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60" />
    </li>
)}



                        </ul>
                    </div>
                    <div className="sm:flex-1 ltr:sm:ml-0 ltr:ml-auto sm:rtl:mr-0 rtl:mr-auto flex items-center space-x-1.5 lg:space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                          
                            <button
                                type="button"
                                onClick={() => setSearch(!search)}
                                className="search_btn sm:hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
                            >
                                <IconSearch className="w-4.5 h-4.5 mx-auto dark:text-[#d0d2d6]" />
                            </button>
                        </div>
                        <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${
                                        themeConfig.theme === 'light' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('dark'));
                                    }}
                                >
                                    <IconSun />
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'dark' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('system'));
                                    }}
                                >
                                    <IconMoon />
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'system' &&
                                        'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('light'));
                                    }}
                                >
                                    <IconLaptop />
                                </button>
                            )}
                        </div>
                        
                        <div className="dropdown shrink-0 flex">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={
                                <img className="w-18 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100"  style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                }} src={profileImage} alt="userProfile" />
                            }
                            >
                                <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <img className="rounded-md w-10 h-10 object-cover"  src={profileImage} style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                }} alt="userProfile" />
                                            <div className="ltr:pl-4 rtl:pr-4 truncate">
                                                <h4 className="text-base">
                                                    {username}
                                                </h4>
                                               <p className="text-xs text-gray-500 truncate">
                                                    {email}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link to="/courses" className="dark:hover:text-white">
                                            <IconOpenBook className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Courses
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin-payment-list" className="dark:hover:text-white">
                                            <IconDollarSign className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Payment
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin-change-password" className="dark:hover:text-white">
                                            <IconSettings className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Change Password
                                        </Link>
                                    </li>
                                   <li>
                                        <Link to="/users/profile" className="dark:hover:text-white">
                                            <IconUser className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={deleteAccount}>
                                        <Trash2Icon className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />    Delete Account
                                        </button>
                                    </li>
                                   
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                       <button
                                            onClick={logout}
                                            className="text-danger !py-3 flex items-center w-full text-left"
                                        >
                                            <IconLogout className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 rotate-90 shrink-0" />
                                            Sign Out
                                        </button>

                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* horizontal menu */}
                <ul className="horizontal-menu hidden py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse bg-white border-t border-[#ebedf2] dark:border-[#191e3a] dark:bg-black text-black dark:text-white-dark">
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDashboard className="shrink-0" />
                                <span className="px-1">{t('dashboard')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/">{t('sales')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/analytics">{t('analytics')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/finance">{t('finance')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/crypto">{t('crypto')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuApps className="shrink-0" />
                                <span className="px-1">{t('apps')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/apps/chat">{t('chat')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/mailbox">{t('mailbox')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/todolist">{t('todo_list')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/notes">{t('notes')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/scrumboard">{t('scrumboard')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/contacts">{t('contacts')}</NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('invoice')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/apps/invoice/list">{t('list')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/preview">{t('preview')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/add">{t('add')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/edit">{t('edit')}</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <NavLink to="/apps/calendar">{t('calendar')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuComponents className="shrink-0" />
                                <span className="px-1">{t('components')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/components/tabs">{t('tabs')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/accordions">{t('accordions')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/modals">{t('modals')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/cards">{t('cards')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/carousel">{t('carousel')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/countdown">{t('countdown')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/counter">{t('counter')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/sweetalert">{t('sweet_alerts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/timeline">{t('timeline')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/notifications">{t('notifications')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/media-object">{t('media_object')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/list-group">{t('list_group')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/pricing-table">{t('pricing_tables')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/lightbox">{t('lightbox')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuElements className="shrink-0" />
                                <span className="px-1">{t('elements')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/elements/alerts">{t('alerts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/avatar">{t('avatar')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/badges">{t('badges')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/breadcrumbs">{t('breadcrumbs')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/buttons">{t('buttons')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/buttons-group">{t('button_groups')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/color-library">{t('color_library')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/dropdown">{t('dropdown')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/infobox">{t('infobox')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/jumbotron">{t('jumbotron')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/loader">{t('loader')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/pagination">{t('pagination')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/popovers">{t('popovers')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/progress-bar">{t('progress_bar')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/search">{t('search')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/tooltips">{t('tooltips')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/treeview">{t('treeview')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/typography">{t('typography')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDatatables className="shrink-0" />
                                <span className="px-1">{t('tables')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/tables">{t('tables')}</NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('datatables')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/datatables/basic">{t('basic')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/advanced">{t('advanced')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/skin">{t('skin')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/order-sorting">{t('order_sorting')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/multi-column">{t('multi_column')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/multiple-tables">{t('multiple_tables')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/alt-pagination">{t('alt_pagination')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/checkbox">{t('checkbox')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/range-search">{t('range_search')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/export">{t('export')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/column-chooser">{t('column_chooser')}</NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuForms className="shrink-0" />
                                <span className="px-1">{t('forms')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/forms/basic">{t('basic')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/input-group">{t('input_group')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/layouts">{t('layouts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/validation">{t('validation')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/input-mask">{t('input_mask')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/select2">{t('select2')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/touchspin">{t('touchspin')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/checkbox-radio">{t('checkbox_and_radio')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/switches">{t('switches')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/wizards">{t('wizards')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/file-upload">{t('file_upload')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/quill-editor">{t('quill_editor')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/markdown-editor">{t('markdown_editor')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/date-picker">{t('date_and_range_picker')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/clipboard">{t('clipboard')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuPages className="shrink-0" />
                                <span className="px-1">{t('pages')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li className="relative">
                                <button type="button">
                                    {t('users')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/users/profile">{t('profile')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/users/user-account-settings">{t('account_settings')}</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <NavLink to="/pages/knowledge-base">{t('knowledge_base')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/contact-us-boxed" target="_blank">
                                    {t('contact_us_boxed')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/contact-us-cover" target="_blank">
                                    {t('contact_us_cover')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/faq">{t('faq')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/coming-soon-boxed" target="_blank">
                                    {t('coming_soon_boxed')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/coming-soon-cover" target="_blank">
                                    {t('coming_soon_cover')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/maintenence" target="_blank">
                                    {t('maintenence')}
                                </NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('error')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/pages/error404" target="_blank">
                                            {t('404')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/pages/error500" target="_blank">
                                            {t('500')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/pages/error503" target="_blank">
                                            {t('503')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('login')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/auth/cover-login" target="_blank">
                                            {t('login_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/auth/boxed-signin" target="_blank">
                                            {t('login_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('register')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/auth/cover-register" target="_blank">
                                            {t('register_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/register" target="_blank">
                                            {t('register_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('password_recovery')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/auth/cover-password-reset" target="_blank">
                                            {t('recover_id_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/auth/boxed-password-reset" target="_blank">
                                            {t('recover_id_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('lockscreen')}
                                    <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-90 -rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 ltr:left-[95%] rtl:right-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    <li>
                                        <NavLink to="/auth/cover-lockscreen" target="_blank">
                                            {t('unlock_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/auth/boxed-lockscreen" target="_blank">
                                            {t('unlock_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuMore className="shrink-0" />
                                <span className="px-1">{t('more')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/dragndrop">{t('drag_and_drop')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/charts">{t('charts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/font-icons">{t('font_icons')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/widgets">{t('widgets')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="https://vristo.sbthemes.com" target="_blank">
                                    {t('documentation')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
