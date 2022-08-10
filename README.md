<div id="top"></div>

<br />
<div align="center">

  <h3 align="center">Work Tracker</h3>

  <p align="center">
    Tracks your work time and stores it in a database. Perfect to use with a raspberry to selfhost a local server.
    <br />
    <br />
    <a href="https://github.com/cr4yfish/work-tracker/issues">Report Bug</a>
    ·
    <a href="https://github.com/cr4yfish/work-tracker/issues">Request Feature</a>
  </p>
</div>


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#settings">Settings</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>


## About The Project


So I got a job which does not track my worktime automatically, but I need to keep track of it in order to not work for free.
I came up with the idea of basically taking my foodTracker and using it's base to build another application which
can track time I spent working and store it in a database. It then can automatically choose the entries from the current workweek and
add the time values up to a week overview which then tells me how much I have worked so far and how much worktime I have left.

All in a single-page webapp dashboard, so you never have to switch pages.


### Built With

* [node.js](https://nodejs.org/en/)
* [nedb](https://www.npmjs.com/package/@seald-io/nedb)
* [ejs](https://ejs.co/)



### Prerequisites

* node
    ```
    sudo apt-get node
    ```

* npm
  ```sh
  npm install npm@latest -g
  ```

For the update client to work
* pm2
 ```
 npm install pm2
 ```

### Installation

1. Install NodeJS
2. Clone the repo
    ```sh
    git clone https://github.com/cr4yfish/work-tracker-next.git
    ```
3. Perform first-time setup
    ```sh
    cd work-tracker-next
    ```
    ```sh
    yarn
    ```
or
    ```sh
    npm i
    ```
Wait for the script to finish (The script just makes the 'update.sh' file an executable and adds the server to pm2).

4. Build
    ```sh
    npm run build
    ```
    
5. Start
    ```sh
    npm run start
    ```

You can then use pm2 or systemd - or whatever you prefer. For a PM2 Setup, continue reading.

(Optional)
6. Pm2 setup
    ```sh
    pm2 start npm --name work-tracker-next -- start
    ```
    
## Usage

1. Open   
    ```sh
    http://{your IP address or the one from the server}:3000
    ```

<p align="right">(<a href="#top">back to top</a>)</p>
