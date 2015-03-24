package demo;

import java.security.Principal;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecuredController {

//	@RequestMapping("/user")
//	public User getUser(@RequestParam("name") String userName, @RequestParam("password") String userPassword) {
//		return new User();
//	}
	@RequestMapping("/user")
	public Principal login(Principal user) {
		return user;
	}

	@RequestMapping("/test")
	public User getUser() {
		return new User();
	}

	@RequestMapping("/accounts")
	public void createAccount(@RequestBody Account account) {
		System.out.println(account.getUsername());
	}
}
