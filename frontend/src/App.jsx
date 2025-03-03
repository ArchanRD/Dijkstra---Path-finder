import React, { useState, useEffect } from "react";

const MapNavigator = () => {
  const [stations, setStations] = useState({});
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [optimizationType, setOptimizationType] = useState("time");
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/stations")
      .then((response) => response.json())
      .then((data) => setStations(data));
  }, []);

  const findPath = async () => {
    if (!startStation || !endStation) {
      setError("Please select both start and end stations");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/find-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: startStation,
          end: endStation,
          optimizationType: optimizationType,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPath(data);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getWeightLabel = () => {
    switch (optimizationType) {
      case "time":
        return "minutes";
      case "cost":
        return "$";
      case "distance":
        return "km";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold text-center">
            Metro Map Navigator
          </h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Station
              </label>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 appearance-none"
                  value={startStation}
                  onChange={(e) => setStartStation(e.target.value)}
                >
                  <option value="">Select start station</option>
                  {Object.entries(stations).map(([id, station]) => (
                    <option key={`start-${id}`} value={id}>
                      {station.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Station
              </label>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 appearance-none"
                  value={endStation}
                  onChange={(e) => setEndStation(e.target.value)}
                >
                  <option value="">Select end station</option>
                  {Object.entries(stations).map(([id, station]) => (
                    <option key={`end-${id}`} value={id}>
                      {station.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Optimize By
              </label>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 appearance-none"
                  value={optimizationType}
                  onChange={(e) => setOptimizationType(e.target.value)}
                >
                  <option value="time">Time</option>
                  <option value="cost">Cost</option>
                  <option value="distance">Distance</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              className={`py-2 px-6 rounded-md font-bold text-white transition duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              }`}
              onClick={findPath}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Finding Path...
                </span>
              ) : (
                "Find Best Route"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}
        </div>
      </div>

      {path && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="text-xl font-bold">Best Route Found</h2>
          </div>

          <div className="p-6">
            <div className="mb-6 bg-blue-50 p-4 rounded-md">
              <div className="font-medium text-lg">
                Total {optimizationType}: {path.totalWeight} {getWeightLabel()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                From {stations[startStation]?.name || startStation} to{" "}
                {stations[endStation]?.name || endStation}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex flex-col">
                {path.pathDetails.map((segment, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                        {segment.from}
                      </div>

                      <div className="flex-1 mx-2 relative">
                        <div className="border-t-2 border-dashed border-gray-400"></div>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-sm text-xs font-medium">
                          <span className="text-red-600">
                            {segment.time} min
                          </span>{" "}
                          |
                          <span className="text-green-600">
                            {" "}
                            ${segment.cost}
                          </span>{" "}
                          |
                          <span className="text-blue-600">
                            {" "}
                            {segment.distance} km
                          </span>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                        {segment.to}
                      </div>
                    </div>

                    <div className="flex justify-between mt-2 text-sm font-medium text-gray-700">
                      <span>{segment.fromName}</span>
                      <span>{segment.toName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>
                  This route was optimized for the lowest {optimizationType}.
                  Change the optimization type to see other routes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapNavigator;
