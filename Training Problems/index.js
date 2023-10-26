function calculateEuclidean(pointA, pointB) {
  return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
}

function nearestNeighbor(data) {
  const unvisitedLoads = [...data];
  const drivers = [];

  // While loop does a better job to loop through all the loads
  while (unvisitedLoads.length > 0) {
    const driverRoute = [];
    const startingPoint = { x: 0, y: 0 }; // Depot location
    let currentPoint = startingPoint;
    let remainingDriveTime = 12 * 60; // 12 hours in minutes;
    let nearestLoadIndex;
    let shortestDistance;

    // Change to do-while loop here to avoid JavaScript Size error
    do {
      nearestLoadIndex = -1;
      shortestDistance = Infinity;
      // Loop through all the loads
      for (let i = 0; i < unvisitedLoads.length; i++) {
        const load = unvisitedLoads[i];
        const pickupPoint = load.pickup;
        const dropoffPoint = load.dropoff;
        const pickupDistance = calculateEuclidean(currentPoint, pickupPoint);
        const dropoffDistance = calculateEuclidean(pickupPoint, dropoffPoint);
        const returnDistance = calculateEuclidean(dropoffPoint, startingPoint);
        const totalDistance = pickupDistance + dropoffDistance + returnDistance;

        if (totalDistance < shortestDistance && remainingDriveTime >= totalDistance) {
          shortestDistance = totalDistance;
          nearestLoadIndex = i;
        }
      }

      // If the nearestLoadIndex not equal -1, it means a load was found
      if (nearestLoadIndex !== -1) {
        const nearestLoad = unvisitedLoads[nearestLoadIndex];
        driverRoute.push(nearestLoad.loadNumber);
        currentPoint = nearestLoad.dropoff;
        remainingDriveTime -= shortestDistance;
        unvisitedLoads.splice(nearestLoadIndex, 1);
      } else if (driverRoute.length > 0) {
        // Return to the depot if there are loads in the route
        const returnDistance = calculateEuclidean(currentPoint, startingPoint);
        remainingDriveTime -= returnDistance;
        currentPoint = startingPoint;
      }
    } while (nearestLoadIndex !== -1 && remainingDriveTime >= 0);

    if (driverRoute.length > 0) {
      // Ensure that the drive distance is less than 720, including depot trips
      const remainingLoads = calculateEuclidean(currentPoint, startingPoint);
      remainingDriveTime -= remainingLoads;
      drivers.push(driverRoute);
    }
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