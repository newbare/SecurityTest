package demo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
	private String userName;
	private String userPassword;

	public String getUserName() {
		return userName;
	}

	public String getUserPassword() {
		return userPassword;
	}
}
