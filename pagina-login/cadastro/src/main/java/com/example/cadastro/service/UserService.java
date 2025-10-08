package com.example.cadastro.service;
import com.example.cadastro.model.Candidate;
import com.example.cadastro.repository.UserRepository;
import com.example.cadastro.security.JwtUtil;
import com.example.cadastro.validator.ValidatorCpf;

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

    public Candidate register(Candidate user){

        String cpfLimpo = user.getCpf().replaceAll("\\D", "");
        user.setCpf(cpfLimpo);

        if(!ValidatorCpf.isValid(user.getCpf())){
            throw new RuntimeException("CPF invalido!");
        }

        if(userRepository.findByCpf(user.getCpf()) != null){
            throw new RuntimeException("CPF ja cadastrado!");
        }
        if(userRepository.findByEmail(user.getEmail()) != null){
            throw new RuntimeException("Email ja cadastrado!");
        }

        user.setPassWord(passwordEnconder.encode(user.getPassWord()));
        return userRepository.save(user);
    }

    public Candidate searchByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public Candidate searchByCPF(String cpf){
        cpf = cpf.replaceAll("[^\\d]", "");
        return userRepository.findByCpf(cpf);
    }

    public boolean validarLogin(String identificador, String senha){
        Candidate user;

        if(identificador.matches("\\d+")){
            String cpfLimpo = identificador.replaceAll("[^\\d]", "");
            user = userRepository.findByCpf(cpfLimpo);
        }else{
            user = userRepository.findByEmail(identificador);
        }

        if(user == null){
            return false;
        }

        if(!passwordEnconder.matches(senha, user.getPassWord())){
            return false;
        }

        return true;
    }

    public String gerarToken(Candidate user){
        return jwtUtil.generateToken(user.getCpf());
    }

    
   
}
