-- Create Users Table - Add phone_number & password column
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(15),
ADD COLUMN password VARCHAR(255);