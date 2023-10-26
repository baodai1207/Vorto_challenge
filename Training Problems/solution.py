import math

def calculate_euclidean(pointA, pointB):
    return math.sqrt((pointA['x'] - pointB['x']) ** 2 + (pointA['y'] - pointB['y']) ** 2)

def nearest_neighbor(data):
    unvisited_loads = data.copy()
    drivers = []

    while unvisited_loads:
        driver_route = []
        starting_point = {'x': 0, 'y': 0}  # Depot location
        current_point = starting_point
        remaining_drive_time = 12 * 60  # 12 hours in minutes

        while unvisited_loads:
            shortest_distance = float('inf')
            nearest_load_index = -1

            for i in range(len(unvisited_loads)):
                load = unvisited_loads[i]
                pickup_point = load['pickup']
                dropoff_point = load['dropoff']
                pickup_distance = calculate_euclidean(current_point, pickup_point)
                dropoff_distance = calculate_euclidean(pickup_point, dropoff_point)
                return_distance = calculate_euclidean(dropoff_point, starting_point)
                total_distance = pickup_distance + dropoff_distance + return_distance

                if total_distance < shortest_distance and remaining_drive_time >= total_distance:
                    shortest_distance = total_distance
                    nearest_load_index = i

            if nearest_load_index != -1:
                nearest_load = unvisited_loads[nearest_load_index]
                driver_route.append(nearest_load['loadNumber'])
                current_point = nearest_load['dropoff']
                remaining_drive_time -= shortest_distance
                unvisited_loads.pop(nearest_load_index)
            else:
                return_distance = calculate_euclidean(current_point, starting_point)
                if remaining_drive_time < return_distance:
                    # If it does, assume the last load was not completed, remove it, and return to the depot
                    driver_route.pop()
                    break  # Terminate the loop and return to the depot
                else:
                    # Continue with returning to the depot
                    remaining_drive_time -= return_distance
                    current_point = starting_point
                    driver_route.append(0)  # 0 represents returning to the depot

            if remaining_drive_time < 0:
                break  # Shift duration exceeded

        drivers.append(driver_route)

    return drivers

def read_problem_file(text):
    lines = text.strip().split('\n')
    header = lines[0].split(' ')  # Extract header information
    data = []

    for line in lines[1:]:
        columns = line.split(' ')
        load_number = int(columns[0])
        pickup_coords = [float(coord) for coord in columns[1].strip('()').split(',')]
        dropoff_coords = [float(coord) for coord in columns[2].strip('()').split(',')]

        pickup = {'x': pickup_coords[0], 'y': pickup_coords[1]}
        dropoff = {'x': dropoff_coords[0], 'y': dropoff_coords[1]}

        data.append({'loadNumber': load_number, 'pickup': pickup, 'dropoff': dropoff})

    return data

file = 'problem2.txt'  # Update file path
with open(file, 'r') as f:
    text_data = f.read()

data = read_problem_file(text_data)
solution = nearest_neighbor(data)
for route in solution:
    print(route)
