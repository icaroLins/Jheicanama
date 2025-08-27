package com.example.cadastro.service;

import com.example.cadastro.model.User;
import com.example.cadastro.repository.UserRepository;
import com.example.cadastro.security.JwtUtil;
import javax.management.RuntimeErrorException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    PasswordEncoder passwordEnconder;

    public User register(User user){
        if(userRepository.findByCpf(user.getCpf()) != null){
            throw new RuntimeException("CPF ja cadastrado!");
        }
        if(userRepository.findByEmail(user.getEmail()) != null){
            throw new RuntimeException("Email ja cadastrado!");
        }

        user.setPassWord(passwordEnconder.encode(user.getPassWord()));
        return userRepository.save(user);
    }

    public User searchByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public User searchByCPF(String cpf){
        return userRepository.findByCpf(cpf);
    }

    public boolean validarLogin(String email, String senha){
        User user = userRepository.findByEmail(email);

        if(user == null){
            return false;
        }

        if(!passwordEnconder.matches(senha, user.getPassWord())){
            return false;
        }

        return true;
    }

    public String gerarToken(User user){
        return jwtUtil.generateToken(user.getCpf());
    }
   
}
