# chromepass

A very hacky proof-of-concept for a Chrome extension for [`pass`][1].

[1]: http://www.passwordstore.org/


## Installation

1. Clone this repo.
2. Run `bin/setup` to generate custom settings files, and add symlinks in the
   right places.
3. Visit `chrome://extensions`
4. Enable developer mode.
5. Click "Load unpacked extension", and select the directory for this repo.
6. Profit.


## Assumptions

* You have GPG agent, and a GUI pinentry program.
* The names of your Web password files contain the domains of the Web sites
  they correspond to, e.g. `github.com` appears somewhere in the file name for
  your GitHub password.
* The first line of each password file contains the password.

## Usage

1. Visit a Web site you want to log in to.
2. Focus on the password field.
3. Trigger the extension by clicking on the toolbar icon.
4. Click on the password you want to fill (or press return)
5. The password will be filled.
