import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import WebLayout from '../components/Layouts/WebLayout';

const finalRoutes = routes.map((route) => {
  console.log('route=',route);
  if (route.layout === "web") {
    console.log('hi');
    return {
      ...route,
      element: <WebLayout>{route.element}</WebLayout>
    };
  } else {
    return {
      ...route,
      element:
        route.layout === 'blank'
          ? <BlankLayout>{route.element}</BlankLayout>
          : <DefaultLayout>{route.element}</DefaultLayout>,
    };
  }
});


const router = createBrowserRouter(finalRoutes);

export default router;
