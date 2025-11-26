package com.example.cadastro.service.email;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${MAIL_USER}")
    private String mailUser;

    @Value("${MAIL_PASSWORD}")
    private String mailPassword;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Redefinição de senha!");
        message.setText(
                "Olá!\n\n" +
                        "Para redefinir sua senha, clique no link abaixo:\n" +
                        resetLink + "\n\n" +
                        "Este link expira em 1 hora.");
        if (mailUser != null && !mailUser.isEmpty()) {
            message.setFrom(mailUser);
        }

        try {
            if (mailUser == null || mailUser.isEmpty() || mailPassword == null || mailPassword.isEmpty()) {
                log.warn("Envio de email ignorado: credenciais SMTP não configuradas");
                return;
            }
            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Falha ao enviar email de reset para {}", to, e);
        }
    }
}
