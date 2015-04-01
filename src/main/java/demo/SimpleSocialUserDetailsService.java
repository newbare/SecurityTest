package demo;

import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.social.security.SocialUserDetails;
import org.springframework.social.security.SocialUserDetailsService;

public class SimpleSocialUserDetailsService implements SocialUserDetailsService {

	@Override
	public SocialUserDetails loadUserByUserId(String userId)
			throws UsernameNotFoundException, DataAccessException {
		// TODO Auto-generated method stub
        System.out.println("loadUserByUserId");
		return null;
	}

}
