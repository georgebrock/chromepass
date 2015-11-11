# chromepass

A very hacky proof-of-concept for a Chrome extension for [`pass`][1].

[1]: http://www.passwordstore.org/


## Usage

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
