# chromepass

A very hacky proof-of-concept for a Chrome extension for [`pass`][1].

[1]: http://www.passwordstore.org/


## Installation

1. Clone this repo.
2. Edit the `path` in `org.passwordstore.pass.json`. It should point to the
   `bin/stdiopass` file in the cloned repo.
3. Edit the `PATH` and `HOME` variables in `bin/stdiopass`. The `PATH` should
   include a `:` separated list of whatever directories contain your
   `pass` and `gpg2` binaries.
4. Sym-link `org.passwordstore.pass.json` into the right directory for Chrome
   native messaging hosts. This will vary from OS to OS, see the
   [Chrome native messaging documentation][2] for details.
5. Visit `chrome://extensions`
6. Enable developer mode.
7. Click "Load unpacked extension", and select the directory for this repo.
8. Profit.


[2]: https://developer.chrome.com/extensions/nativeMessaging#native-messaging-host-location


## Assumptions

* You have GPG agent, and a GUI pinentry program.
* The names of your Web password files contain the domains of the Web sites
  they correspond to, e.g. `github.com` appears somewhere in the file name for
  your GitHub password.
* The first line of each password file contains the password.
* Subsequent lines of password files contain `:` separated key/value pairs, for
  example a password file might look like this:

       super-secret-password-123
       username: georgebrock
       email: george@example.com

## Usage

1. Visit a Web site you want to log in to.
2. Focus on the password field.
3. Trigger the extension by clicking on the toolbar icon.
4. Click on the password you want to fill (or press return)
5. The password will be filled.
