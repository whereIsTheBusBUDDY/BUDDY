ALTER TABLE board DROP FOREIGN KEY board_ibfk_1;
ALTER TABLE board
    ADD CONSTRAINT board_ibfk_1 FOREIGN KEY (member_id) REFERENCES member (id) ON DELETE CASCADE;

ALTER TABLE comment DROP FOREIGN KEY FK_member_comment;
ALTER TABLE comment
    ADD CONSTRAINT FK_member_comment FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE;
