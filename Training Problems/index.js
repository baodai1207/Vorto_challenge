function calculateEuclidean(pointA, pointB) {
  return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
}

function nearestNeighbor(data) {
  const unvisitedLoads = [...data];
  const drivers = [];

  // I have to change to for loop instead of while loop because it gave me weird errors 
  // something about:
  // Fatal JavaScript invalid size error 169220804
  for (let i = 0; i < unvisitedLoads.length; i++) {
    const driverRoute = [];
    const startingPoint = { x: 0, y: 0 }; // Depot location
    let currentPoint = startingPoint;
    let remainingDriveTime = 12 * 60; // 12 hours in minutes;

    for (let j = 0; j < unvisitedLoads.length; j++) {
      let shortestDistance = Infinity;
      let nearestLoadIndex = -1;

      for (let k = 0; k < unvisitedLoads.length; k++) {
        const load = unvisitedLoads[k];
        const pickupPoint = load.pickup;
        const dropoffPoint = load.dropoff;
        const pickupDistance = calculateEuclidean(currentPoint, pickupPoint);
        const dropoffDistance = calculateEuclidean(pickupPoint, dropoffPoint);
        const returnDistance = calculateEuclidean(dropoffPoint, startingPoint);
        const totalDistance = pickupDistance + dropoffDistance + returnDistance;

        if (totalDistance < shortestDistance && remainingDriveTime >= totalDistance) {
          shortestDistance = totalDistance;
          nearestLoadIndex = k;
        }
      }

      if (nearestLoadIndex !== -1) {
        const nearestLoad = unvisitedLoads[nearestLoadIndex];
        driverRoute.push(nearestLoad.loadNumber);
        currentPoint = nearestLoad.dropoff;
        remainingDriveTime -= shortestDistance;
        unvisitedLoads.splice(nearestLoadIndex, 1);
      } else {
        // If there are no suitable loads, check if there are loads in the route
        if (driverRoute.length > 0) {
          // return to the depot
          const returnDistance = calculateEuclidean(currentPoint, startingPoint);
          remainingDriveTime -= returnDistance;
          currentPoint = startingPoint;
          break;
        } else {
          break; // End the route if no suitable loads
        }
      }

      // Check if the 12 hour shift is exceeded
      if (remainingDriveTime < 0) {
        break; 
      }
    }

    drivers.push(driverRoute);
  }

  return drivers;
}

function readProblemFile(text) {
  const lines = text.trim().split('\n');
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
const filePath = process.argv[2];

if (!filePath) {
  console.error(`Cannot find ${filePath}`);
} else {
  // Read the text file and parse data
  const textData = fs.readFileSync(filePath, 'utf-8');
  const data = readProblemFile(textData);

  const solution = nearestNeighbor(data);
  solution.forEach(route => console.log(`[${route.join(',')}]`));
}
