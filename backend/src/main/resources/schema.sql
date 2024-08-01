CREATE TABLE IF NOT EXISTS member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    favorite_line INT NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    refresh_token VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS station (
    id int AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(255) NOT NULL,
    bus_line INT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL
 );

CREATE TABLE IF NOT EXISTS bookmark (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    station_id int NOT NULL,
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
    FOREIGN KEY (station_id) REFERENCES station(id) ON DELETE CASCADE
);
