package com.unt.campusxchange.users.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/access")
public class RoleBasedSecurityTestController {

    @PreAuthorize("hasAuthority('SCOPE_[ROLE_USER]')")
    @GetMapping("/hello")
    public String hello(){
        return "hello";
    }
    @PreAuthorize("hasAuthority('SCOPE_[ROLE_USER]')")
    @GetMapping("/test")
    public String test(){
        return "test";
    }

}
