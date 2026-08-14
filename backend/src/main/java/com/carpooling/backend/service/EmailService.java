package com.carpooling.backend.service;

import com.carpooling.backend.entity.EmailOtp;
import com.carpooling.backend.repository.EmailOtpRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Properties;

/**
 * Centralized email/notification service. Handles:
 *  - 6-digit OTP generation, delivery and verification (signup + forgot password)
 *  - Ride match / waitlist confirmation emails
 *  - Emergency SOS alert emails
 *  - Feedback acknowledgement emails
 */
@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private EmailOtpRepository emailOtpRepository;

    @Value("${spring.mail.username:blackbookssc@gmail.com}")
    private String fromEmail;

    @Value("${spring.mail.password:zzrfcbrjgaeejqli}")
    private String mailPassword;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private int mailPort;

    @Value("${app.support.email:RideTogetherSupport756@gmail.com}")
    private String supportEmail;

    private static final SecureRandom random = new SecureRandom();

    private JavaMailSender getActiveMailSender() {
        if (this.mailSender != null) {
            return this.mailSender;
        }

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(mailHost != null ? mailHost : "smtp.gmail.com");
        sender.setPort(mailPort > 0 ? mailPort : 587);
        sender.setUsername(fromEmail != null ? fromEmail : "blackbookssc@gmail.com");
        sender.setPassword(mailPassword != null ? mailPassword : "zzrfcbrjgaeejqli");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");

        return sender;
    }

    public String generate6DigitOtp() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    @Transactional
    public String createAndSendOtp(String toEmail) {
        String otpCode = generate6DigitOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(10);

        Optional<EmailOtp> existingOtp = emailOtpRepository.findByEmail(toEmail);
        EmailOtp otpEntity = existingOtp.orElseGet(EmailOtp::new);
        otpEntity.setEmail(toEmail);
        otpEntity.setOtpCode(otpCode);
        otpEntity.setExpiryTime(expiryTime);
        otpEntity.setCreatedAt(LocalDateTime.now());
        emailOtpRepository.save(otpEntity);

        sendOtpEmail(toEmail, otpCode);
        return otpCode;
    }

    private void sendOtpEmail(String toEmail, String otpCode) {
        try {
            JavaMailSender sender = getActiveMailSender();
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "RideTogether CarPooling");
            helper.setTo(toEmail.trim());
            helper.setSubject("Your Email Verification OTP Code - RideTogether");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #2563eb; margin-bottom: 4px; font-size: 24px; font-weight: 900;">RideTogether Email Verification</h2>
                        <p style="color: #64748b; font-size: 14px; margin: 0;">Secure Identity &amp; Account Verification</p>
                    </div>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello,</p>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        Thank you for using <strong>RideTogether</strong>! Please enter the following 6-digit verification code to verify your email address (<strong>%s</strong>):
                    </p>
                    <div style="background-color: #f8fafc; border: 2px solid #3b82f6; padding: 24px; text-align: center; border-radius: 16px; margin: 24px 0;">
                        <span style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #1e293b;">%s</span>
                    </div>
                    <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
                        This code will expire in <strong>10 minutes</strong>. If you did not request this verification code, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 RideTogether Inc. All rights reserved.</p>
                </div>
            """.formatted(toEmail, otpCode);

            helper.setText(htmlContent, true);
            sender.send(message);
            System.out.println("Email delivered (OTP) to: " + toEmail);
        } catch (Exception e) {
            System.err.println("SMTP Email Delivery Exception for " + toEmail + ": " + e.getMessage());
            System.out.println("OTP Code for " + toEmail + " is: " + otpCode);
        }
    }

    @Transactional
    public String createAndSendResetPasswordOtp(String toEmail) {
        String otpCode = generate6DigitOtp();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(10);

        Optional<EmailOtp> existingOtp = emailOtpRepository.findByEmail(toEmail);
        EmailOtp otpEntity = existingOtp.orElseGet(EmailOtp::new);
        otpEntity.setEmail(toEmail);
        otpEntity.setOtpCode(otpCode);
        otpEntity.setExpiryTime(expiryTime);
        otpEntity.setCreatedAt(LocalDateTime.now());
        emailOtpRepository.save(otpEntity);

        sendPasswordResetEmail(toEmail, otpCode);
        return otpCode;
    }

    private void sendPasswordResetEmail(String toEmail, String otpCode) {
        try {
            JavaMailSender sender = getActiveMailSender();
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "RideTogether Security");
            helper.setTo(toEmail.trim());
            helper.setSubject("Password Reset Verification OTP Code - RideTogether");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="background-color: #fee2e2; color: #dc2626; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Security Alert
                        </span>
                        <h2 style="color: #0f172a; margin-top: 12px; font-size: 24px; font-weight: 900;">Password Reset Request</h2>
                    </div>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello,</p>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        We received a request to reset the password for your RideTogether account (<strong>%s</strong>). Please use the following 6-digit OTP code to verify and set your new password:
                    </p>
                    <div style="background-color: #f8fafc; border: 2px solid #ef4444; padding: 24px; text-align: center; border-radius: 16px; margin: 24px 0;">
                        <span style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #1e293b;">%s</span>
                    </div>
                    <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
                        This code is valid for <strong>10 minutes</strong>. If you did not request a password reset, your account is safe and you can safely ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 RideTogether Inc. Security System.</p>
                </div>
            """.formatted(toEmail, otpCode);

            helper.setText(htmlContent, true);
            sender.send(message);
            System.out.println("Password reset OTP email delivered to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Password Reset Email Delivery Exception for " + toEmail + ": " + e.getMessage());
        }
    }

    @Transactional
    public boolean verifyOtp(String email, String inputOtp) {
        Optional<EmailOtp> otpOptional = emailOtpRepository.findByEmail(email);
        if (otpOptional.isEmpty()) {
            return false;
        }

        EmailOtp emailOtp = otpOptional.get();

        if (LocalDateTime.now().isAfter(emailOtp.getExpiryTime())) {
            emailOtpRepository.delete(emailOtp);
            return false;
        }

        if (emailOtp.getOtpCode().equals(inputOtp.trim())) {
            emailOtpRepository.delete(emailOtp);
            return true;
        }

        return false;
    }

    public void sendRideMatchEmail(String toEmail, String source, String destination, String travelDate, String driverName, Object fare) {
        try {
            JavaMailSender sender = getActiveMailSender();
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "RideTogether CarPooling");
            helper.setTo(toEmail.trim());
            helper.setSubject("Ride Match Found for Your Trip - RideTogether");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <span style="background-color: #dbeafe; color: #2563eb; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Ride Alert Match
                        </span>
                        <h2 style="color: #0f172a; margin-top: 12px; font-size: 24px; font-weight: 900;">A Driver Just Offered Your Ride!</h2>
                    </div>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        Hello! Great news &mdash; a driver matching your requested route has just listed a new ride.
                    </p>
                    <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; padding: 20px; border-radius: 16px; margin: 20px 0;">
                        <table style="width: 100%%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
                            <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Route:</td><td style="padding: 6px 0; text-align: right; font-weight: 900; color: #2563eb;">%s &rarr; %s</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Travel Date:</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Driver:</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Fare:</td><td style="padding: 6px 0; text-align: right; font-weight: 900; color: #059669;">&#8377;%s / seat</td></tr>
                        </table>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                        You received this automated notification because you joined the RideTogether waiting list.
                        <br />&copy; 2026 RideTogether Inc. All rights reserved.
                    </p>
                </div>
            """.formatted(source, destination, travelDate, driverName, fare.toString());

            helper.setText(htmlContent, true);
            sender.send(message);
            System.out.println("Ride match email delivered to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Ride Match Email Delivery Exception for " + toEmail + ": " + e.getMessage());
        }
    }

    public void sendWaitlistConfirmationEmail(String toEmail, String source, String destination, String travelDate) {
        try {
            JavaMailSender sender = getActiveMailSender();
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "RideTogether CarPooling");
            helper.setTo(toEmail.trim());
            helper.setSubject("Ride Waiting List Confirmation - RideTogether");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <span style="background-color: #fef3c7; color: #d97706; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Waiting List Confirmation
                        </span>
                        <h2 style="color: #0f172a; margin-top: 12px; font-size: 24px; font-weight: 900;">You Are on the Ride Waiting List!</h2>
                    </div>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        Hello! You have successfully joined the RideTogether waiting list. We are monitoring driver trip listings for your requested route.
                    </p>
                    <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; padding: 20px; border-radius: 16px; margin: 20px 0;">
                        <table style="width: 100%%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
                            <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Requested Route:</td><td style="padding: 6px 0; text-align: right; font-weight: 900; color: #2563eb;">%s &rarr; %s</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Travel Date:</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">%s</td></tr>
                            <tr><td style="padding: 6px 0; color: #64748b; font-weight: bold;">Notification Email:</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">%s</td></tr>
                        </table>
                    </div>
                    <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #1e40af; font-size: 13px; font-weight: bold; margin: 0;">
                            Next Step: As soon as a driver offers a ride matching your route, we will instantly send an in-app notification and email you directly to book your seat!
                        </p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                        Thank you for using RideTogether CarPooling!
                        <br />&copy; 2026 RideTogether Inc. All rights reserved.
                    </p>
                </div>
            """.formatted(source, destination, travelDate, toEmail);

            helper.setText(htmlContent, true);
            sender.send(message);
            System.out.println("Waitlist acknowledgement email delivered to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Waitlist Acknowledgment Email Delivery Exception for " + toEmail + ": " + e.getMessage());
        }
    }

    /**
     * Sends an SOS / emergency alert email to the platform's support/dispatch mailbox
     * (and, if provided, to a personal emergency contact address).
     */
    public void sendEmergencyAlertEmail(String recipientEmail, String triggeredByName, String triggeredByPhone,
                                         Double latitude, Double longitude, Long rideId, String note) {
        try {
            JavaMailSender sender = getActiveMailSender();
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "RideTogether Safety Dispatch");
            helper.setTo(recipientEmail.trim());
            helper.setSubject("EMERGENCY SOS ALERT TRIGGERED - RideTogether");

            String mapLink = (latitude != null && longitude != null)
                    ? "https://www.google.com/maps?q=" + latitude + "," + longitude
                    : "Location unavailable";

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 2px solid #ef4444; border-radius: 20px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="background-color: #fee2e2; color: #dc2626; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                            Emergency SOS
                        </span>
                        <h2 style="color: #b91c1c; margin-top: 12px; font-size: 24px; font-weight: 900;">Emergency Alert Triggered</h2>
                    </div>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        <strong>%s</strong> (%s) has triggered an emergency SOS alert%s.
                    </p>
                    <div style="background-color: #fef2f2; border: 2px solid #fecaca; padding: 20px; border-radius: 16px; margin: 20px 0;">
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e293b;"><strong>Last known location:</strong></p>
                        <a href="%s" style="color: #2563eb; font-weight: bold; word-break: break-all;">%s</a>
                        %s
                    </div>
                    <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
                        Please contact the rider immediately and reach out to local emergency services if you cannot get through.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 RideTogether Inc. Safety System.</p>
                </div>
            """.formatted(
                    triggeredByName != null ? triggeredByName : "A RideTogether user",
                    triggeredByPhone != null ? triggeredByPhone : "phone not on file",
                    rideId != null ? " during ride #" + rideId : "",
                    mapLink, mapLink,
                    (note != null && !note.isBlank()) ? "<p style=\"margin-top:10px;font-size:13px;color:#334155;\"><strong>Note:</strong> " + note + "</p>" : ""
            );

            helper.setText(htmlContent, true);
            sender.send(message);
            System.out.println("Emergency alert email delivered to: " + recipientEmail);
        } catch (Exception e) {
            System.err.println("Emergency Alert Email Delivery Exception: " + e.getMessage());
        }
    }

    public String getSupportEmail() {
        return supportEmail;
    }

    /** Sends the rider a confirmation that their feedback was received. */
    public void sendFeedbackAcknowledgementEmail(String toEmail, int rating, String comments) {
        try {
            JavaMailSender sender = getActiveMailSender();
            MimeMessage message = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "RideTogether CarPooling");
            helper.setTo(toEmail.trim());
            helper.setSubject("Thanks for your feedback - RideTogether");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
                    <h2 style="color: #2563eb; font-size: 22px; font-weight: 900;">Thanks for your feedback!</h2>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        We received your %d-star rating%s. Our team reviews every submission to keep improving RideTogether.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">&copy; 2026 RideTogether Inc. All rights reserved.</p>
                </div>
            """.formatted(rating, (comments != null && !comments.isBlank()) ? " and your comments" : "");

            helper.setText(htmlContent, true);
            sender.send(message);
            System.out.println("Feedback acknowledgement email delivered to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Feedback Email Delivery Exception: " + e.getMessage());
        }
    }
}
