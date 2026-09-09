DELETE FROM users WHERE email='sankhathecoder7@gmail.com' OR email='admin@nyumbasalama.com';
INSERT INTO users (id, name, email, phone, password, role, is_approved, can_upload, created_at) 
VALUES ('admin-001', 'Admin', 'sankhathecoder7@gmail.com', '0792077777', '$2b$12$4vijcmuG2.vBKQO9Ra4uSeoVqBV3am8LYCxp1GSnFYOfGzEkjoqiS', 'admin', 1, 1, datetime('now'));
