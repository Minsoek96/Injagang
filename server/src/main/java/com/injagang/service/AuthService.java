package com.injagang.service;

import com.injagang.domain.User;
import com.injagang.exception.DuplicateLoginIdException;
import com.injagang.exception.InvalidLoginInfoException;
import com.injagang.repository.UserRepository;
import com.injagang.request.Login;
import com.injagang.request.SignUp;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Long login(Login login) {

        User user = userRepository.findUserByLoginId(login.getLoginId()).orElseThrow(InvalidLoginInfoException::new);

        boolean matches = passwordEncoder.matches(login.getPassword(), user.getPassword());

        if (!matches) {
            throw new InvalidLoginInfoException();
        }

        return user.getId();

    }

    public void signUp(SignUp signUp) {

        if (userRepository.findUserByLoginId(signUp.getLoginId()).isPresent()) {
            throw new DuplicateLoginIdException();
        }

        User user = User.builder()
                .loginId(signUp.getLoginId())
                .password(passwordEncoder.encode(signUp.getPassword()))
                .nickname(signUp.getNickname())
                .build();

        userRepository.save(user);


    }


}
