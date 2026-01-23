"use client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import Dropdown from "../components/Dropdown";
import IconHorizontalDots from "../components/Icon/IconHorizontalDots";
import IconDollarSign from "../components/Icon/IconDollarSign";
import IconShoppingCart from "../components/Icon/IconShoppingCart";
import IconArrowLeft from "../components/Icon/IconArrowLeft";

const VIT = import.meta.env.VITE_API_URL;

const Index = () => {
  const isDark = useSelector(
    (state: any) =>
      state.themeConfig.theme === "dark" || state.themeConfig.isDarkMode
  );

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };
const [activities, setActivities] = useState<any[]>([]);
const [orders, setOrders] = useState<any[]>([]);

  const token = getCookie("access");

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<any>({});

  /* ================= API CALL (ONE TIME) ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [
          users,
          support,
          payments,
          instances,
          feedback,
          contact,
        ] = await Promise.all([
          fetch(`${VIT}/api/v1/admin/users/count`, { headers }).then(r => r.json()),
          fetch(`${VIT}/api/v1/admin/support/count`, { headers }).then(r => r.json()),
          fetch(`${VIT}/api/v1/admin/payments/count`, { headers }).then(r => r.json()),
          fetch(`${VIT}/api/v1/admin/instances/count`, { headers }).then(r => r.json()),
          fetch(`${VIT}/api/v1/admin/feedback/count`, { headers }).then(r => r.json()),
          fetch(`${VIT}/api/v1/admin/contact/count`, { headers }).then(r => r.json()),
        ]);

        setCounts({
          users: users.count || 0,
          support: support.count || 0,
          payments: payments.count || 0,
          instances: instances.count || 0,
          feedback: feedback.count || 0,
          contact: contact.count || 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);
useEffect(() => {
  const headers = { Authorization: `Bearer ${token}` };

  // Recent Activities (Users)
  fetch(`${VIT}/api/v1/admin/users/?page=1`, { headers })
    .then(res => res.json())
    .then(data => {
      const mapped = data.results.map((u: any) => ({
        text: `${u.username} joined`,
        time: new Date(u.date_joined).toLocaleTimeString(),
        status: u.is_active ? 'Completed' : 'Pending',
        color: u.is_active ? 'bg-success' : 'bg-danger',
      }));
      setActivities(mapped.slice(0, 6));
    });

  // Recent Orders (Payments)
  fetch(`${VIT}/api/v1/admin/payments/?page=1`, { headers })
    .then(res => res.json())
    .then(data => {
      setOrders(data.results.slice(0, 5));
    });

}, []);

  /* ================= MAIN AREA GRAPH ================= */
  const mainChart = {
    series: [
      {
        name: "Total",
        data: [
          counts.users,
          counts.support,
          counts.payments,
          counts.instances,
          counts.feedback,
          counts.contact,
        ],
      },
    ],
    options: {
      chart: { type: "area", toolbar: false },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: true },
      colors: ["#5dade2"],
      xaxis: {
        categories: [
          "Users",
          "Support",
          "Payments",
          "Instances",
          "Feedback",
          "Contact",
        ],
      },
    },
  };

  /* ================= SALES BY CATEGORY ================= */
  const donutChart = {
    series: [
      counts.users,
      counts.payments,
      counts.instances,
    ],
    options: {
      chart: { type: "donut" },
      labels: ["Users", "Payments", "Instances"],
      colors: ["#f39c12", "#6f42c1", "#e74c3c"],
      legend: { position: "bottom" },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                formatter: () =>
                  counts.users +
                  counts.payments +
                  counts.instances,
              },
            },
          },
        },
      },
    },
  };

  /* ================= DAILY SALES ================= */
  const dailySales = {
    series: [
      {
        name: "Sales",
        data: [
          counts.users,
          counts.support,
          counts.payments,
          counts.instances,
          counts.feedback,
          counts.contact,
          counts.users,
        ],
      },
    ],
    options: {
      chart: { type: "bar", stacked: true, toolbar: false },
      colors: ["#e2a03f"],
      xaxis: {
        categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
    },
  };

  /* ================= TOTAL ORDERS ================= */
  const totalOrders = {
    series: [
      {
        data: [
          counts.users,
          counts.payments,
          counts.instances,
          counts.feedback,
          counts.contact,
        ],
      },
    ],
    options: {
      chart: { type: "area", sparkline: { enabled: true } },
      stroke: { curve: "smooth" },
      colors: ["#00ab55"],
    },
  };

  return (
    <div>
      <ul className="flex space-x-2">
        <li>
          <Link to="/" className="text-primary">
            Dashboard
          </Link>
        </li>
      </ul>

      <div className="pt-5">
        {/* ================= TOP GRAPH ================= */}
        <div className="grid xl:grid-cols-3 gap-6 mb-6">
          <div className="panel xl:col-span-2">
            {loading ? (
              <div className="h-[325px] grid place-content-center">
                <span className="animate-spin border-2 rounded-full w-6 h-6"></span>
              </div>
            ) : (
              <ReactApexChart
                series={mainChart.series}
                options={mainChart.options}
                type="area"
                height={325}
              />
            )}
          </div>

          <div className="panel">
            <h5 className="font-semibold mb-3">Sales By Orders</h5>
            {!loading && (
              <ReactApexChart
                series={donutChart.series}
                options={donutChart.options}
                type="donut"
                height={360}
              />
            )}
          </div>
        </div>

        {/* ================= SECOND ROW ================= */}
        <div className="grid xl:grid-cols-3 gap-6 mb-6">
          <div className="panel h-full sm:col-span-2 xl:col-span-1">
            <div className="flex items-center mb-5">
                <h5 className="font-semibold text-lg dark:text-white-light">
                    Daily Orders
                    <span className="block text-white-dark text-sm font-normal">Go to columns for details.</span>
                </h5>
                <div className="ltr:ml-auto rtl:mr-auto relative">
                    <div className="w-11 h-11 text-warning bg-[#ffeccb] dark:bg-warning dark:text-[#ffeccb] grid place-content-center rounded-full">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                        <path d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <div>
                <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                    <div style={{minHeight: "175px"}}>
                         {!loading && (
                            <ReactApexChart
                                series={dailySales.series}
                                options={dailySales.options}
                                type="bar"
                                height={180}
                            />
                            )}
                    </div>
                   
                </div>
            </div>
           
          </div>

        

          <div className="panel p-0">
            <div className="p-5 flex justify-between">
              <IconShoppingCart />
              <h5 className="font-semibold text-2xl ltr:text-right rtl:text-left dark:text-white-light">{counts.payments}
                <span className="block text-sm font-normal">Total Orders</span>
              </h5>
            </div>
            {!loading && (
              <ReactApexChart
                series={totalOrders.series}
                options={totalOrders.options}
                type="area"
                height={200}
              />
            )}
          </div>
         <div className="panel h-full">
  <h5 className="font-semibold text-lg dark:text-white-light mb-5">
    Recent Activities
  </h5>

  <PerfectScrollbar className="relative h-[320px] ltr:pr-3 rtl:pl-3 -mr-3 mb-4">
    <ul className="space-y-3 text-sm">
      {activities.map((item, i) => (
        <li key={i} className="group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
            <span>{item.text}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-white-dark">{item.time}</span>

            {/* hover status */}
            <span
              className={`badge badge-outline-${
                item.status === 'Completed' ? 'success' : 'primary'
              } text-xs opacity-0 group-hover:opacity-100 transition`}
            >
              {item.status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </PerfectScrollbar>

  <div className="border-t border-white-light dark:border-white/10">
    <Link to="/users-list" className="p-4 flex justify-center text-primary font-semibold">
      View All →
    </Link>
  </div>
</div>

        </div>

        {/* ================= RECENT ACTIVITIES ================= */}
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <div className="panel h-full">
  <h5 className="font-semibold text-lg dark:text-white-light mb-5">
    Recent Orders
  </h5>

  <div className="table-responsive">
    <table className="table-hover">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Amount</th>
          <th>Payment</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((o, i) => (
          <tr key={i}>
            <td className="text-primary">{o.order_id}</td>
            <td>₹{o.amount}</td>
            <td>{o.payment_id || '—'}</td>
            <td>
              <span
                className={`badge ${
                  o.status === 'Success'
                    ? 'bg-success'
                    : 'bg-warning'
                }`}
              >
                {o.status}
              </span>
            </td>
            <td>{new Date(o.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </div>


      </div>
    </div>
  );
};

export default Index;
