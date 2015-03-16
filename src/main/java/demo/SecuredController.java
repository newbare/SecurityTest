package demo;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecuredController {

	@RequestMapping("/user")
	public User getUser(@RequestParam("name") String userName, @RequestParam("password") String userPassword) {
		return new User();
	}
}
