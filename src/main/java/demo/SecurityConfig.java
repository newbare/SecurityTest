package demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	@Override
	protected void configure(HttpSecurity http) throws Exception {

	    http.csrf().disable()
	        .authorizeRequests()
	            .antMatchers(HttpMethod.GET, "/user").authenticated()
	            .and()
	        .authorizeRequests().antMatchers(HttpMethod.POST, "/user").permitAll()
	        .and().httpBasic();
	}

	@Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
	    auth.userDetailsService(new UserDetailServiceImpl());
    }
}
