package com.example.pasir_kuchta_julita.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Hello, World!";
    }
    @GetMapping("/api/info")
    public Map<String, String> getInfo() {
        Map<String, String> appInfo = new HashMap<>();
        appInfo.put("appName", "Aplikacja Budżetowa");
        appInfo.put("version", "1.0");
        appInfo.put("message", "Witaj w aplikacji budżetowej stworzonej ze Spring Boot!");
        return appInfo;
    }
}
