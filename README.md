
# Dijkstra -- Path finder

This project is an implementation of Dijkstra algorithm which is used to find the shortest path from given source to destination. The project represents a metro stations where,

- User selects source and dest stations
- He can choose time, cost or distance as priority

The algorithm lists out the paths for selected stations.

## Installation
### 1. Clone the github repository
```bash
git clone https://github.com/ArchanRD/Dijkstra---Path-finder.git
```
### 2. Install dependencies
#### First install dependencies for frontend:
```bash
cd frontend
npm install
```
#### Install dependencies in backend: 
First create a virtual environment and activate it:

**Linux**:

```bash
python3 -m venv myvenv
source myvenv/bin/activate
```

**Windows**:

```bash
python3 -m venv myenv
myenv\Scripts\activate
```

After the virtual env is set, install flask:
```bash
pip install Flask
```

### 3. Run the web application
#### Start frontend:
```bash
npm run dev
```

#### Start backend:
```bash
python3 app.py
```

You have successfully completed the setup🎉!