package com.unt.campusxchange.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmailWithOTP(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("CampusXchange Marketplace <campusxchange24@gmail.com>");
        message.setTo(to);
        message.setSubject("CampusXchange Registration OTP");
        message.setText("Please verify your account registration on CampusXchange with OTP: " + otp);
        mailSender.send(message);
    }
}
