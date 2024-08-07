ALTER TABLE notification
    ADD COLUMN sender_name VARCHAR(255),
    ADD COLUMN station_name VARCHAR(255),
    ADD COLUMN bus_number INT,
    ADD COLUMN suggestion TEXT,
    CHANGE post_id board_id BIGINT;
