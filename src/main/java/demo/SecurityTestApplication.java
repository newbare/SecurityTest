package demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableZuulProxy
public class SecurityTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecurityTestApplication.class, args);
    }
}
