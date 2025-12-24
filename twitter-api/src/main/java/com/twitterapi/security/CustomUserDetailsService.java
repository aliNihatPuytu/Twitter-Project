package com.twitterapi.security;

import com.twitterapi.entity.User;
import com.twitterapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String input = identifier == null ? "" : identifier.trim();

        User user = userRepository.findByUsername(input)
                .or(() -> userRepository.findByEmail(input))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new AuthUserDetails(user.getId(), user.getUsername(), user.getPassword(), user.isAdmin());
    }
}
