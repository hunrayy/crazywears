import { Chart } from "react-chartjs-2";
import useAdminChart from "./useAdminChart"; // your hook
import "./adminChart.css"
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const AdminChart = () => {
  const {
    chartValues,
    months,
    years,
    selectedMonthIndex,
    selectedYear,
    setSelectedMonthIndex,
    setSelectedYear,
    isLoading,
    isFetchingBase,
    isFetchingFiltered,
    error,
  } = useAdminChart();



  const handleChangeMonth = (e) => {
    setSelectedMonthIndex(Number(e.target.value));
  };

  const handleChangeYear = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const data = {
    labels: chartValues.labels,
    datasets: [
      {
        label: 'Unique Visitors (Line)',
        type: 'line',
        data: chartValues.values,
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: false,

      },
     
      
      {
        label: 'Unique Visitors (Bar)',
        type: 'bar',
        data: chartValues.values,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
    ],
    elements: {
      line: {
        borderJoinStyle: 'miter',   // sharper corners
      },
      point: {
        radius: 3,                  // your point size
        hoverRadius: 6,
      }
    },
    
  };


  const options = {
    // animation: { duration: 800, easing: 'easeInOutQuad' },
    animation: { duration: 0},
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Number Of Unique Visitors Per Day" } },
    },
  };

  const isFetchingNewData = isFetchingBase || isFetchingFiltered;


  // Show full skeleton ONLY if loading AND no chart data yet
  if (isLoading && (!chartValues.labels.length)) {
    return (
      <div
        style={{
          backgroundColor: "#eee",
          width: "100%",
          height: 500,
          borderRadius: 4,
          animation: "pulse 1.5s infinite",
        }}
      >
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.4; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger"><p>Error fetching chart data</p></div>;

  return (
    <div style={{ position: "relative" }} className="chart-container">
      {/* Filters */}
      <div>
        <label>Select Year: &nbsp;</label>
        <select onChange={handleChangeYear} value={selectedYear}>
          {years.map((year, i) => (
            <option key={i} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="my-2">
        <label>Select Month: &nbsp;</label>
        <select onChange={handleChangeMonth} value={selectedMonthIndex}>
          {months.map((month, i) => (
            <option key={i} value={i}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <h4>Product Sales Overview</h4>
      {/* Chart */}
      <div style={{ position: "relative", height: 500 }}>
        <Chart type="bar" data={data} options={options} />
        {isFetchingNewData && chartValues.labels.length > 0 && (
        // <div
        //   style={{
        //     position: "absolute",
        //     top: 0,
        //     left: 0,
        //     right: 0,
        //     bottom: 0,
        //     backgroundColor: "rgba(255, 255, 255, 0.6)",
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     pointerEvents: "none",
        //   }}
        // >
        // </div>
        <div></div>
      )}
      </div>
    </div>
  );
};

export default AdminChart;




{/* Loading overlay during fetching */}
// {(isFetchingBase || isFetchingFiltered) && (
//   <div
//     style={{
//       position: "absolute",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(255, 255, 255, 0.6)",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       pointerEvents: "none", // allows clicks to pass through if you want
//       zIndex: 10,
//     }}
//   >
//   </div>
// )}






