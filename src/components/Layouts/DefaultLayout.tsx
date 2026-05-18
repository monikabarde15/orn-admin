import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import Footer from './Footer';
import Header from './Header';
import Setting from './Setting';
import Sidebar from './Sidebar';
import Portals from '../../components/Portals';

const DefaultLayout = ({ children }: PropsWithChildren) => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [showLoader, setShowLoader] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const onScrollHandler = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler);

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            screenLoader[0].classList.add('animate__fadeOut');
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

        return () => {
            window.removeEventListener('onscroll', onScrollHandler);
        };
    }, []);

   return (
    <div className="relative">
        {/* sidebar menu overlay */}
        <div
            className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 bg-[black]/60 z-50 lg:hidden`}
            onClick={() => dispatch(toggleSidebar())}
        ></div>

        {/* screen loader */}
        {showLoader && (
            <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                Loading...
            </div>
        )}

        <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
            {showTopButton && (
                <button
                    type="button"
                    className="btn btn-outline-primary rounded-full p-2 animate-pulse"
                    onClick={goToTop}
                >
                    ↑
                </button>
            )}
        </div>

        <Setting />

        <div className={`${themeConfig.navbar} main-container text-black dark:text-white-dark min-h-screen`}>
            <Sidebar />

            <div className="main-content flex flex-col min-h-screen">
                <Header />

                <Suspense>
                    <div className={`${themeConfig.animation} p-6 animate__animated`}>
                        {children}
                    </div>
                </Suspense>

                <Footer />
                <Portals />
            </div>
        </div>
    </div>
);
};

export default DefaultLayout;
