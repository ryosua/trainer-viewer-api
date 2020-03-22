CREATE TABLE hike (
    id INT,
    carpool_options VARCHAR(1000),
    elevation_gain INT NOT NULL,
    expected_round_trip_time INT NOT NULL,
    miles DOUBLE PRECISION NOT NULL,
    title VARCHAR(1000) NOT NULL,
    parking_location VARCHAR(1000) NOT NULL,
    preparation_notes VARCHAR(1000),
    starting_elevation INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    link VARCHAR(1000)
)