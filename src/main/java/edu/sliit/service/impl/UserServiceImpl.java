package edu.sliit.service.impl;

import edu.sliit.dto.LoginRequest;
import edu.sliit.dto.LoginResponse;
import edu.sliit.dto.User;
import edu.sliit.entity.Role;
import edu.sliit.entity.UserEntity;
import edu.sliit.repository.UserRepository;
import edu.sliit.service.UserService;
import edu.sliit.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;


@RequiredArgsConstructor
@Service

public class UserServiceImpl implements UserService {

    final UserRepository userRepository;

    @Override
    public void addUsers(User user) {

        // Duplicate email validation
        if (userRepository.existsByEmail(user.getEmail())){
            throw new RuntimeException("Email already exists");

        }
        //Email validation
        if (!ValidationUtil.isValidEmail(user.getEmail())){
            throw new RuntimeException("Invalid email");
        }
        // Phone validation
        if(!ValidationUtil.isValidPhoneNumber(user.getPhoneNum())){
            throw new RuntimeException("Invalid phone number");
        }
        // Password validation
        if(!ValidationUtil.isValidPassword(user.getPassword())){
            throw new RuntimeException("Password must contain at least 6 characters");
        }
        UserEntity userEntity=new UserEntity();
        userEntity.setUserId(user.getUserId());
        userEntity.setName(user.getName());
        userEntity.setEmail(user.getEmail());
        userEntity.setPassword(user.getPassword());
        userEntity.setPhoneNum(user.getPhoneNum());
        userEntity.setRole(Role.CUSTOMER); 

        userRepository.save(userEntity);

    }

    @Override
    public List<User> getUser() {
       List<UserEntity> userEntities=userRepository.findAll();
        List<User> users=new ArrayList<>();
        for(UserEntity entity: userEntities){
        User user=new User();
        user.setUserId(entity.getUserId());
        user.setName(entity.getName());
        user.setEmail(entity.getEmail());
        user.setPassword(entity.getPassword());
        user.setPhoneNum(entity.getPhoneNum());
        user.setRole(entity.getRole());
         users.add(user);

        }
        return users;
    }

    @Override
    public void deleteById(Integer id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
        userRepository.delete(userEntity);

    }

    @Override
    public void updateUser(User user) {
        UserEntity existingUser=userRepository.findById(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Duplicate email validation
        if(!existingUser.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(user.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        // Email validation
        if(!ValidationUtil.isValidEmail(user.getEmail())){
            throw new RuntimeException("Invalid email");
        }

        // Phone validation
        if(!ValidationUtil.isValidPhoneNumber(user.getPhoneNum())){
            throw new RuntimeException("Invalid phone number");
        }

        // Password validation
        if(!ValidationUtil.isValidPassword(user.getPassword())){
            throw new RuntimeException("Password must contain at least 6 characters");
        }

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setPhoneNum(user.getPhoneNum());
        existingUser.setRole(user.getRole());

        userRepository.save(existingUser);


    }

    @Override
    public User findById(int id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User user=new User();
        user.setUserId(userEntity.getUserId());
        user.setEmail(userEntity.getEmail());
        user.setName(userEntity.getName());
        user.setPassword(userEntity.getPassword());
        user.setPhoneNum(userEntity.getPhoneNum());
        user.setRole(userEntity.getRole());
        return user;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        return new LoginResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }
}
