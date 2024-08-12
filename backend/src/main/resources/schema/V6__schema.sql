CREATE TABLE notification_read_status
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    notification_id BIGINT NOT NULL,
    member_id       BIGINT NOT NULL
);
