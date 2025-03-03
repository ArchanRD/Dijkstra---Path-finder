from flask import Flask, jsonify, request
from flask_cors import CORS
import heapq

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

metro_network = {
    "stations": {
        "A": {"name": "Central Station", "coordinates": [40.7128, -74.0060]},
        "B": {"name": "North Terminal", "coordinates": [40.7200, -74.0100]},
        "C": {"name": "East Junction", "coordinates": [40.7150, -73.9950]},
        "D": {"name": "South Gate", "coordinates": [40.7050, -74.0070]},
        "E": {"name": "West Plaza", "coordinates": [40.7130, -74.0200]},
        "F": {"name": "University Stop", "coordinates": [40.7250, -74.0050]},
        "G": {"name": "Market Square", "coordinates": [40.7180, -73.9900]}
    },
    "connections": [
        {"from": "A", "to": "B", "time": 5, "cost": 2.0, "distance": 1.2},
        {"from": "A", "to": "C", "time": 7, "cost": 2.5, "distance": 1.5},
        {"from": "A", "to": "E", "time": 4, "cost": 1.5, "distance": 1.0},
        {"from": "B", "to": "F", "time": 6, "cost": 2.0, "distance": 1.3},
        {"from": "C", "to": "D", "time": 5, "cost": 1.5, "distance": 1.1},
        {"from": "C", "to": "G", "time": 3, "cost": 1.0, "distance": 0.8},
        {"from": "D", "to": "E", "time": 8, "cost": 2.5, "distance": 1.7},
        {"from": "E", "to": "F", "time": 10, "cost": 3.0, "distance": 2.0},
        {"from": "F", "to": "G", "time": 9, "cost": 2.5, "distance": 1.9}
    ]
}


def build_graph(weight_type):
    graph = {}
    for station_id in metro_network["stations"]:
        graph[station_id] = {}
    
    for connection in metro_network["connections"]:
        src, dest = connection["from"], connection["to"]
        weight = connection[weight_type]

        graph[src][dest] = weight
        graph[dest][src] = weight
    
    return graph


def dijkstra(graph, start, end):
    priority_queue = [(0, start, [])]
    visited = set()
    
    while priority_queue:
        current_weight, current_node, path = heapq.heappop(priority_queue)
        
        if current_node == end:
            return current_weight, path + [current_node]

        if current_node in visited:
            continue
        
        visited.add(current_node)

        for neighbour, weight in graph[current_node].items():
            if neighbour not in visited:
                heapq.heappush(priority_queue, (current_weight + weight,
                                neighbour,
                                path + [current_node]))
    
    return float("inf"), []

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/find-path', methods=['POST'])
def find_path():
    data = request.json
    start = data.get('start')
    end = data.get('end')
    optimization_type = data.get('optimizationType', 'time')  # Default to time
    
    if not start or not end:
        return jsonify({"error": "Start and end stations are required"}), 400
    
    if start not in metro_network["stations"] or end not in metro_network["stations"]:
        return jsonify({"error": "Invalid station ID"}), 400
    
    graph = build_graph(optimization_type)
    total_weight, path = dijkstra(graph, start, end)
    
    if total_weight == float('inf'):
        return jsonify({"error": "No path found"}), 404
    
    # Build the response with detailed path information
    path_details = []
    for i in range(len(path) - 1):
        current = path[i]
        next_station = path[i + 1]
        
        # Find the connection details
        connection = next((c for c in metro_network["connections"] 
                         if (c["from"] == current and c["to"] == next_station) or 
                            (c["from"] == next_station and c["to"] == current)), None)
        
        if connection:
            path_details.append({
                "from": current,
                "fromName": metro_network["stations"][current]["name"],
                "to": next_station,
                "toName": metro_network["stations"][next_station]["name"],
                "time": connection["time"],
                "cost": connection["cost"],
                "distance": connection["distance"]
            })
    
    # Fix: Make sure path contains only station IDs, which are strings
    station_data = []
    for station_id in path:
        if isinstance(station_id, str) and station_id in metro_network["stations"]:
            station_data.append(metro_network["stations"][station_id])
    
    result = {
        "path": path,
        "pathDetails": path_details,
        "stations": station_data,  # Fixed version
        "totalWeight": total_weight,
        "optimizationType": optimization_type
    }
    
    return jsonify(result)


@app.route("/api/stations", methods=["GET"])
def get_stations():
    return jsonify(metro_network["stations"])


if __name__ == "__main__":
    app.run(debug=True, port=5000)
