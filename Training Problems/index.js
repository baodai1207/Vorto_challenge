function calculateEuclidean(pointA, pointB) {
  return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
}

function nearestNeighbor(data) {
  const unvisitedLoads = [...data];
  const drivers = [];

  while (unvisitedLoads.length > 0) {
    const driverRoute = [];
    const startingPoint = { x: 0, y: 0 }; // Depot location
    let currentPoint = startingPoint;
    let remainingDriveTime = 12 * 60; // 12 hours in minutes;
    // let remainingLoads = 3; // Assume maximum loads per driver is 3 (just for testing)

    while (unvisitedLoads.length > 0) {
      let shortestDistance = Infinity;
      let nearestLoadIndex = -1;

      for (let i = 0; i < unvisitedLoads.length; i++) {
        const load = unvisitedLoads[i];
        const pickupPoint = load.pickup;
        const dropoffPoint = load.dropoff;
        const pickupDistance = calculateEuclidean(currentPoint, pickupPoint);
        const dropoffDistance = calculateEuclidean(pickupPoint, dropoffPoint);
        const totalDistance = pickupDistance + dropoffDistance;

        if (totalDistance < shortestDistance && remainingDriveTime >= totalDistance) {
          shortestDistance = totalDistance;
          nearestLoadIndex = i;
        }
      }

      if (nearestLoadIndex !== -1) {
        const nearestLoad = unvisitedLoads[nearestLoadIndex];
        driverRoute.push(nearestLoad.loadNumber);
        currentPoint = nearestLoad.dropoff;
        remainingDriveTime -= shortestDistance;
        unvisitedLoads.splice(nearestLoadIndex, 1);
        // remainingLoads--;
      } else {
        break; // No suitable loads left for this driver
      }
    }

    drivers.push(driverRoute);
  }

  return drivers;
}

// Sample data
function readProblemFile(text) {
  const lines = text.trim().split('\n');
  const header = lines[0].split(' '); // Extract header information
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(' ');
    const loadNumber = parseInt(columns[0]);
    const pickupCoords = columns[1].match(/-?\d+\.\d+/g); // Extract pickup coordinates
    const dropoffCoords = columns[2].match(/-?\d+\.\d+/g); // Extract dropoff coordinates

    const pickup = { x: parseFloat(pickupCoords[0]), y: parseFloat(pickupCoords[1]) };
    const dropoff = { x: parseFloat(dropoffCoords[0]), y: parseFloat(dropoffCoords[1]) };

    data.push({ loadNumber, pickup, dropoff });
  }

  return data;
}

const fs = require('fs');

// Read the text file and parse data
const file = 'problem2.txt'; // Update with your file path
const textData = fs.readFileSync(file, 'utf-8');
const data = readProblemFile(textData);

const solution = nearestNeighbor(data);
solution.forEach(route => console.log(`[${route.join(',')}]`));
