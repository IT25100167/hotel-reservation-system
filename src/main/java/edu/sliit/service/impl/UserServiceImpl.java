package edu.sliit.service.impl;

import edu.sliit.dto.User;
import edu.sliit.entity.UserEntity;
import edu.sliit.repository.UserRepository;
import edu.sliit.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service

public class UserServiceImpl implements UserService {

    final UserRepository userRepository;

    @Override
    public void addUsers(User user) {
        UserEntity userEntity=new UserEntity();
        userEntity.setUserId(user.getUserId());
        userEntity.setName(user.getName());
        userEntity.setEmail(user.getEmail());
        userEntity.setPassword(user.getPassword());
        userEntity.setPhoneNum(user.getPhoneNum());

        userRepository.save(userEntity);

    }

    @Override
    public List<User> getUser() {
        return List.of();
    }

    @Override
    public void deleteById(Integer id) {

    }

    @Override
    public User updateUser(User user) {
        return null;
    }

    @Override
    public User findById(int id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User user=new User();
        user.setUserId(user.getUserId());
        user.setEmail(user.getEmail());
        user.setName(user.getName());
        user.setPassword(user.getPassword());
        user.setPhoneNum(userEntity.getPhoneNum());
        return user;
    }
}
