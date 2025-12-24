package com.twitterapi.controller;

import com.twitterapi.dto.response.UserResponseDto;
import com.twitterapi.security.AuthUserDetails;
import com.twitterapi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/byUsername")
    public UserResponseDto findByUsername(@RequestParam("username") String username) {
        return userService.findByUsername(username);
    }

    @GetMapping("/me")
    public UserResponseDto me(@AuthenticationPrincipal AuthUserDetails userDetails) {
        return userService.me(userDetails.getId());
    }

    @GetMapping("/all")
    public List<UserResponseDto> allUsers(@AuthenticationPrincipal AuthUserDetails userDetails) {
        return userService.findAllUsers(userDetails.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAsAdmin(@PathVariable Long id,
                                                  @AuthenticationPrincipal AuthUserDetails userDetails) {
        userService.deleteUserAsAdmin(userDetails.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
