package demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

@Configuration
@EnableWebSecurity
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	@Override
    public void configure(WebSecurity webSecurity) throws Exception
    {
        webSecurity.ignoring().antMatchers("/resources/**");
    }

	@Override
	protected void configure(HttpSecurity http) throws Exception {

	    http.httpBasic()
//	      .csrf().disable()
//	        .authorizeRequests()
//	            .antMatchers(HttpMethod.GET, "/user").authenticated()
//	            .and()
//	        .authorizeRequests().antMatchers(HttpMethod.POST, "/user").permitAll()
	      .and().authorizeRequests()
	          .antMatchers("/index.html", "/partials/signin.html", "/partials/signup.html", "/").permitAll()
	      .and().authorizeRequests().antMatchers("/user", "/test").authenticated()
//	      .anyRequest().authenticated()
	      .and().logout()
	      .and().addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
	      .csrf().csrfTokenRepository(csrfTokenRepository());
	}

	@Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//	    auth.userDetailsService(new UserDetailServiceImpl());
		auth.inMemoryAuthentication().withUser("user").password("password").roles("USER");
    }

	private CsrfTokenRepository csrfTokenRepository() {
		  HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
		  repository.setHeaderName("X-XSRF-TOKEN");
		  return repository;
		}
}
