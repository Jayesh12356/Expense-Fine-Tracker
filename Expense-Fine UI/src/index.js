import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { useState } from "react";

function App() {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [showMonthlyFines, setShowMonthlyFines] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [month, setMonth] = useState(1);

  function handleShowUserDetails() {
    setShowUserDetails(!showUserDetails);
    setShowExpenses(false);
    setShowMonthlyFines(false);
  }

  function handleShowExpenses() {
    setShowExpenses(!showExpenses);
    setShowUserDetails(false);
    setShowMonthlyFines(false);
  }

  function handleShowMonthlyFines() {
    setShowMonthlyFines(!showMonthlyFines);
    setShowExpenses(false);
    setShowUserDetails(false);
  }

  useEffect(
    function () {
      if (!month) return;
      async function fetchFine() {
        try {
          setIsLoading(true);
          setIsError(false);
          const res = await fetch(
            `http://127.0.0.1:5000/status_report?month=${month}`
          );
          const data = await res.json();
          setData(data);
        } catch (err) {
          setIsError(true);
          console.error(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchFine();
    },
    [month]
  );

  // return (
  //   <div className="app-container">
  //     {isError && (
  //       <div className="loader-container">
  //         <p>No Data Found</p>
  //       </div>
  //     )}
  //     {isLoading && !isError && (
  //       <div className="loader-container">
  //         <p>Loading . . .</p>
  //       </div>
  //     )}

  //     {!isLoading && !isError && (
  //       <div className="component-container">
  //         <span>Select Month</span>
  //         <select
  //           value={month}
  //           onChange={(e) => {
  //             setMonth(Number(e.target.value));
  //           }}
  //         >
  //           {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
  //             <option value={num} key={num}>
  //               {num}
  //             </option>
  //           ))}
  //         </select>
  //         <div className="button-container">
  //           <button className="button" onClick={handleShowUserDetails}>
  //             Show User Details
  //           </button>
  //           <button className="button" onClick={handleShowExpenses}>
  //             Show Expenses
  //           </button>
  //           <button className="button" onClick={handleShowMonthlyFines}>
  //             Show Monthly Fines
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //     <div
  //       className={`data-container ${
  //         showUserDetails || showExpenses || showMonthlyFines ? "wide" : ""
  //       }`}
  //     >
  //       {showUserDetails && data && (
  //         <div className="user-details show">
  //           <h2>User Details</h2>
  //           <table className="user-details-table">
  //             <tbody>
  //               <tr>
  //                 <th>Created At</th>
  //                 <td>{data.user_data.created_at}</td>
  //               </tr>
  //               <tr>
  //                 <th>Email</th>
  //                 <td>{data.user_data.email}</td>
  //               </tr>
  //               <tr>
  //                 <th>Employee ID</th>
  //                 <td>{data.user_data.emp_id}</td>
  //               </tr>
  //               <tr>
  //                 <th>Name</th>
  //                 <td>
  //                   {data.user_data.f_name} {data.user_data.l_name}
  //                 </td>
  //               </tr>
  //               <tr>
  //                 <th>Phone</th>
  //                 <td>{data.user_data.phone}</td>
  //               </tr>
  //             </tbody>
  //           </table>
  //         </div>
  //       )}

  //       {showExpenses && data && (
  //         <>
  //           <h2>Expenses:</h2>
  //           <div className="expenses-details show">
  //             <table>
  //               <thead>
  //                 <tr>
  //                   <th>Date</th>
  //                   <th>Breakfast</th>
  //                   <th>Lunch</th>
  //                   <th>Dinner</th>
  //                   <th>Fine</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {data.daily_status.map((status, index) => (
  //                   <tr key={index}>
  //                     <td>{status.date}</td>
  //                     <td>{status.breakfast}</td>
  //                     <td>{status.lunch}</td>
  //                     <td>{status.dinner}</td>
  //                     <td>{status.fine}</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </>
  //       )}

  //       {showMonthlyFines && data && (
  //         <>
  //           <h2>Monthly Fines:</h2>
  //           <div className="monthly-fines-details show">
  //             <table>
  //               <thead>
  //                 <tr>
  //                   <th>Year</th>
  //                   <th>Month</th>
  //                   <th>Fine</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {data.monthly_fines.map((fine, index) => (
  //                   <tr key={index}>
  //                     <td>{fine.year}</td>
  //                     <td>{fine.month}</td>
  //                     <td>{fine.fine}</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <div className="app-container">
      {isError && (
        <div className="loader-container">
          <p>No Data Found</p>
        </div>
      )}
      {isLoading && !isError && (
        <div className="loader-container">
          <p>Loading . . .</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="component-container">
          <div className="select-month-container">
            <span>Select Month</span>
            <select
              value={month}
              onChange={(e) => {
                setMonth(Number(e.target.value));
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option value={num} key={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="button-container">
            <button className="button" onClick={handleShowUserDetails}>
              Show User Details
            </button>
            <button className="button" onClick={handleShowExpenses}>
              Show Expenses
            </button>
            <button className="button" onClick={handleShowMonthlyFines}>
              Show Monthly Fines
            </button>
          </div>
        </div>
      )}
      <div
        className={`data-container ${
          showUserDetails || showExpenses || showMonthlyFines ? "wide" : ""
        }`}
      >
        {showUserDetails && data && !isError && !isLoading && (
          <div className="user-details show">
            <h2>User Details</h2>
            <table className="user-details-table">
              <tbody>
                <tr>
                  <th>Created At</th>
                  <td>{data.user_data.created_at}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{data.user_data.email}</td>
                </tr>
                <tr>
                  <th>Employee ID</th>
                  <td>{data.user_data.emp_id}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>
                    {data.user_data.f_name} {data.user_data.l_name}
                  </td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>{data.user_data.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {showExpenses && data && !isError && !isLoading && (
          <>
            <h2>Expenses:</h2>
            <div className="expenses-details show">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Breakfast</th>
                    <th>Lunch</th>
                    <th>Dinner</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {data.daily_status.map((status, index) => (
                    <tr key={index}>
                      <td>{status.date}</td>
                      <td>{status.breakfast}</td>
                      <td>{status.lunch}</td>
                      <td>{status.dinner}</td>
                      <td>{status.fine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {showMonthlyFines && data && !isError && !isLoading && (
          <>
            <h2>Monthly Fines:</h2>
            <div className="monthly-fines-details show">
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {data.monthly_fines.map((fine, index) => (
                    <tr key={index}>
                      <td>{fine.year}</td>
                      <td>{fine.month}</td>
                      <td>{fine.fine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
