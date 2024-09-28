-- Create Users Table - Add OTP column
ALTER TABLE users
ADD COLUMN otp VARCHAR(15)