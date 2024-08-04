CREATE TABLE boarding
(
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id     BIGINT   NOT NULL,
    bus_number    INT      NOT NULL,
    boarding_time DATETIME NOT NULL
);

CREATE TABLE notification
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    receiver_id BIGINT,
    type        VARCHAR(255) NOT NULL,
    timestamp   DATETIME     NOT NULL,
    post_id     BIGINT
);
