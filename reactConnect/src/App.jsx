import { useState, useEffect } from 'react';
import * as xlsx from 'xlsx';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // The ?t= timestamp forces the browser to fetch the fresh file instead of using cache
        const response = await fetch(`/sample_data.xlsx?t=${Date.now()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const arrayBuffer = await response.arrayBuffer();
        const workbook = xlsx.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        const parsedData = xlsx.utils.sheet_to_json(sheet);
        setData(parsedData);
      } catch (error) {
        console.error("Failed to load Excel data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Load immediately on mount
    loadDashboardData();

    // Check for updates every 3 seconds
    const intervalId = setInterval(loadDashboardData, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to render status badges
  const renderStatusBadge = (status) => {
    const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
    
    switch (status?.toString().toLowerCase()) {
      case 'green':
        return <span className={`${baseStyle} bg-emerald-50 text-emerald-700 border-emerald-200`}><span className="w-1.5 h-1.5 me-1.5 bg-emerald-500 rounded-full"></span>{status}</span>;
      case 'amber':
      case 'yellow':
        return <span className={`${baseStyle} bg-amber-50 text-amber-700 border-amber-200`}><span className="w-1.5 h-1.5 me-1.5 bg-amber-500 rounded-full"></span>{status}</span>;
      case 'red':
        return <span className={`${baseStyle} bg-rose-50 text-rose-700 border-rose-200`}><span className="w-1.5 h-1.5 me-1.5 bg-rose-500 rounded-full"></span>{status}</span>;
      default:
        return <span className="text-gray-900">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Engagement Overview</h1>
          <p className="mt-2 text-sm text-slate-500">Track and manage region-wise project statuses.</p>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium animate-pulse">Reading Excel data...</p>
            </div>
          ) : data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    {Object.keys(data[0]).map((key) => (
                      <th 
                        key={key} 
                        scope="col" 
                        className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((row, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-slate-50/80 transition-colors duration-150 ease-in-out group"
                    >
                      {Object.entries(row).map(([key, val], i) => (
                        <td key={i} className="px-6 py-4 text-sm">
                          {key.toLowerCase().includes('rag') || key.toLowerCase().includes('status') 
                            ? renderStatusBadge(val) 
                            : <span className="text-slate-700 font-medium group-hover:text-slate-900">{val}</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm text-slate-500">No data found in the spreadsheet. Ensure your sheet is not empty.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}