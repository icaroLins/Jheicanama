package com.example.cadastro.service.ResetPassword;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.cadastro.model.Candidate;
import com.example.cadastro.model.User;
import com.example.cadastro.model.ResetPassword.PasswordResetToken;
import com.example.cadastro.repository.UserRepository;
import com.example.cadastro.repository.ResetPassword.PasswordResetTokenRepository;
import com.example.cadastro.service.email.EmailService;



@Service
public class PasswordResetService {
    
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url:http://127.0.0.1:5500}")
    private String frontendUrl;

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    public void sendResetLink(String email){
        Candidate user = userRepository.findByEmail(email);

        if(user == null){
            return;
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpirationDate(LocalDateTime.now().plusHours(1));

        tokenRepository.save(resetToken);

        String link = frontendUrl + "/reset-senha.html?token=" + token;
        try{
            emailService.sendResetEmail(user.getEmail(), link);
        }catch(Exception e){
        }

    }


    public void resetPassword(String token, String newPassword){
         PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Token expirado");
        }

        Candidate user = resetToken.getUser();
        user.setPassWord(passwordEncoder.encode(newPassword)); 
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }


}
