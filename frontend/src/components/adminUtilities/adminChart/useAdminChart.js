import { useState, useMemo, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchChartData = async ({ queryKey }) => {
  const [_key, { year, period }] = queryKey;
  const token = Cookies.get("authToken");

  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/admin/get-chart-data`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: period ? { year, period } : { year },
    }
  );
  console.log(res)
  return res.data;
};

const useAdminChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  // Initial fetch to get all months/years (no `period`)
  const {
    data: baseData,
    isLoading: isInitialLoading,
    isFetching: isFetchingBase,
    isError: baseError,
  } = useQuery({
    queryKey: ["admin-chart", { year: selectedYear }],
    queryFn: fetchChartData,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchInterval: 1000 * 60 * 5,

  });

  const months = baseData?.labels ?? [];
  const years = baseData?.years ?? [];

  // Get the selected period based on current month index
  const selectedMonth = months[selectedMonthIndex];

  // Fetch daily data for that period
  const {
    data: filteredData,
    isLoading: isFilteredLoading,
    isFetching: isFetchingFiltered,
    isError: filteredError,
  } = useQuery({
    queryKey: ["admin-chart", { year: selectedYear, period: selectedMonth }],
    queryFn: fetchChartData,
    enabled: !!selectedMonth, // prevent fetch if month is not ready yet
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    refetchInterval: 1000 * 60 * 5,

  });

  const updateChart = (dailyData) => {
    const sortedData = [...dailyData].sort((a, b) => {
      const parseDate = (str) => {
        const [day, month, year] = str.split("-").map(Number);
        return new Date(year, month - 1, day);
      };
      return parseDate(a.date) - parseDate(b.date);
    });

    const labels = sortedData.map((item) => item.date);
    // const values = sortedData.map((item) => item.ips.length);
    const values = sortedData.map((item) => item.ips);

    return { labels, values };
  };


  const lastChartValuesRef = useRef({ labels: [], values: [] });
  const chartValues = useMemo(() => {
    if (filteredData?.data) {
      const updated = updateChart(filteredData.data);
      lastChartValuesRef.current = updated;
      return updated;
    }
    return lastChartValuesRef.current;
  }, [filteredData]);

  return {
    chartValues,
    months,
    years,
    selectedMonthIndex,
    selectedYear,
    isLoading: isInitialLoading || isFilteredLoading,
    error: baseError || filteredError,
    setSelectedMonthIndex,
    setSelectedYear,
    isFetchingBase,
    isFetchingFiltered
  };
};

export default useAdminChart;
























// import { useState, useMemo } from 'react';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import { useQuery } from '@tanstack/react-query';

// const fetchChartData = async ({ queryKey }) => {
//   const [_key, { year, period }] = queryKey;
//   const token = Cookies.get('authToken');
//   const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-chart-data`, {
//     headers: { Authorization: `Bearer ${token}` },
//     params: { year, period }
//   });
//   return data;
// };

// export const useAdminChart = () => {
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

//   const baseQuery = useQuery({
//     queryKey: ['baseChartData'],
//     queryFn: async () => {
//       const token = Cookies.get('authToken');
//       const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-chart-data`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return data;
//     }
//   });

//   const months = baseQuery.data?.labels || [];
//   const years = baseQuery.data?.years || [];

//   // Derived current period
//   const currentPeriod = months[selectedMonthIndex] || months[0];

//   const chartQuery = useQuery({
//     queryKey: ['chartData', { year: selectedYear, period: currentPeriod }],
//     queryFn: fetchChartData,
//     enabled: !!selectedYear && months.length > 0
//   });

//   const parsedData = useMemo(() => {
//     const raw = chartQuery.data?.data || [];
//     const sorted = [...raw].sort((a, b) => {
//       const [d1, m1, y1] = a.date.split('-').map(Number);
//       const [d2, m2, y2] = b.date.split('-').map(Number);
//       return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
//     });

//     return {
//       labels: sorted.map(item => item.date),
//       values: sorted.map(item => item.ips.length)
//     };
//   }, [chartQuery.data]);

//   const handleMonthChange = (e) => {
//     setSelectedMonthIndex(parseInt(e.target.value));
//   };

//   const handleYearChange = (e) => {
//     setSelectedYear(Number(e.target.value));
//     setSelectedMonthIndex(0); // Optional: reset month on year change
//   };

//   return {
//     selectedYear,
//     selectedMonthIndex,
//     months,
//     years,
//     chartData: parsedData,
//     isLoading: baseQuery.isLoading || chartQuery.isLoading,
//     handleMonthChange,
//     handleYearChange
//   };
// };
