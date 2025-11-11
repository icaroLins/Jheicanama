package com.example.cadastro.service.email;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Redefinição de senha!");
        message.setText("Olá!\\n" + //
                "\\n" + //
                "Para redefinir sua senha, clique no link abaixo:\\n" + //
                "\" + resetLink + \"\\n" + //
                "\\n" + //
                "Este link expira em 1 hora.");
        message.setFrom("jheicanama@gmail.com");

        javaMailSender.send(message);
    }
}
