package com.ssafy.buddy;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/reset-password-success")
    public String passwordResetSuccess() {
        return "reset-password-success";
    }
}
