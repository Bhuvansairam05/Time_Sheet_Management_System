function ManagerDashboard() {
  // Dummy data (replace with API later)
  const employees = [
    { id: 1, name: "T yashwanth", time: "06:30" },
    { id: 2, name: "P V R pavan", time: "04:15" },
    { id: 3, name: "Ram", time: "05:00" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                S.No
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                Employee Name
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Time Spent
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Details
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {employees.map((emp, index) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm">
                  {index + 1}
                </td>

                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {emp.name}
                </td>

                <td className="px-4 py-3 text-center text-sm">
                  {emp.time}
                </td>

                <td className="px-4 py-3 text-center">
                  <button className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600 transition text-sm font-medium">
                    Details
                  </button>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagerDashboard;