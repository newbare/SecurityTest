package demo;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.UserProfile;
import org.springframework.social.connect.web.ProviderSignInUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
public class SecuredController {

    @Autowired
    private ProviderSignInUtils providerSignInUtils;

//	@RequestMapping("/user")
//	public User getUser(@RequestParam("name") String userName, @RequestParam("password") String userPassword) {
//		return new User();
//	}
	@RequestMapping("/user")
	public Principal login(Principal user) {
		return user;
	}

	@RequestMapping("/test")
	public String getUser(Principal user) {
	    return user.getName();
	}

	@RequestMapping("/accounts")
	public void createAccount(@RequestBody Account account) {
		System.out.println(account.getUsername());
	}

	@RequestMapping(value = "/articles/{category}/{articleId}/comments/{commentId}", method=RequestMethod.GET)
	public String patchTest() {
	    return "Intercepted";
	}

	@RequestMapping("/signup")
    public void signup(Principal user, WebRequest request, HttpServletResponse httpServletResponse) {
        Connection<?> connection = providerSignInUtils.getConnectionFromSession(request);

        if (connection != null) {
            UserProfile socialMediaProfile = connection.fetchUserProfile();
            System.out.println(socialMediaProfile.getFirstName());

            List<GrantedAuthority> gas = new ArrayList<GrantedAuthority>();
            gas.add(new SimpleGrantedAuthority("ROLE_USER"));
            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("user", null, gas));

            try {
                // redirect url
                httpServletResponse.sendRedirect("/");
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }

    }
}
