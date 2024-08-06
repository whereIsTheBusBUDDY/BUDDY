CREATE TABLE board
(
    board_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    content     VARCHAR(255) NOT NULL,
    title       VARCHAR(255) NOT NULL,
    category    VARCHAR(255) NOT NULL,
    create_date TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    member_id   BIGINT,
    FOREIGN KEY (member_id) REFERENCES member (id)
);

CREATE TABLE comment
(
    comment_id      BIGINT       NOT NULL AUTO_INCREMENT,
    comment_content VARCHAR(255) NOT NULL,
    create_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    board_id        BIGINT       NOT NULL,
    member_id       BIGINT       NOT NULL,
    PRIMARY KEY (comment_id),
    CONSTRAINT FK_board_comment FOREIGN KEY (board_id) REFERENCES board (board_id),
    CONSTRAINT FK_member_comment FOREIGN KEY (member_id) REFERENCES member (id)
);
