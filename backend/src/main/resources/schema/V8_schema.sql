CREATE TABLE eta_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_line INT NOT NULL,
    station_id BIGINT NOT NULL,
    date_time DATETIME NOT NULL
);
