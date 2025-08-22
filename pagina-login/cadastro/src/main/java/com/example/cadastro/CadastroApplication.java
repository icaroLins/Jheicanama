package com.example.cadastro;

import com.example.cadastro.model.User;
import com.example.cadastro.model.*;
import com.example.cadastro.repository.*;
import com.example.cadastro.service.*;
import java.time.LocalDate;

public class CadastroApplication {
    public static void main(String[] args) {

        var person = new User();

        person.setCpf("081.465.061-94");
        person.setDataNacimento(LocalDate.of(2007, 01, 30));
        person.setEmail("Icaro@gmail.com");
        person.setIp(1L);
        person.setName("Icaro Lins gomes");
        person.setPassWord("1234");

        
    }
}