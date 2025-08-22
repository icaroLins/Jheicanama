package com.example.cadastro.service;

import com.example.cadastro.model.User;
import com.example.cadastro.repository.UserRepository;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User register(User user){
        if(userRepository.findByCpf(user.getCpf()) != null){
            throw new RuntimeException("CPF ja cadastrado!");
        }
        if(userRepository.findByEmail(user.getEmail()) != null){
            throw new RuntimeException("Email ja cadastrado!");
        }
        return userRepository.save(user);
    }

    public User searchByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public User searchByCPF(String cpf){
        return userRepository.findByCpf(cpf);
    }
}
