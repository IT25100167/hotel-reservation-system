package edu.sliit.service;

import edu.sliit.dto.User;

import java.util.List;

public interface UserService {
    void addUser(User user);
    List<User> getUser();
    void deleteById(Integer id);
    User updateUser(User user);
}
